const { body } = require('express-validator');
const responseMessage = require('../../../config/response/baseResponseStatus');
const {
    checkAdminExist,
    checkAdminNickExist,
    checkAdminNotExist
} = require('../../utils/validation-util');
const { REGEX_ADMIN_PASSWORD, REGEX_NICKNAME } = require('../../utils/regex');

/**
 * 관리자 회원가입 Validation
 * - [Body] 이메일 입력 유무, 형식 및 중복 확인
 * - [Body] 비밀번호 입력 유무, 형식 확인
 * - [Body] 닉네임 입력 유무, 형식 및 중복 확인
 */
const adminSignUpValidation = [
    body('email')
        .notEmpty()
        .withMessage(responseMessage.EMAIL_EMPTY)
        .bail()
        .isEmail()
        .withMessage(responseMessage.EMAIL_TYPE_ERROR)
        .bail()
        .custom(checkAdminExist) // 이미 등록된 회원인지 확인
        .bail(),
    body('password')
        .notEmpty()
        .withMessage(responseMessage.ADMIN_PASSWORD_EMPTY)
        .bail()
        .matches(REGEX_ADMIN_PASSWORD)
        .withMessage(responseMessage.ADMIN_PASSWORD_WRONG_TYPE)
        .bail(),
    body('nickname')
        .notEmpty()
        .withMessage(responseMessage.ADMIN_NICKNAME_EMPTY)
        .bail()
        .matches(REGEX_NICKNAME)
        .withMessage(responseMessage.NICKNAME_ERROR_TYPE)
        .bail()
        .custom(checkAdminNickExist)
        .bail()
];

/**
 * 관리자 로그인 Validation
 * - [Body] 이메일 입력 유무
 * - [Body] 비밀번호 입력 유무
 */
const adminLoginValidation = [
    body('email')
        .notEmpty()
        .withMessage(responseMessage.EMAIL_EMPTY)
        .bail()
        .custom(checkAdminNotExist)
        .bail(),
    body('password').notEmpty().withMessage(responseMessage.ADMIN_PASSWORD_EMPTY).bail()
];

/**
 * 특정 신고 조회 API Validation
 * - reportIdx 유무 확인 및 존재하는 신고 확인
 */
const getReportDetailValidation = [];

module.exports = {
    adminSignUpValidation,
    adminLoginValidation,
    getReportDetailValidation
};
