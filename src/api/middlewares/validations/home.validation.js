const { query } = require('express-validator');
const { HOME_OPTION } = require('../../../config/vars');
const responseMessage = require('../../../config/response/baseResponseStatus');

/**
 * @title 홈화면 조회 API Validator
 * @query option
 * - @desc latest, popular, follow 중에 하나인지 확인
 */
const homeValidation = [query('option').optional().isIn(HOME_OPTION).withMessage(responseMessage.HOME_OPTION_ERROR_TYPE).bail()];

module.exports = {
    homeValidation
};
