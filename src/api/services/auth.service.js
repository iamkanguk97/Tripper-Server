const User = require('../models/User/User');
const responseMessage = require('../../config/response/baseResponseStatus');
const { getFirstLetter, ageGroupToString } = require('../utils/util');
const { response, errResponse } = require('../../config/response/response-template');

const kakaoLoginCallback = async (accessToken, refreshToken, profile) => {
    // DB에 해당 사용자가 등록되어 있는지 먼저 확인
    const checkExistUser = await User.findOne({
        where: {
            USER_KAKAO_ID: kakaoId,
            USER_PROVIDER: provider
        }
    });
};

const signUp = async (
    email, nickname, 
    profileImage, kakaoId, 
    ageGroup, gender
) => {
    try {
        const _gender = !gender ? gender : getFirstLetter(gender);
        const _ageGroup = !ageGroup ? ageGroup : ageGroupToString(ageGroup);
        // TODO: 추후 카카오 로그인만 아닌 다른 로그인 연동 시 provider 동적으로 세팅필요

        // TODO: S3에 프로필 사진 등록 -> 클라쪽이랑 협의
        

        // DB에 해당 User 등록
        const signUpResult = await User.create({
            USER_EMAIL: email,
            USER_NICKNAME: nickname,
            USER_PROFILE_IMAGE: profileImage,
            USER_KAKAO_ID: kakaoId,
            USER_AGE_GROUP: _ageGroup,
            USER_GENDER: _gender,
            USER_PROVIDER: 'K'
        });
        
        const newUserIdx = signUpResult.dataValues.IDX;
        return response(responseMessage.SUCCESS, { newUserIdx });
    } catch (err) {
        console.log(err);
        return errResponse(responseMessage.INTERNAL_SERVER_ERROR);
    }
};

module.exports = {
    kakaoLoginCallback,
    signUp
};