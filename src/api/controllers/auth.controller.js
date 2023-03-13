const httpStatus = require('http-status');
const passport = require('passport');
const AuthService = require('../services/auth.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response, errResponse } = require('../../config/response/response-template');

const kakaoLoginCallback = async (req, res, next) => {
    // Kakao Access-Token이랑 Refresh Token은 특별하게 사용할 곳이 없다고 판단되어서 따로 저장은 안함.
    passport.authenticate('kakao', async ({ accessToken, refreshToken, profile }) => {
        const kakaoLoginResult = await AuthService.kakaoLoginCallback(
            accessToken,
            refreshToken,
            profile
        );
        if (kakaoLoginResult.isError) next(kakaoLoginResult.error);
        else {
            if (kakaoLoginResult.requireSignUp)
                return res
                    .status(httpStatus.OK)
                    .json(response(responseMessage.REQUIRE_SIGN_UP, kakaoLoginResult.result));

            // res.cookie();   // Access Token + Refresh Token cookie로 전달.
            return res
                .status(httpStatus.OK)
                .json(response(responseMessage.SUCCESS, kakaoLoginResult.result));
        }
    })(req, res, next);
};

const naverLoginCallback = async (req, res, next) => {
    // Naver Access-Token이랑 Refresh Token은 특별하게 사용할 곳이 없다고 판단되어서 따로 저장 안함.
    passport.authenticate('naver', async ({ accessToken, refreshToken, profile }) => {
        const naverLoginResult = await AuthService.naverLoginCallback(
            accessToken,
            refreshToken,
            profile
        );
        if (naverLoginResult.isError) next(naverLoginResult.error);
        else {
            if (naverLoginResult.requireSignUp)
                return res
                    .status(httpStatus.OK)
                    .json(response(responseMessage.REQUIRE_SIGN_UP, naverLoginResult.result));

            // res.cookie();   // Access Token + Refresh Token cookie로 전달.
            return res
                .status(httpStatus.OK)
                .json(response(responseMessage.SUCCESS, naverLoginResult.result));
        }
    })(req, res, next);
};

const verifyNickname = (req, res) =>
    // 이전 Middleware 부분에서 Validation 체크를 함
    // 해당 Controller까지 들어오면 바로 성공 메세지를 return
    res.status(httpStatus.OK).json(response(responseMessage.SUCCESS));
const signUp = async (req, res) => {
    const { email, nickname, snsId, ageGroup, gender, provider } = req.body;
    const profileImage = req.files ? req.files.pimage : null;

    const signUpResult = await AuthService.signUp(
        email,
        nickname,
        profileImage,
        snsId,
        ageGroup,
        gender,
        provider
    );

    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, signUpResult));
};

const autoLogin = async (req, res) => {
    // jwtMiddleware에서 Access-Token에 대한 유효 여부를 체크함.
    // 따라서 해당 Controller까지 도달하면 성공메세지 Return
    const { userIdx } = req.verifiedToken;
    if (!userIdx)
        // userIdx가 없다 -> Refresh-Token을 보냈을 경우임!
        return res
            .status(httpStatus.BAD_REQUEST)
            .json(errResponse(responseMessage.AUTO_LOGIN_ERROR));
    return res
        .status(httpStatus.OK)
        .json(response(responseMessage.SUCCESS, { userIdx: parseInt(userIdx) }));
};

const tokenRefresh = async (req, res) => {
    const accessToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh_token;

    const tokenRefreshResult = await AuthService.tokenRefresh(accessToken, refreshToken);
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, tokenRefreshResult));
};

module.exports = {
    kakaoLoginCallback,
    naverLoginCallback,
    verifyNickname,
    signUp,
    autoLogin,
    tokenRefresh
};
