const { body, query, param } = require('express-validator');
const responseMessage = require('../../../config/response/baseResponseStatus');
const {
    checkTravelStatusAble,
    checkTravelStatus,
    checkMyTravel,
    checkBeforeReviewScore,
    checkMentionUserStatus,
    checkParentCommentAble,
    checkIsMyComment
} = require('../../utils/validation-util');
const { REGEX_DATE } = require('../../utils/regex');
const { TRAVEL_MOVE_METHOD } = require('../../../config/vars');
const { checkTravelDate, checkTravelDayKeys } = require('./utils/travel.validation.func');

/**
 * @title 게시물 생성 API Validation
 *
 * @body travelInformation
 * - @desc travelInformation 객체는 무조건 있어야함
 * - @properties travelStartDate, travelEndDate
 *   - @desc 입력 및 형식확인
 *   - @desc 오늘 날짜 넘어가는지 확인 (travelStartDate와 travelEndDate가 오늘을 넘어가면 안됨)
 * - @properties moveMethod
 *   - @desc 입력확인 및 형식 확인
 * - @properties travelTitle
 *   - @desc 입력확인 및 최대 50자
 * - @properties travelThumnailImages
 *   - @desc 최대 5장까지 업로드 가능
 *
 * @body day
 * - @desc day 객체도 마찬가지로 무조건 있어야함
 * - @desc day 객체의 key는 startDate와 endDate 사이의 모든 날짜를 가져와야함
 * - @properties area
 *  - @desc latitude, longitude, address 필수입력 확인
 * - @properties review
 *  - @desc images 최대 5개 확인
 */
const createTravelValidation = [
    body('travelInformation')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_INFORMATION_EMPTY)
        .bail()
        .isObject()
        .withMessage(responseMessage.CREATE_TRAVEL_INFORMATION_MUST_OBJECT)
        .bail(),
    body('travelInformation.travelStartDate')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_STARTDATE_EMPTY)
        .bail()
        .isString()
        .bail()
        .matches(REGEX_DATE)
        .withMessage(responseMessage.CREATE_TRAVEL_DATE_ERROR_TYPE)
        .bail()
        .custom(checkTravelDate),
    body('travelInformation.travelEndDate')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_ENDDATE_EMPTY)
        .bail()
        .isString()
        .bail()
        .matches(REGEX_DATE)
        .withMessage(responseMessage.CREATE_TRAVEL_DATE_ERROR_TYPE)
        .bail()
        .custom(checkTravelDate),
    body('travelInformation.moveMethod')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_MOVEMETHOD_EMPTY)
        .bail()
        .isString()
        .bail()
        .isIn(TRAVEL_MOVE_METHOD)
        .withMessage(responseMessage.CREATE_TRAVEL_MOVEMETHOD_ERROR_TYPE)
        .bail(),
    body('travelInformation.travelTitle')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_TITLE_EMPTY)
        .bail()
        .isString()
        .bail()
        .isLength({ max: 50 })
        .withMessage(responseMessage.CREATE_TRAVEL_TITLE_LENGTH_ERROR)
        .bail(),
    body('travelInformation.travelThumnailImages')
        .optional()
        .isArray({ max: 5 })
        .withMessage(responseMessage.CREATE_TRAVEL_THUMNAIL_IMAGE_LENGTH_ERROR)
        .bail(),
    body('day')
        .notEmpty()
        .withMessage(responseMessage.CREATE_TRAVEL_DAY_EMPTY)
        .bail()
        .isObject()
        .withMessage(responseMessage.CREATE_TRAVEL_DAY_MUST_OBJECT)
        .bail()
        .custom(checkTravelDayKeys)
        .bail(),
    body('day.*.area').optional(),
    body('day.*.area.*.latitude').notEmpty().withMessage(responseMessage.CREATE_TRAVEL_DAY_AREA_LATITUDE_EMPTY).bail(),
    body('day.*.area.*.longitude').notEmpty().withMessage(responseMessage.CREATE_TRAVEL_DAY_AREA_LONGITUDE_EMPTY).bail(),
    body('day.*.area.*.address').notEmpty().withMessage(responseMessage.CREATE_TRAVEL_DAY_AREA_ADDRESS_EMPTY).bail(),
    body('day.*.area.*.review').optional().isObject().withMessage(responseMessage.CREATE_TRAVEL_DAY_AREA_REVIEW_MUST_OBJECT).bail(),
    body('day.*.area.*.review.images')
        .optional()
        .isArray({ max: 5 })
        .withMessage(responseMessage.CREATE_TRAVEL_DAY_AREA_IMAGE_COUNT_ERROR)
        .bail(),
    body('day.*.area.*.review.comment').optional().isString().bail()
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

/**
 * 게시물 댓글 생성 API Validator
 * - [Body - travelIdx] 게시물 고유값 유무, 게시물 유효성 확인 및 본인 비공개 게시물에도 가능하게!
 * - [Body - commentIdx] commentIdx가 null이 아닌 경우 -> 해당 commentIdx(부모댓글)가 있는지 확인
 * - [Body - comment] 글자수 확인
 * - [Body - mentionUsers] 해당 닉네임을 가진 유저들이 전부 활성화 상태인지 확인
 */
const createTravelCommentValidation = [
    body('travelIdx').notEmpty().withMessage(responseMessage.TRAVEL_IDX_EMPTY).bail().custom(checkTravelStatusAble).bail(),
    body('commentIdx').optional().custom(checkParentCommentAble).bail(),
    body('comment').isLength({ max: 200 }).withMessage(responseMessage.TRAVEL_COMMENT_LENGTH_ERROR).bail(),
    body('mentionUsers').optional().custom(checkMentionUserStatus).bail()
];

const updateTravelCommentValidation = [];

/**
 * 게시물 댓글 삭제 API Validator
 * - [Body - commentIdx] 입력 유무 + 해당 댓글 존재 유무 + 본인의 댓글만 삭제할 수 있음
 */
const deleteTravelCommentValidation = [
    body('commentIdx').notEmpty().withMessage(responseMessage.COMMENT_IDX_EMPTY).bail().custom(checkIsMyComment).bail()
];

/**
 * 게시물 댓글 조회 API Validator
 * - [Query - travelIdx] 입력 유무 + 게시물 유효성 확인 및 본인 비공개 게시물에는 조회 가능하게!
 */
const selectTravelCommentValidation = [
    query('travelIdx').notEmpty().withMessage(responseMessage.TRAVEL_IDX_EMPTY).bail().custom(checkTravelStatusAble).bail()
];

/**
 * @title 특정 게시물 조회 API Validation
 * @param travelIdx
 * - @desc 입력유무 확인
 * - @desc
 */
const selectTravelDetailValidation = [param('travelIdx').notEmpty().withMessage(responseMessage.TRAVEL_IDX_EMPTY).bail().custom().bail()];

module.exports = {
    createTravelValidation,
    deleteTravelValidation,
    updateTravelStatusValidation,
    createTravelReviewScoreValidation,
    createTravelLikeValidation,
    createTravelCommentValidation,
    updateTravelCommentValidation,
    deleteTravelCommentValidation,
    selectTravelCommentValidation,
    selectTravelDetailValidation
};
