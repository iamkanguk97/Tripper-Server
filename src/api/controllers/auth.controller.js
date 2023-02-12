'use strict';
const httpStatus = require('http-status');
const passport = require('passport');
const AuthService = require('../services/auth.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response } = require('../../config/response/response-template');

const kakaoLoginCallback = async (req, res, next) => {
    // Kakao Access-Token이랑 Refresh Token은 특별하게 사용할 곳이 없다고 판단되어서 따로 저장은 안함.
    passport.authenticate('kakao', async ({ accessToken, refreshToken, profile }) => {
        const kakaoLoginResult = await AuthService.kakaoLoginCallback(accessToken, refreshToken, profile);
        if (kakaoLoginResult.requireSignUp)
            return res.status(httpStatus.OK).json();
        else
            return res.status(httpStatus.OK).json();
    })(req, res, next);
};

const naverLoginCallback = async (req, res, next) => {
    // Naver Access-Token이랑 Refresh Token은 특별하게 사용할 곳이 없다고 판단되어서 따로 저장 안함.
    passport.authenticate('naver', async ({ accessToken, refreshToken, profile }) => {
        const naverLoginResult = await AuthService.naverLoginCallback(accessToken, refreshToken, profile);
        if (naverLoginResult.requireSignUp)
            return res.status(httpStatus.OK).json(response(responseMessage.REQUIRE_SIGN_UP, naverLoginResult.result));
        else
            return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, naverLoginR));
    })(req, res, next);
};

const verifyNickname = (req, res) => {
    // 이전 Middleware 부분에서 Validation 체크를 함
    // 해당 Controller까지 들어오면 바로 성공 메세지를 return
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS));
};

const signUp = async (req, res) => {
    const { email, nickname, kakaoId, ageGroup, gender } = req.body;
    const profileImage = req.files ? req.files.pimage : null;
    
    const signUpResult = await AuthService.signUp(
        email, nickname, profileImage, kakaoId, ageGroup, gender
    );
  
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, signUpResult));
};

const autoLogin = async (req, res) => {};

const tokenRefresh = async (req, res) => {};

module.exports = {
    kakaoLoginCallback,
    naverLoginCallback,
    verifyNickname,
    signUp,
    autoLogin,
    tokenRefresh
};