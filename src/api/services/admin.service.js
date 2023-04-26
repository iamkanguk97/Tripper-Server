const { saltHashPassword, validatePassword } = require('../utils/crypto-util');
const { sequelize } = require('../models');
const { generateAccessToken } = require('../utils/jwt-util');
const Admin = require('../models/Admin/Admin');
const AdminSalt = require('../models/Admin/AdminSalt');

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

        // // AdminSalt 테이블에 INSERT
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

    const token = generateAccessToken(adminIdx);
    return { adminIdx, token };
};

module.exports = {
    signUp,
    login
};
