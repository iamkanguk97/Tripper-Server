const { body, query, header } = require('express-validator');
const { checkUserStatusFunc, checkUserFollowMe } = require('../../utils/validation-util');
const responseMessage = require('../../../config/response/baseResponseStatus');

/**
 * 팔로우 기능 API Validator
 * - 팔로우 상대 IDX 유무 확인 + 실제 존재하는 유저인지 확인 (탈퇴 유무까지)
 */
const followValidation = [
    body('followUserIdx')
        .notEmpty()
        .withMessage(responseMessage.FOLLOW_TARGET_IDX_EMPTY)
        .bail()
        .custom(checkUserStatusFunc)
        .bail()
];

/**
 * 팔로잉 또는 팔로워 리스트 조회 API Validator
 * - userIdx 실제 존재하는 유저 확인 (+ 탈퇴 유무 확인)
 * - option 유무 확인 + following 또는 follower인지 확인
 */
const followListValidation = [
    query('userIdx').custom(checkUserStatusFunc).withMessage(responseMessage.USER_NOT_EXIST).bail(),
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
        .custom(checkUserStatusFunc)
        .bail()
        .custom(checkUserFollowMe)
        .bail()
];

module.exports = {
    followValidation,
    followListValidation,
    deleteFollowerValidation
};
