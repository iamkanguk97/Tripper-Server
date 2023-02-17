'use strict';
const { query, body } = require("express-validator");
const { REGEX_NICKNAME } = require('../../utils/regex');
const { checkNickDuplicate, checkBadWordInclude, checkSnsIdDuplicate } = require('../../utils/validation-util');
const responseMessage = require('../../../config/response/baseResponseStatus');

/**
 * 닉네임 확인 API Validator
 * - 닉네임 유무 확인
 * - 닉네임 형식 확인 (정규식)
 * - 부적절한 단어 포함 유무 확인
 * - 중복 닉네임 확인
 */
const verifyNickValidation = [
    query('nickname')
        .notEmpty().withMessage(responseMessage.NICKNAME_EMPTY).bail()
        .matches(REGEX_NICKNAME).withMessage(responseMessage.NICKNAME_ERROR_TYPE).bail()
        .custom(checkBadWordInclude).bail()
        .custom(checkNickDuplicate).bail()
];

/**
 * 회원가입 API Validator
 * - 이메일 유무 확인 + 이메일 형식 확인
 * - 닉네임 유무 + 형식 확인 (안해도 되지만.. 2중 보안이면 더 좋으니까!)
 * - 카카오 고유 번호 유무 확인
 * - 사용자 로그인 타입 유무 + 형식 확인
 */
const signUpValidation = [
    body('email')
        .notEmpty().withMessage(responseMessage.EMAIL_EMPTY).bail()
        .isEmail().withMessage(responseMessage.EMAIL_TYPE_ERROR).bail(),
    body('nickname')
        .notEmpty().withMessage(responseMessage.NICKNAME_EMPTY).bail()
        .matches(REGEX_NICKNAME).withMessage(responseMessage.NICKNAME_ERROR_TYPE).bail()
        .custom(checkNickDuplicate).bail()
        .custom(checkBadWordInclude).bail(),
    body('snsId')
        .notEmpty().withMessage(responseMessage.SNS_ID_EMPTY).bail()
        .custom(checkSnsIdDuplicate).bail(),
    body('provider')
        .notEmpty().withMessage(responseMessage.PROVIDER_EMPTY).bail()
        .isIn(['kakao', 'naver']).withMessage(responseMessage.PROVIDER_ERROR_TYPE).bail()
];

/**
 * Access Token 갱신을 위한 API Validator
 */
const tokenRefreshValidation = [

];

module.exports = {
    verifyNickValidation,
    signUpValidation,
    tokenRefreshValidation
};