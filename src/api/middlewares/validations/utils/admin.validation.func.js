const Logger = require('../../../../config/logger');
const responseMessage = require('../../../../config/response/baseResponseStatus');
const { validationErrorResponse } = require('../../../../config/response/response-template');

const Admin = require('../../../models/Admin/Admin');
const Report = require('../../../models/Report/Report');

/**
 * @title 관리자 등록확인 Validation Function
 * @parameter value
 * - @body email
 */
exports.checkAdminExist = async value => {
    try {
        const checkAdminExistWithEmail = await Admin.findOne({
            where: {
                ADMIN_EMAIL: value,
                ADMIN_STATUS: 'ACTIVE'
            }
        });

        if (checkAdminExistWithEmail) return Promise.reject(responseMessage.ADMIN_ALREADY_EXIST);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

/**
 * @title 관리자 닉네임 중복확인 Validation Function
 * @parameter value
 * - @body nickname
 */
exports.checkAdminNickExist = async value => {
    try {
        const checkAdminNickExistResult = await Admin.findOne({
            where: {
                ADMIN_NICKNAME: value,
                ADMIN_STATUS: 'ACTIVE'
            }
        });

        if (checkAdminNickExistResult) return Promise.reject(responseMessage.ADMIN_NICKNAME_DUPLICATED);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

/**
 * @title 신고 유무확인 Validation Function
 * @parameter value
 * - @query reportIdx
 */
exports.checkReportExist = async value => {
    try {
        const checkReportResult = await Report.findOne({
            where: {
                IDX: value
            }
        });

        if (!checkReportResult) return Promise.reject(responseMessage.REPORT_NOT_EXIST);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

/**
 * @title 관리자 존재확인 Validation Function
 * @parameter value, request
 * - @body email
 */
exports.checkAdminNotExist = async (value, { req }) => {
    try {
        const checkAdminExistWithEmail = await Admin.findOne({
            where: {
                ADMIN_EMAIL: value,
                ADMIN_STATUS: 'ACTIVE'
            }
        });

        if (!checkAdminExistWithEmail) return Promise.reject(responseMessage.ADMIN_NOT_EXIST);
        req.adminIdx = checkAdminExistWithEmail.dataValues.IDX;
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};
