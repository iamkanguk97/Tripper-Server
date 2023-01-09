const httpStatus = require('http-status');
const authService = require('../services/auth.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response, errResponse } = require('../../config/response/response-template');
const { REGEX_NICKNAME } = require('../utils/regex');
const { checkBadWord } = require('../utils/util');

const kakaoLoginCallback = async (req, res) => {
    const { accessToken, refreshToken, profile } = req;
    const kakaoLoginResult = await authService.kakaoLoginCallback(accessToken, refreshToken, profile);
};

const verifyNickname = async (req, res) => {
    const nickname = req.query.nickname;
    
    /* Validation */
    if (!nickname)   // [2010] 닉네임 입력 안함
        return res.status(httpStatus.BAD_REQUEST).send(errResponse(responseMessage.NICKNAME_EMPTY));
    if (!(REGEX_NICKNAME.test(nickname)))   // [2011] 닉네임 형식 오류
        return res.status(httpStatus.BAD_REQUEST).send(errResponse(responseMessage.NICKNAME_ERROR_TYPE));
    if (await checkBadWord(nickname))   // [2012] 닉네임 부적절한 단어 포함
        return res.status(httpStatus.BAD_REQUEST).send(errResponse(responseMessage.NICKNAME_BAD_WORD_INCLUDE));

    // DB에서 동일한 닉네임이 있는지 확인
    const checkNickname = await authService.verifyNickname(nickname);
    
    if (checkNickname)   // 닉네임이 이미 존재하는 경우
        return res.status(httpStatus.BAD_REQUEST).send(errResponse(responseMessage.NICKNAME_DUPLICATED));   // [3010] 닉네임 중복 오류
    else   // 해당 닉네임이 존재하지 않는 경우
        return res.status(httpStatus.OK).send(response(responseMessage.SUCCESS));
};

module.exports = {
    kakaoLoginCallback,
    verifyNickname
};