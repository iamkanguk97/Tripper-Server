const { param, body } = require('express-validator');
const responseMessage = require('../../../config/response/baseResponseStatus');
const { checkMyTravelExist, checkTravelStatusAble } = require('../../utils/validation-util');

const createTravelValidation = [];

const updateTravelStatusValidation = [
    param('travelIdx')
        .notEmpty()
        .withMessage(responseMessage.TRAVEL_IDX_EMPTY)
        .bail()
        .custom(checkMyTravelExist) // 본인 게시물이 맞는지 확인
        .bail()
];

/**
 * 게시물 평점등록 API Validator
 * - 게시물 고유값 유무 + 게시물 유효성 확인 + 본인 PRIVATE 게시물에도 가능하게 기능 구현 필요
 * - 점수 유무 + 1-5점 사이인지 확인
 */
const createTravelReviewScoreValidation = [
    body('travelIdx')
        .notEmpty() // 게시물 고유값 유무 확인
        .withMessage(responseMessage.TRAVEL_IDX_EMPTY)
        .bail()
        .custom(checkTravelStatusAble) // 게시물 유효성 확인 + 본인 게시물인지까지 확인
        .bail(),
    body('reviewScore')
        .notEmpty() // 점수 유무 확인
        .withMessage(responseMessage.TRAVEL_REVIEW_SCORE_EMPTY)
        .bail()
        .isInt({ min: 1, max: 5 }) // 1점에서 5점 사이인지 확인
        .withMessage(responseMessage.TRAVEL_REVIEW_SCORE_ERROR_TYPE)
        .bail()
];

/**
 * 게시물 좋아요 API Validator
 * - 게시물 고유값 유무 + 게시물 유효성 확인 + 본인 PRIVATE 게시물에도 가능하게 기능 구현 필요
 */
const createTravelLikeValidation = [
    body('travelIdx')
        .notEmpty() // 게시물 고유값 유무 확인
        .withMessage(responseMessage.TRAVEL_IDX_EMPTY)
        .bail()
        .custom(checkTravelStatusAble) // 게시물 유효성 확인 + 본인 게시물인지까지 확인
        .bail()
];

module.exports = {
    createTravelValidation,
    updateTravelStatusValidation,
    createTravelReviewScoreValidation,
    createTravelLikeValidation
};
