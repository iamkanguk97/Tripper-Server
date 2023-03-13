const { param } = require('express-validator');
const responseMessage = require('../../../config/response/baseResponseStatus');
const { checkTravelExist } = require('../../utils/validation-util');

const createTravelValidation = [];

const updateTravelStatusValidation = [
    param('travelIdx')
        .notEmpty()
        .withMessage(responseMessage.TRAVEL_IDX_EMPTY)
        .bail()
        .custom(checkTravelExist) // 본인 게시물이 맞는지 확인
        .bail()
];

const createTravelReviewScoreValidation = [];

const createTravelLikeValidation = [];

module.exports = {
    createTravelValidation,
    updateTravelStatusValidation,
    createTravelReviewScoreValidation,
    createTravelLikeValidation
};
