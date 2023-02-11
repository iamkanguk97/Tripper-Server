'use strict';
const httpStatus = require('http-status');
const AuthService = require('../services/auth.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response } = require('../../config/response/response-template');

const kakaoLoginCallback = async (req, res) => {
    const { accessToken, refreshToken, profile } = req;   // KakaoStrategy에서 가져온 사용자 accessToken, refreshToken, 프로필
    const kakaoLoginResult = await AuthService.kakaoLoginCallback(accessToken, refreshToken, profile);
};

const naverLoginCallback = async (req, res) => {
    const { accessToken, refreshToken, profile } = req;
    const naverLoginResult = await AuthService.naverLoginCallback(accessToken, refreshToken, profile);
};

const verifyNickname = (req, res) => {
    // 이전 Middleware 부분에서 Validation 체크를 함
    // 해당 Controller까지 들어오면 바로 성공 메세지를 return
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS));
};

const signUp = async (req, res) => {
    const { email, nickname, kakaoId, ageGroup, gender } = req.body;
    const profileImage = req.files.pimage;
    
    const signUpResult = await AuthService.signUp(
        email, nickname, profileImage, kakaoId, ageGroup, gender
    );

    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, signUpResult));
};

module.exports = {
    kakaoLoginCallback,
    naverLoginCallback,
    verifyNickname,
    signUp,
};