const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/auth.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const {
    verifyNickValidation,
    signUpValidation,
    tokenRefreshValidation,
    socialLoginValidation,
    getEmailVerifyValidation,
    postEmailVerifyValidation,
    userWithdrawValidation
} = require('../middlewares/validations/auth.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

// 카카오 로그인 API with passport
router.get('/kakao-login', passport.authenticate('kakao'));
router.get('/kakao-login/callback', passport.authenticate('kakao', { session: false }), wrapAsync(AuthController.kakaoLoginCallback));

// 네이버 로그인 API with passport
router.get('/naver-login', passport.authenticate('naver'));
router.get('/naver-login/callback', passport.authenticate('naver', { session: false }), wrapAsync(AuthController.naverLoginCallback));

// 소셜로그인 API without passport
router.post('/social-login', socialLoginValidation, validationMiddleware, wrapAsync(AuthController.socialLogin));

// 닉네임 확인 API
router.get('/verify-nickname', verifyNickValidation, validationMiddleware, AuthController.verifyNickname);

// 회원가입 API
router.post('/sign-up', signUpValidation, validationMiddleware, wrapAsync(AuthController.signUp));

// 자동로그인 API
router.get('/auto-login', jwtMiddleware, AuthController.autoLogin);

// JWT 재발급을 위한 Router
router.post('/token-refresh', tokenRefreshValidation, validationMiddleware, wrapAsync(AuthController.tokenRefresh));

// (관리자 회원가입) 이메일 인증번호 전송 API
router.post('/email-verify', postEmailVerifyValidation, validationMiddleware, wrapAsync(AuthController.postEmailVerify));

// (관리자 회원가입) 이메일 인증번호 확인 API
router.get('/email-verify', getEmailVerifyValidation, validationMiddleware, wrapAsync(AuthController.getEmailVerify));

// 로그아웃 API
router.patch('/logout', jwtMiddleware, wrapAsync(AuthController.logout));

// 회원탈퇴 API
router.patch('/withdrawal', jwtMiddleware, userWithdrawValidation, validationMiddleware, wrapAsync(AuthController.userWithdrawal));

module.exports = router;
