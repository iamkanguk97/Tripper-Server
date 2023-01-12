const moment = require('moment');
const User = require('../models/User/User');
const { getFirstLetter, ageGroupToString } = require('../utils/util');

const verifyNickname = async (nickname) => {
    const verifyResult = await User.findOne({ where: { USER_NICKNAME: nickname }});   // DB에서 해당 닉네임을 가진 Row가 존재하는지 확인
    return verifyResult ? true : false;
};

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
        // CREATED_AT: moment().format(),
        // UPDATED_AT: moment().format()
    });
    console.log(signUpResult);
};

module.exports = {
    verifyNickname,
    kakaoLoginCallback,
    signUp
};