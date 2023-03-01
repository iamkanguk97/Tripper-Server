'use strict';
const { param } = require("express-validator");
const responseMessage = require('../../../config/response/baseResponseStatus');
const { checkTravelExist } = require("../../utils/validation-util");

const updateTravelStatusValidation = [
    param('travelIdx')
        .notEmpty().withMessage(responseMessage.TRAVEL_IDX_EMPTY).bail()
        .custom(checkTravelExist).bail()   // 본인 게시물이 맞는지 확인
];

module.exports = {
    updateTravelStatusValidation
};