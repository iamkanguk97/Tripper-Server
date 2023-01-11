const User = require('../models/User/User');

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
    email, nickname, profileImage, kakaoId, ageGroup, gender
) => {
    const signUpResult = await User.create({
        email,
        nickname,
        profileImage,
        kakaoId,
        ageGroup,
        gender
    });
    console.log(signUpResult);
};

module.exports = {
    verifyNickname,
    kakaoLoginCallback,
    signUp
};