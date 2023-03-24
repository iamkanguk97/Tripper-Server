const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/auth.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const {
    verifyNickValidation,
    signUpValidation,
    tokenRefreshValidation
} = require('../middlewares/validations/auth.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

// 카카오 로그인 API
router.get('/kakao-login', passport.authenticate('kakao'));
router.get(
    '/kakao-login/callback',
    passport.authenticate('kakao', { session: false }),
    wrapAsync(AuthController.kakaoLoginCallback)
);

// 네이버 로그인 API
router.get('/naver-login', passport.authenticate('naver'));
router.get(
    '/naver-login/callback',
    passport.authenticate('naver', { session: false }),
    wrapAsync(AuthController.naverLoginCallback)
);

// 닉네임 확인 API
router.get(
    '/verify-nickname',
    verifyNickValidation,
    validationMiddleware,
    AuthController.verifyNickname
);

// 회원가입 API
router.post('/sign-up', signUpValidation, validationMiddleware, wrapAsync(AuthController.signUp));

// 자동로그인 API
router.get('/auto-login', jwtMiddleware, AuthController.autoLogin);

// JWT 재발급을 위한 Router
router.post(
    '/token-refresh',
    tokenRefreshValidation,
    validationMiddleware,
    wrapAsync(AuthController.tokenRefresh)
);

module.exports = router;
