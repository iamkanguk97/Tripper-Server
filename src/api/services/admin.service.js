const { QueryTypes } = require('sequelize');
const { saltHashPassword, validatePassword } = require('../utils/crypto-util');
const { sequelize } = require('../models/index');
const { generateAdminAccessToken, generateRefreshToken, saveAdminRefreshToken } = require('../utils/jwt-util');
const { getReportsQuery, getReportDetailQuery } = require('../queries/admin.query');
const { pageResponse } = require('../../config/response/response-template');

const Admin = require('../models/Admin/Admin');
const AdminSalt = require('../models/Admin/AdminSalt');
const ReportImage = require('../models/Report/ReportImage');
const Report = require('../models/Report/Report');
const RedisClient = require('../../config/redis');

const signUp = async (email, password, nickname) => {
    const secretData = saltHashPassword(password);
    const adminHashedPassword = secretData.hashedPassword;
    const adminSalt = secretData.salt;
    let newAdminId;

    let transaction;
    try {
        // BEGIN TRANSACTION
        transaction = await sequelize.transaction();

        // Admin 테이블에 INSERT
        newAdminId = (
            await Admin.create(
                {
                    ADMIN_EMAIL: email,
                    ADMIN_NICKNAME: nickname,
                    ADMIN_PASSWORD: adminHashedPassword
                },
                { transaction }
            )
        ).dataValues.IDX;

        // AdminSalt 테이블에 INSERT
        await AdminSalt.create(
            {
                ADMIN_IDX: newAdminId,
                SALT: adminSalt
            },
            { transaction }
        );

        await transaction.commit();
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }

    return {
        newAdminId,
        email,
        nickname
    };
};

const login = async (adminIdx, password) => {
    // 앞에서 가져온 adminIdx를 가지고 hashedPassword와 salt를 가져옴
    const adminSecurityData = await Admin.findAll({
        include: [
            {
                model: AdminSalt,
                required: true
            }
        ],
        where: {
            IDX: adminIdx
        }
    });

    if (!adminSecurityData.length) {
        throw new Error('[관리자 로그인] 로직상의 문제가 발생했습니다. 개발자에게 문의해주세요.');
    }

    const salt = adminSecurityData[0].dataValues.AdminSalt.SALT;
    const hashedPassword = adminSecurityData[0].dataValues.ADMIN_PASSWORD;
    const isValidate = validatePassword(password, salt, hashedPassword); // 세가지 요소를 가지고 비밀번호가 맞는지 확인

    // 검증 실패 -> 비밀번호 오류
    if (!isValidate) {
        return false;
    }

    const jwtAT = generateAdminAccessToken(adminIdx);
    const jwtRT = generateRefreshToken();

    const redisClient = new RedisClient();
    await redisClient.connect();
    await saveAdminRefreshToken(redisClient, adminIdx, jwtRT);
    await redisClient.quit();

    return {
        adminIdx,
        token: {
            access_token: jwtAT,
            refresh_token: jwtRT
        }
    };
};

const getReports = async (pageNumber, contentSize) => {
    const totalReportCount = await Report.count(); // 신고 총 개수
    const totalPages = Math.ceil(totalReportCount / contentSize); // 페이지 전체 카운트

    if (pageNumber > totalPages) pageNumber = totalPages;

    const skipSize = (pageNumber - 1) * contentSize; // 다음 페이지로 갈때 건너뛸 리스트 개수

    const getReportsResult = await sequelize.query(getReportsQuery, {
        type: QueryTypes.SELECT,
        replacements: {
            skipSize,
            contentSize
        }
    });

    return {
        pagination: pageResponse(pageNumber, totalPages),
        reports: getReportsResult
    };
};

const getReportDetail = async reportIdx => {
    let transaction;

    try {
        // BEGIN TRANSACTION
        transaction = await sequelize.transaction();

        // (1) REPORT 테이블에서 가져오기
        const reportResult = (
            await sequelize.query(
                getReportDetailQuery,
                {
                    type: QueryTypes.SELECT,
                    replacements: {
                        reportIdx
                    }
                },
                { transaction }
            )
        )[0];

        // (2) REPORT_IMAGE 테이블에서 가져오기
        const reportImageResult = await ReportImage.findAll(
            {
                attributes: ['REPORT_IMAGE_URL'],
                where: {
                    REPORT_IDX: reportIdx
                },
                raw: true
            },
            { transaction }
        );

        const reportImageResultArr = reportImageResult.map(img => {
            return img.REPORT_IMAGE_URL;
        });

        // COMMIT
        await transaction.commit();

        return {
            report: reportResult,
            reportImages: reportImageResultArr
        };
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }
};

module.exports = {
    signUp,
    login,
    getReports,
    getReportDetail
};
