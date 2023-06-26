const { body, query } = require('express-validator');
const responseMessage = require('../../../config/response/baseResponseStatus');
const { checkAdminExist, checkAdminNickExist, checkReportExist, checkAdminNotExist } = require('./utils/admin.validation.func');
const { REGEX_ADMIN_PASSWORD, REGEX_NICKNAME } = require('../../utils/regex');

/**
 * @title 관리자 회원가입 API Validation
 * @body email
 * - @desc 이메일 입력 유무
 * - @desc 이메일 형식 확인
 * - @desc 이미 등록된 이메일인지 확인
 * @body password
 * - @desc 비밀번호 입력유무
 * - @desc 비밀번호 형식에러
 * @body nickname
 * - @desc 닉네임 입력 유무
 * - @desc 닉네임 형식 확인
 * - @desc 관리자 닉네임 중복여부 확인
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
        .withMessage(responseMessage.NICKNAME_EMPTY)
        .bail()
        .matches(REGEX_NICKNAME)
        .withMessage(responseMessage.NICKNAME_ERROR_TYPE)
        .bail()
        .custom(checkAdminNickExist)
        .bail()
];

/**
 * @title 관리자 로그인 API Validation
 * @body email
 * - @desc 이메일 입력 유무
 * - @desc 이메일로 회원 존재확인
 * @body password
 * - @desc 비밀번호 입력유무
 */
const adminLoginValidation = [
    body('email').notEmpty().withMessage(responseMessage.EMAIL_EMPTY).bail().custom(checkAdminNotExist).bail(),
    body('password').notEmpty().withMessage(responseMessage.ADMIN_PASSWORD_EMPTY).bail()
];

/**
 * @title 특정 신고 조회 API Validation
 * @query reportIdx
 * - @desc 신고 고유값 입력유무
 * - @desc 신고 존재유무
 */
const getReportDetailValidation = [
    query('reportIdx').notEmpty().withMessage(responseMessage.REPORT_IDX_EMPTY).bail().custom(checkReportExist).bail()
];

module.exports = {
    adminSignUpValidation,
    adminLoginValidation,
    getReportDetailValidation
};
