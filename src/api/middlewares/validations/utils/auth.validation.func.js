const axios = require('axios');
const Logger = require('../../../../config/logger');
const responseMessage = require('../../../../config/response/baseResponseStatus');
const { validationErrorResponse } = require('../../../../config/response/response-template');
const { checkBadWord } = require('../../../utils/util');

const User = require('../../../models/User/User');

/**
 * @title 회원 닉네임 중복검사 Validation Function
 * @parameter value
 * - @query nickname
 */
exports.checkNickDuplicate = async value => {
    try {
        const checkDupNickResult = await User.findOne({
            where: { USER_NICKNAME: value, USER_STATUS: 'A' }
        }); // 여기서 에러 발생함 -> catch문으로 이동댐!!

        if (checkDupNickResult)
            // 해당 닉네임을 사용하고 있는 유저가 있다!
            return Promise.reject(responseMessage.NICKNAME_DUPLICATED);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

/**
 * @title 회원 닉네임 부적절한 단어포함 유무 확인 Validation Function
 * @parameter value
 * - @query nickname
 */
exports.checkBadWordInclude = async value => {
    try {
        const checkBadNickResult = await checkBadWord(value);
        if (checkBadNickResult)
            // 닉네임에 부적절한 단어 포함중
            return Promise.reject(responseMessage.NICKNAME_BAD_WORD_INCLUDE);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

/**
 * @title socialAccessToken과 vendor가 매칭되는지 확인 + 매칭되면 req 변수에 저장
 * @parameter value, req
 * - @body socialAccessToken
 */
exports.checkSoialAtMatchProvider = async (value, { req }) => {
    try {
        const vendor = value;
        const socialAccessToken = req.body.socialAccessToken;

        const socialUserProfile = (
            await axios({
                method: 'GET',
                url:
                    vendor === 'kakao'
                        ? 'https://kapi.kakao.com/v2/user/me'
                        : 'https://openapi.naver.com/v1/nid/me',
                headers: {
                    Authorization: `Bearer ${socialAccessToken}`,
                    'Content-Type': 'application/json'
                }
            })
        ).data;

        // req 변수에 저장
        req.socialUserProfile = socialUserProfile;
    } catch (err) {
        Logger.error(err);
        return Promise.reject(responseMessage.SOCIAL_LOGIN_ACCESS_TOKEN_ERROR);
    }
};