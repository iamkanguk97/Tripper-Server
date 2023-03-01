'use strict';
const { query } = require("express-validator");
const responseMessage = require('../../../config/response/baseResponseStatus');

const searchAreaValidation = [
    query('area')
        .notEmpty().withMessage(responseMessage.KAKAO_SEARCH_AREA_EMPTY).bail()
        .isLength({ min: 2 }).trim().withMessage(responseMessage.KAKAO_SEARCH_AREA_LENGTH_ERROR).bail(),
];

module.exports = {
    searchAreaValidation
};