const { query, body, header } = require('express-validator');
const { REGEX_NICKNAME } = require('../../utils/regex');
const { checkSnsIdDuplicate, checkAccessTokenEmpty } = require('../../utils/validation-util');
const {
    checkNickDuplicate,
    checkBadWordInclude,
    checkSoialAtMatchProvider,
    checkIsSocialTokenValid
} = require('./utils/auth.validation.func');
const responseMessage = require('../../../config/response/baseResponseStatus');
const { SOCIAL_LOGIN_VENDOR } = require('../../../config/vars');

/**
 * @title 닉네임 확인 API Validation
 * @query nickname
 * - @desc 닉네임 입력 유무
 * - @desc 닉네임 형식 확인 (정규식)
 * - @desc 부적절한 단어 포함 유무 확인
 * - @desc 닉네임 중복 확인
 */
const verifyNickValidation = [
    query('nickname')
        .notEmpty()
        .withMessage(responseMessage.NICKNAME_EMPTY) // 닉네임 입력 유무 확인
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
 * @title 소셜로그인 API Validation
 * @body socialAccessToken
 * - @desc 소셜 Access-Token 입력유무
 * @body vendor
 * - @desc 소셜로그인 유형 입력유무 + 문자열 확인
 * - @desc 소셜로그인 유형 (naver / kakao)
 * - @desc socialAccessToken <-> vendor 매칭되는지 확인 + req 변수에 저장
 */
const socialLoginValidation = [
    body('socialAccessToken')
        .notEmpty()
        .withMessage(responseMessage.SOCIAL_LOGIN_ACCESS_TOKEN_EMPY)
        .bail()
        .isString()
        .withMessage(responseMessage.MUST_BE_STRING)
        .bail(),
    body('vendor')
        .notEmpty()
        .withMessage(responseMessage.SOCIAL_LOGIN_PROVIDER_EMPTY)
        .bail()
        .isString()
        .withMessage(responseMessage.MUST_BE_STRING)
        .isIn(SOCIAL_LOGIN_VENDOR)
        .withMessage(responseMessage.SOCIAL_LOGIN_PROVIDER_ERROR_TYPE)
        .bail()
        .custom(checkSoialAtMatchProvider)
        .bail()
];

/**
 * 회원가입 API Validator
 * - 이메일이 있으면 -> 이메일 형식 확인
 * - 닉네임 유무 + 형식 확인
 * - 카카오 고유 번호 유무 확인
 * - 사용자 로그인 타입 유무 + 형식 확인
 */
const signUpValidation = [
    body('email').isEmail().optional({ nullable: true }).withMessage(responseMessage.EMAIL_TYPE_ERROR).bail(),
    body('nickname')
        .notEmpty()
        .withMessage(responseMessage.NICKNAME_EMPTY)
        .bail()
        .matches(REGEX_NICKNAME)
        .withMessage(responseMessage.NICKNAME_ERROR_TYPE)
        .bail()
        .custom(checkNickDuplicate)
        .bail()
        .custom(checkBadWordInclude)
        .bail(),
    body('snsId').notEmpty().withMessage(responseMessage.SNS_ID_EMPTY).bail().custom(checkSnsIdDuplicate).bail(),
    body('provider')
        .notEmpty()
        .withMessage(responseMessage.PROVIDER_EMPTY)
        .bail()
        .isIn(['K', 'N'])
        .withMessage(responseMessage.PROVIDER_ERROR_TYPE)
        .bail()
];

/**
 * @Title Access-Token 갱신을 위한 API Validation
 * - @header Bearer Token
 */
const tokenRefreshValidation = [
    header('authorization')
        .notEmpty()
        .withMessage(responseMessage.JWT_ACCESS_TOKEN_EMPTY) // authorization 부분이 아예 없을 때
        .bail()
        .custom(checkAccessTokenEmpty) // authorization key는 있지만 Bearer을 입력하지 않았거나 아예 비어있는 경우
        .bail(),
    header('refreshtoken').notEmpty().withMessage(responseMessage.JWT_REFRESH_TOKEN_EMPTY).bail() // refresh_token이 없는 경우
];

/**
 * @title 이메일 인증번호 확인 API Validator
 * @query email
 * - @desc 이메일 입력유무 및 형식 확인
 * @query verifyNumber
 * - @desc 인증번호 입력 확인
 */
const getEmailVerifyValidation = [
    query('email')
        .notEmpty()
        .withMessage(responseMessage.EMAIL_EMPTY)
        .bail()
        .isEmail()
        .withMessage(responseMessage.EMAIL_TYPE_ERROR)
        .bail(),
    query('verifyNumber').notEmpty().withMessage(responseMessage.EMAIL_VERIFY_EMPTY).bail()
];

/**
 * @title 이메일 인증번호 전송 API Validator
 * @body email
 * - @desc 이메일 입력유무 및 형식 확인
 */
const postEmailVerifyValidation = [
    body('email').notEmpty().withMessage(responseMessage.EMAIL_EMPTY).bail().isEmail().withMessage(responseMessage.EMAIL_TYPE_ERROR).bail()
];

/**
 * @title 회원탈퇴 API Validator
 * @param social_at (소셜 Access-Token)
 *  - 입력 유무 확인
 * @param social_vendor (소셜로그인 유형)
 *  - 입력 유무 및 유형 확인
 *  - 유효한 토큰인지 확인
 */
const userWithdrawValidation = [
    header('social_at').notEmpty().withMessage(responseMessage.SOCIAL_ACCESS_TOKEN_EMPTY).bail(),
    header('social_vendor')
        .notEmpty()
        .withMessage(responseMessage.SOCIAL_VENDOR_EMPTY)
        .bail()
        .isIn(SOCIAL_LOGIN_VENDOR)
        .withMessage(responseMessage.SOCIAL_VENDOR_ERROR_TYPE)
        .bail()
        .custom(checkIsSocialTokenValid)
        .bail()
];

module.exports = {
    verifyNickValidation,
    signUpValidation,
    tokenRefreshValidation,
    socialLoginValidation,
    getEmailVerifyValidation,
    postEmailVerifyValidation,
    userWithdrawValidation
};
