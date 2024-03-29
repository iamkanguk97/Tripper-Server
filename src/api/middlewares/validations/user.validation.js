const { body, query, header } = require('express-validator');
const {
    checkUserFollowMe,
    checkUserStatus,
    checkParameterIdxEqualMyIdx,
    checkBadWordInclude,
    checkNickDuplicate,
    checkUserIdxIsOther
} = require('../../utils/validation-util');
const responseMessage = require('../../../config/response/baseResponseStatus');
const { REGEX_NICKNAME } = require('../../utils/regex');

/**
 * 팔로우 기능 API Validator
 * - 팔로우 상대 IDX 유무 확인 + 실제 존재하는 유저인지 확인 (탈퇴 유무까지)
 * - followUserIdx와 jwt의 userIdx가 같으면 안됨
 */
/**
 * @title 팔로우 API Validator
 * @body followUserIdx
 * - @desc 입력유무 및 숫자 확인
 * - @desc
 */
const followValidation = [
    body('followUserIdx')
        .notEmpty()
        .withMessage(responseMessage.FOLLOW_TARGET_IDX_EMPTY)
        .bail()
        .isInt()
        .withMessage(responseMessage.MUST_BE_POSITIVE_INTEGER)
        .bail()
        .custom(checkUserStatus)
        .bail()
        .custom(checkParameterIdxEqualMyIdx)
        .bail()
];

/**
 * 팔로잉 또는 팔로워 리스트 조회 API Validator
 * - userIdx 실제 존재하는 유저 확인 (+ 탈퇴 유무 확인)
 * - option 유무 확인 + following 또는 follower인지 확인
 */
const followListValidation = [
    query('userIdx').optional().custom(checkUserStatus).bail(),
    query('option')
        .notEmpty()
        .withMessage(responseMessage.FOLLOW_LIST_OPTION_EMPTY)
        .bail()
        .isIn(['following', 'follower'])
        .withMessage(responseMessage.FOLLOW_LIST_OPTION_ERROR_TYPE)
        .bail()
];

/**
 * 본인 팔로워 삭제 API Validator
 * - 삭제할 팔로워 고유값 유무 확인 + 존재 유무 확인
 * - 삭제할 팔로워가 본인을 팔로우하고 있는지 확인
 */
const deleteFollowerValidation = [
    header('useridx')
        .notEmpty()
        .withMessage(responseMessage.DELETE_FOLLOWER_IDX_EMPTY)
        .bail()
        .custom(checkUserStatus)
        .bail()
        .custom(checkParameterIdxEqualMyIdx)
        .bail()
        .custom(checkUserFollowMe)
        .bail()
];

/**
 * 상대방 프로필 조회 API Validator
 * - [query - userIdx] 프로필 조회할 유저의 고유값 입력 유무 + 다른 사람의 고유값이어야함 + 탈퇴한 유저인지 확인
 */
const getProfileValidation = [
    query('userIdx')
        .notEmpty()
        .withMessage(responseMessage.PROFILE_USER_IDX_EMPTY)
        .bail()
        .custom(checkUserStatus)
        .bail()
        .custom(checkUserIdxIsOther)
        .bail()
];

/**
 * 마이페이지 조회 API Validator
 * - [query] option이 mytrip과 like 둘다 아닌 경우
 * - [query] contentSize는 최대 15개로
 * - [query] page는 0이상
 */
const getMyPageValidation = [
    query('option').optional().isIn(['mytrip', 'like']).withMessage(responseMessage.SELECT_MYPAGE_OPTION_ERROR_TYPE),
    query('contentSize').optional().isInt({ min: 1, max: 15 }).withMessage(responseMessage.SELECT_CONTENT_SIZE_ERROR_TYPE),
    query('page').optional().isInt({ min: 0 }).withMessage(responseMessage.SELECT_PAGE_ERROR_TYPE)
];

const updateMyPageValidation = [
    body('nickname')
        .notEmpty()
        .withMessage(responseMessage.NICKNAME_EMPTY) // 닉네임 유무 확인
        .bail()
        .matches(REGEX_NICKNAME)
        .withMessage(responseMessage.NICKNAME_ERROR_TYPE) // 닉네임 형식 확인
        .bail()
        .custom(checkBadWordInclude) // 닉네임에 부적절한 단어 포함 유무 확인
        .bail()
        .custom(checkNickDuplicate) // 중복 닉네임 확인
        .bail()
];

/**
 * @title 신고하기 API Validator
 * @body travelIdx
 * @body travelCommentIdx
 * @body reportTypeIdx
 */
const createReportValidation = [
    body('travelIdx').notEmpty().withMessage(responseMessage.TRAVEL_IDX_EMPTY).bail().custom().bail(),
    body('travelCommentIdx').optional().custom().bail(),
    body('reportTypeIdx').notEmpty().withMessage().bail().custom().bail()
];

module.exports = {
    followValidation,
    followListValidation,
    deleteFollowerValidation,
    getProfileValidation,
    getMyPageValidation,
    updateMyPageValidation,
    createReportValidation
};
