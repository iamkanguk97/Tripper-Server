'use strict';
const { query } = require("express-validator");
const { REGEX_LONGITUDE, REGEX_LATITUDE } = require("../../utils/regex");
const responseMessage = require('../../../config/response/baseResponseStatus');

const searchAreaValidation = [
    query('area')
        .notEmpty().withMessage(responseMessage.KAKAO_SEARCH_AREA_EMPTY).bail()
        .isLength({ min: 2 }).trim().withMessage(responseMessage.KAKAO_SEARCH_AREA_LENGTH_ERROR).bail(),
    query('page')
        .optional()
        .isInt({ min: 1, max: 45 }).withMessage(responseMessage.KAKAO_SEARCH_PAGE_NUMBER_ERROR).bail(),
    query('lon')
        .notEmpty().withMessage(responseMessage.KAKAO_SEARCH_LONGITUDE_EMPTY).bail()
        .matches(REGEX_LONGITUDE).withMessage(responseMessage.KAKAO_SEARCH_LONGITUDE_ERROR_TYPE).bail(),
    query('lat')
        .notEmpty().withMessage(responseMessage.KAKAO_SEARCH_LATITUDE_EMPTY).bail()
        .matches(REGEX_LATITUDE).withMessage(responseMessage.KAKAO_SEARCH_LATITUDE_ERROR_TYPE).bail(),
];

module.exports = {
    searchAreaValidation
};