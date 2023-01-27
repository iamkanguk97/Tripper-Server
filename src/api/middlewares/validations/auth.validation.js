const { query, body, isEmail } = require("express-validator");
const { REGEX_NICKNAME } = require('../../utils/regex');
const { checkBadWord } = require("../../utils/util");
const responseMessage = require('../../../config/response/baseResponseStatus');
const User = require("../../models/User/User");

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
        .custom(async (value) => {
            const checkBadNickResult = await checkBadWord(value);    
            if (checkBadNickResult)
                return Promise.reject('NICKNAME BAD WORD INCLUDE');
        }).withMessage(responseMessage.NICKNAME_BAD_WORD_INCLUDE).bail()
        .custom(async (value) => {
            const checkDupNickResult = await User.findOne({ where: { USER_NICKNAME: value } });
            if (checkDupNickResult)
                return Promise.reject('NICKNAME DUPLICATED');
        }).withMessage(responseMessage.NICKNAME_DUPLICATED).bail()
];

/**
 * 회원가입 API Validator
 * - 이메일 유무 확인 + 이메일 형식 확인
 * - 닉네임 유무 확인 (닉네임 형식은 확인 필요x)
 * - 카카오 고유 번호 유무 확인
 */
const signUpValidation = [
    body('email')
        .notEmpty().withMessage(responseMessage.EMAIL_EMPTY).bail()
        .isEmail().withMessage(responseMessage.EMAIL_TYPE_ERROR).bail(),
    body('nickname')
        .notEmpty().withMessage(responseMessage.NICKNAME_EMPTY).bail(),
    body('kakaoId')
        .notEmpty().withMessage(responseMessage.KAKAOID_EMPTY).bail()
];

module.exports = {
    verifyNickValidation,
    signUpValidation
};