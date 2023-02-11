'use strict';
const User = require('../models/User/User');
const { getFirstLetter, ageGroupToString, returnS3Module } = require('../utils/util');
const { S3 } = require('../../config/vars');
const { ServerError } = require('../utils/errors');
const { jwt_sign, jwt_refresh } = require('../utils/jwt-util');
const { hSet } = require('../../config/redis');

const kakaoLoginCallback = async (accessToken, refreshToken, profile) => {
    // DB에 해당 사용자가 등록되어 있는지 먼저 확인
    const checkExistUser = await User.findOne({
        where: {
            USER_KAKAO_ID: kakaoId,
            USER_PROVIDER: provider
        }
    });
};

const naverLoginCallback = async (accessToken, refreshToken, profile) => {

};

const signUp = async (
    email, nickname, 
    profileImage, kakaoId,
    ageGroup, gender
) => {
    try {
        let __profileImage = null;
        const _gender = !gender ? gender : getFirstLetter(gender);
        const _ageGroup = !ageGroup ? ageGroup : ageGroupToString(ageGroup);
        // TODO: 추후 카카오 로그인만 아닌 다른 로그인 연동 시 provider 동적으로 세팅필요

        /**
         * // TODO: S3에 프로필 사진 등록 -> 클라쪽이랑 협의
         * DOC: 프로필 사진을 카카오에서 가져오는걸로 하지말고 본인 갤러리에서 직접 설정할 수 있게하는걸로 하자!
         */
        // if (profileImage) {   // 프로필 이미지가 있으면
        //     const s3 = returnS3Module();
        //     const fileContent = Buffer.from(profileImage.data, 'binary');
        //     const params = {   // S3 Upload Parameters
        //         Bucket: '11',
        //         // Bucket: S3.BUCKET_NAME,
        //         Key: `profile/profile_kakaoId_${kakaoId}`,
        //         Body: fileContent
        //     };

        //     const uploadProfileImageResult = await s3.upload(params).promise();
        //     const _profileImage = uploadProfileImageResult.Location;
        //     __profileImage = _profileImage;
        // }

        // DB에 해당 User 등록
        // const newUserIdx = (await User.create({
        //     USER_EMAIL: email,
        //     USER_NICKNAME: nickname,
        //     USER_PROFILE_IMAGE: __profileImage,
        //     USER_KAKAO_ID: kakaoId,
        //     USER_AGE_GROUP: _ageGroup,
        //     USER_GENDER: _gender,
        //     USER_PROVIDER: 'K',
        // })).dataValues.IDX;

        // JWT Access + Refresh 발급
        const jwt_at = jwt_sign(1);
        const jwt_rt = jwt_refresh();

        // Redis에 Refresh Token 저장
        hSet('refreshToken', 'userId_1', jwt_rt);
        hSet('refreshToken', 'userId_2', jwt_rt);

        return {
            newUserIdx: 1,
            token: {
                access_token: jwt_at,
                refresh_token: jwt_rt
            }
        };
    } catch (err) {
        // errorHandleMiddleware에 에러 전달.
        throw new ServerError(err);
    }
};

module.exports = {
    kakaoLoginCallback,
    signUp
};