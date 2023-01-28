const httpStatus = require('http-status');
const AuthService = require('../services/auth.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response, errResponse } = require('../../config/response/response-template');

const kakaoLoginCallback = async (req, res) => {
    const { accessToken, refreshToken, profile } = req;   // KakaoStrategy에서 가져온 사용자 accessToken, refreshToken, 프로필
    const kakaoLoginResult = await AuthService.kakaoLoginCallback(accessToken, refreshToken, profile);
};

const verifyNickname = (req, res) => {
    // 이전 Middleware 부분에서 Validation 체크를 함
    // 해당 Controller까지 들어오면 바로 성공 메세지를 return
    return res.status(httpStatus.OK).send(response(responseMessage.SUCCESS));
};

const signUp = async (req, res) => {
    const { email, nickname, profileImage, kakaoId, ageGroup, gender } = req.body;
    
    const signUpResult = await AuthService.signUp(
        email, nickname, profileImage, kakaoId, ageGroup, gender
    );
    console.log(signUpResult);
};

module.exports = {
    kakaoLoginCallback,
    verifyNickname,
    signUp
};