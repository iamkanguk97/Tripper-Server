'use strict';
const User = require('../models/User/User');
const responseMessage = require('../../config/response/baseResponseStatus');
const { getFirstLetter, ageGroupToString, returnS3Module, uploadProfileImage, checkUserExistWithSnsId } = require('../utils/util');
const { S3 } = require('../../config/vars');
const { ServerError } = require('../utils/errors');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt-util');
const { hSet } = require('../../config/redis');

const kakaoLoginCallback = async (accessToken, refreshToken, profile) => {
    console.log(profile);
    // 소셜로그인 고유값으로 유저 존재하는지 확인
    const checkIsUserExist = await checkUserExistWithSnsId('K', profile.id);

    /**
     * 유저가 있다 -> token 발급해주기
     * 유저가 없다 -> 회원가입 API로 넘기기
     */
    if (checkIsUserExist !== false) {
        const userIdx = checkIsUserExist;
        const jwt_at = generateAccessToken(userIdx);
        const jwt_rt = generateRefreshToken();

        // Refresh token Redis에 저장
        await hSet('refreshToken', `userId_${userIdx}`, jwt_rt);

        return {
            requireSignUp: false,
            result: {
                userIdx,
                sns_token: {
                    accessToken,
                    refreshToken
                },
                jwt_token: {
                    accessToken: jwt_at,
                    refreshToken: jwt_rt
                }
            }
        };
    } else {
        const isAgeGroup = profile._json.kakao_account.has_age_range;
        const isGender = profile._json.kakao_account.has_gender;

        // 회원가입 API로 넘기기
        return {
            requireSignUp: true,
            result: {
                sns_token: {
                    accessToken,
                    refreshToken
                },
                snsId: profile.id,
                email: profile._json.kakao_account.email,
                age_group: isAgeGroup ? profile._json.kakao_account.age_range : null,
                gender: isGender ? profile._json.kakao_account.gender : null,
                provider: 'kakao',
            }
        };
    }
};

const naverLoginCallback = async (accessToken, refreshToken, profile) => {
    // 소셜로그인 고유값으로 유저 존재하는지 확인
    const checkIsUserExist = await checkUserExistWithSnsId('N', profile.id);
    
    /**
     * 유저가 있다 -> token 발급해주기
     * 유저가 없다 -> 회원가입 API로 넘기기
     */
    if (checkIsUserExist !== false) {
        const userIdx = checkIsUserExist;
        const jwt_at = generateAccessToken(userIdx);
        const jwt_rt = generateRefreshToken();

        // Refresh token Redis에 저장
        await hSet('refreshToken', `userId_${userIdx}`, jwt_rt);

        return {
            requireSignUp: false,
            result: {
                userIdx,
                sns_token: {
                    accessToken,
                    refreshToken
                },
                jwt_token: {
                    accessToken: jwt_at,
                    refreshToken: jwt_rt
                }
            }
        };
    } else {
        // 회원가입 API로 넘기기
        return {
            requireSignUp: true,
            result: {
                sns_token: {
                    accessToken,
                    refreshToken
                },
                snsId: profile.id,
                email: profile._json.email,
                age_group: profile._json.age,
                provider: 'naver',
            }
        };
    }
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
         * 프로필 사진을 카카오에서 가져오는걸로 하지말고 본인 갤러리에서 직접 설정할 수 있게하는걸로 하자!
         * profileImage가 null일 경우 -> 클라쪽에서 처리 가능 
         */
        __profileImage = profileImage ? await uploadProfileImage(profileImage, kakaoId) : null;

        // DB에 해당 User 등록
        const newUserIdx = (await User.create({
            USER_EMAIL: email,
            USER_NICKNAME: nickname,
            USER_PROFILE_IMAGE: __profileImage,
            USER_KAKAO_ID: kakaoId,
            USER_AGE_GROUP: _ageGroup,
            USER_GENDER: _gender,
            USER_PROVIDER: 'K',
        })).dataValues.IDX;

        // JWT Access + Refresh 발급
        const jwt_at = jwt_sign(newUserIdx);
        const jwt_rt = jwt_refresh();

        // Redis에 Refresh Token 저장
        hSet('refreshToken', `userId_${newUserIdx}`, jwt_rt);

        return {
            newUserIdx,
            token: {
                access_token: jwt_at,
                refresh_token: jwt_rt
            }
        };
    } catch (err) {
        console.log(err);
        // errorHandleMiddleware에 에러 전달.
        throw new ServerError(JSON.stringify({
            ...responseMessage.INTERNAL_SERVER_ERROR,
            error: {
                message: err.message,
                stack: err.stack
            },
        }));
    }
};

module.exports = {
    kakaoLoginCallback,
    naverLoginCallback,
    signUp
};