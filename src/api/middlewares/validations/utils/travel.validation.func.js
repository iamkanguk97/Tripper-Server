const Logger = require('../../../../config/logger');
const responseMessage = require('../../../../config/response/baseResponseStatus');
const { validationErrorResponse } = require('../../../../config/response/response-template');

/**
 * @title 오늘 날짜 넘어가는지 확인
 */
exports.checkDateOverToday = async value => {
    try {
        const today = '2';
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

/**
 * @title 두 날짜의 차이가 1주일을 넘어가는지 확인
 */
