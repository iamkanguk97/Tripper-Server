const { body } = require('express-validator');
const responseMessage = require('../../../config/response/baseResponseStatus');
const {
    checkTravelStatusAble,
    checkTravelDateIsOver,
    checkTravelStatus,
    checkMyTravel,
    checkBeforeReviewScore
} = require('../../utils/validation-util');
const { REGEX_DATE } = require('../../utils/regex');

/**
 * 게시물 생성 API Validator
 * - travelInformation 객체가 있는지 확인
 *  -- startDate와 endDate 유무확인 및 정규식 일치 확인
 */
const createTravelValidation = [
    body('travelInformation')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_INFORMATION_EMPTY)
        .bail(),
    body('travelInformation.travelStartDate')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_STARTDATE_EMPTY)
        .bail()
        .matches(REGEX_DATE)
        .withMessage(responseMessage.CREATE_TRAVEL_DATE_ERROR_TYPE)
        .bail(),
    body('travelInformation.travelEndDate')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_ENDDATE_EMPTY)
        .bail()
        .matches(REGEX_DATE)
        .withMessage(responseMessage.CREATE_TRAVEL_DATE_ERROR_TYPE)
        .bail(),
    body(['travelInformation.travelStartDate', 'travelInformation.travelEndDate'])
        .custom(checkTravelDateIsOver)
        .bail(),
    body('travelInformation.moveMethod')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_MOVEMETHOD_EMPTY)
        .bail()
        .isIn(['자차로 여행', '대중교통 여행', '자전거 여행', '도보 여행'])
        .withMessage(responseMessage.CREATE_TRAVEL_MOVEMETHOD_ERROR_TYPE)
        .bail(),
    body('travelInformation.travelTitle')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_TITLE_EMPTY)
        .bail(),
    body('travelInformation.travelThumnailImages')
        .optional()
        .isArray({ max: 5 })
        .withMessage(responseMessage.CREATE_TRAVEL_THUMNAIL_IMAGE_LENGTH_ERROR)
        .bail()
];

/**
 * 게시물 삭제 API Validator
 * - travelIdx 누락 확인 + 이미 삭제된 게시물인지 확인
 * - 이미 삭제된 게시물인지 확인
 * - 본인 게시물을 삭제하려는게 맞는지 확인
 */
const deleteTravelValidation = [
    body('travelIdx')
        .notEmpty()
        .withMessage(responseMessage.TRAVEL_IDX_EMPTY)
        .bail()
        .custom(checkTravelStatus)
        .bail()
        .custom(checkMyTravel)
        .bail()
];

/**
 * 게시물 공개 범위 수정 API Validator
 * - 게시물 고유값 유무 + 본인 게시물이 맞는지 확인
 */
const updateTravelStatusValidation = [
    body('travelIdx')
        .notEmpty()
        .withMessage(responseMessage.TRAVEL_IDX_EMPTY)
        .bail()
        .custom(checkTravelStatus) // 게시물 상태 확인
        .bail()
        .custom(checkMyTravel) // 본인 게시물 맞는지 확인
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
        .custom(checkTravelStatus)
        .bail()
        .custom(checkMyTravel)
        .bail(),
    body('reviewScore')
        .notEmpty() // 점수 유무 확인
        .withMessage(responseMessage.TRAVEL_REVIEW_SCORE_EMPTY)
        .bail()
        .isInt({ min: 1, max: 5 }) // 1점에서 5점 사이인지 확인
        .withMessage(responseMessage.TRAVEL_REVIEW_SCORE_ERROR_TYPE)
        .bail()
        .custom(checkBeforeReviewScore) // 이전 게시물 점수랑 동일한지 확인
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
    deleteTravelValidation,
    updateTravelStatusValidation,
    createTravelReviewScoreValidation,
    createTravelLikeValidation
};
