const { query, body, header } = require('express-validator');
const { REGEX_NICKNAME } = require('../../utils/regex');
const {
    checkNickDuplicate,
    checkBadWordInclude,
    checkSnsIdDuplicate,
    checkAccessTokenEmpty,
    checkIsSocialTokenValid
} = require('../../utils/validation-util');
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
 * 소셜로그인 API Validator
 * - 클라이언트 쪽에서 건네주는 Access-Token 유무
 * - provider 유무
 * - provider 값 확인 (naver, kakao)
 */
const socialLoginValidation = [
    body('socialAccessToken')
        .notEmpty()
        .withMessage(responseMessage.SOCIAL_LOGIN_ACCESS_TOKEN_EMPY)
        .bail(),
    body('provider')
        .notEmpty()
        .withMessage(responseMessage.SOCIAL_LOGIN_PROVIDER_EMPTY)
        .bail()
        .isIn(['kakao', 'naver'])
        .withMessage(responseMessage.SOCIAL_LOGIN_PROVIDER_ERROR_TYPE)
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
    body('email')
        .isEmail()
        .optional({ nullable: true })
        .withMessage(responseMessage.EMAIL_TYPE_ERROR)
        .bail(),
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
    body('snsId')
        .notEmpty()
        .withMessage(responseMessage.SNS_ID_EMPTY)
        .bail()
        .custom(checkSnsIdDuplicate)
        .bail(),
    body('provider')
        .notEmpty()
        .withMessage(responseMessage.PROVIDER_EMPTY)
        .bail()
        .isIn(['K', 'N'])
        .withMessage(responseMessage.PROVIDER_ERROR_TYPE)
        .bail()
];

/**
 * Access Token 갱신을 위한 API Validator
 * - 자세한 검증 Logic은 Service단에서 진행하는걸로 결정.
 * - Access-Token 및 Refresh-Token 유무 확인만 필요.
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
 * 이메일 인증번호 확인을 위한 API Validator
 * - [query] 이메일 유무 확인 및 이메일 형식 확인
 * - [query] 인증번호 입력 유무 확인
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
 * 이메일 인증번호 발송을 위한 API Validator
 * - [query] 이메일 유무 확인 및 이메일 형식 확인
 */
const postEmailVerifyValidation = [
    body('email')
        .notEmpty()
        .withMessage(responseMessage.EMAIL_EMPTY)
        .bail()
        .isEmail()
        .withMessage(responseMessage.EMAIL_TYPE_ERROR)
        .bail()
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
        .isIn(['kakao', 'naver'])
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
