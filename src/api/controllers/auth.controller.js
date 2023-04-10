const httpStatus = require('http-status');
const AuthService = require('../services/auth.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response, errResponse } = require('../../config/response/response-template');

const kakaoLoginCallback = async (req, res) => {
    const { kakaoId, email, ageGroup, gender } = req.user;
    const kakaoLoginResult = await AuthService.kakaoLoginCallback(kakaoId, email, ageGroup, gender);

    return res
        .status(httpStatus.OK)
        .json(
            response(
                kakaoLoginResult.requireSignUp
                    ? responseMessage.REQUIRE_SIGN_UP
                    : responseMessage.SUCCESS,
                kakaoLoginResult
            )
        );
};

const naverLoginCallback = async (req, res) => {
    const { naverId, email, ageGroup, gender } = req.user;
    const naverLoginResult = await AuthService.naverLoginCallback(naverId, email, ageGroup, gender);

    return res
        .status(httpStatus.OK)
        .json(
            response(
                naverLoginResult.requireSignUp
                    ? responseMessage.REQUIRE_SIGN_UP
                    : responseMessage.SUCCESS,
                naverLoginResult
            )
        );
};

const socialLogin = async (req, res) => {
    const { vendor, socialAccessToken } = req.body;

    const socialLoginResult = await AuthService.socialLogin(vendor, socialAccessToken);
    return res
        .status(httpStatus.OK)
        .json(
            response(
                socialLoginResult.requireSignUp
                    ? responseMessage.REQUIRE_SIGN_UP
                    : responseMessage.SUCCESS,
                socialLoginResult
            )
        );
};

const verifyNickname = (req, res) =>
    // 이전 Middleware 부분에서 Validation 체크를 함
    // 해당 Controller까지 들어오면 바로 성공 메세지를 return
    res.status(httpStatus.OK).json(response(responseMessage.SUCCESS));

const signUp = async (req, res) => {
    const { nickname, snsId, provider } = req.body;
    const email = req.body.email ?? null;
    const ageGroup = req.body.ageGroup ?? null;
    const gender = req.body.gender ?? null;
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

    return res
        .status(httpStatus.CREATED)
        .json(response(responseMessage.CREATE_SUCCESS, signUpResult));
};

const autoLogin = async (req, res) => {
    // jwtMiddleware에서 Access-Token에 대한 유효 여부를 체크함.
    // 따라서 해당 Controller까지 도달하면 성공메세지 Return
    const userIdx = req.verifiedToken.userIdx;
    if (!userIdx)
        return res
            .status(httpStatus.UNAUTHORIZED)
            .json(errResponse(responseMessage.AUTO_LOGIN_ERROR));
    return res
        .status(httpStatus.OK)
        .json(response(responseMessage.SUCCESS, { userIdx: parseInt(userIdx) }));
};

const tokenRefresh = async (req, res) => {
    const accessToken = req.headers.authorization.split('Bearer ')[1];
    const refreshToken = req.headers.refresh_token; // test

    const tokenRefreshResult = await AuthService.tokenRefresh(accessToken, refreshToken);
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, tokenRefreshResult));
};

module.exports = {
    kakaoLoginCallback,
    naverLoginCallback,
    verifyNickname,
    signUp,
    autoLogin,
    tokenRefresh,
    socialLogin
};
