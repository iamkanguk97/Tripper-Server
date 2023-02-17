'use strict';
const User = require('../models/User/User');
const responseMessage = require('../../config/response/baseResponseStatus');
const RedisClient = require('../../config/redis');
const { getFirstLetter, ageGroupToString, returnS3Module, uploadProfileImage, checkUserExistWithSnsId } = require('../utils/util');
const { JWT_REFRESH_TOKEN_EXPIRE_TIME } = require('../../config/vars');
const { ServerError } = require('../utils/errors');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt-util');

const kakaoLoginCallback = async (accessToken, refreshToken, profile) => {
    let redisClient = null;
    try {
        // 소셜로그인 고유값으로 유저 존재하는지 확인
        const checkIsUserExist = await checkUserExistWithSnsId('K', profile.id);

        /**
         * 유저가 있다 -> token 발급해주기
         * 유저가 없다 -> 회원가입 API로 넘기기
         */
        if (checkIsUserExist !== false) {
            // Redis Connection
            redisClient = new RedisClient();
            await redisClient.connect();

            const userIdx = checkIsUserExist;
            const jwt_at = generateAccessToken(userIdx);
            const jwt_rt = generateRefreshToken();

            // Refresh token Redis에 저장
            await redisClient.hSet('refreshToken', `userId_${userIdx}`, jwt_rt, JWT_REFRESH_TOKEN_EXPIRE_TIME);

            // TODO: 카카오쪽에서 발급받은 AccessToken과 RefreshToken은 추후 필요할 때 클라쪽으로 Response 보내주자!
            return {
                isError: false,
                requireSignUp: false,
                result: {
                    userIdx,
                    jwt_token: {
                        accessToken: jwt_at,
                        refreshToken: jwt_rt
                    }
                }
            }
        } else {
            const isAgeGroup = profile._json.kakao_account.has_age_range;   // 유저가 연령대 동의했는지 여부
            const isGender = profile._json.kakao_account.has_gender;   // 유저가 성별 동의했는지 여부

            // 회원가입 API로 넘기기
            return {
                isError: false,
                requireSignUp: true,
                result: {
                    snsId: profile.id,
                    email: profile._json.kakao_account.email,
                    age_group: isAgeGroup ? profile._json.kakao_account.age_range : null,
                    gender: isGender ? profile._json.kakao_account.gender : null,
                    provider: 'kakao',
                }
            };
        }
    } catch (err) {
        // 에러 발생 -> Middleware로 넘기기 위해 Return
        return { isError: true, error: err };
    } finally {
        if (redisClient)
            redisClient.quit();
    }
};

const naverLoginCallback = async (accessToken, refreshToken, profile) => {
    let redisClient = null;
    try {
        // 소셜로그인 고유값으로 유저 존재하는지 확인
        const checkIsUserExist = await checkUserExistWithSnsId('N', profile.id);
    
        /**
         * 유저가 있다 -> token 발급해주기
         * 유저가 없다 -> 회원가입 API로 넘기기
         */
        if (checkIsUserExist !== false) {
            // Redis Connection
            redisClient = new RedisClient();
            await redisClient.connect();

            const userIdx = checkIsUserExist;
            const jwt_at = generateAccessToken(userIdx);
            const jwt_rt = generateRefreshToken();

            // Refresh token Redis에 저장
            await redisClient.hSet('refreshToken', `userId_${userIdx}`, jwt_rt, JWT_REFRESH_TOKEN_EXPIRE_TIME);

            return {
                isError: false,
                requireSignUp: false,
                result: {
                    userIdx,
                    jwt_token: {
                        accessToken: jwt_at,
                        refreshToken: jwt_rt
                    }
                }
            };
        } else {
            // 회원가입 API로 넘기기
            return {
                isError: false,
                requireSignUp: true,
                result: {
                    snsId: profile.id,
                    email: profile._json.email,
                    age_group: profile._json.age ? profile._json.age : null,
                    gender: profile._json.gender ? profile._json.gender : null,
                    provider: 'naver',
                }
            };
        }    
    } catch (err) {
        // 에러 발생 -> Middleware로 넘기기 위해 Return
        return { isError: true, error: err };
    } finally {
        if (redisClient)
            redisClient.quit();
    }
};

const signUp = async (
    email, nickname,
    profileImage, snsId,
    ageGroup, gender, provider
) => {
    let redisClient = null;
    let __profileImage = null;

    try {
        redisClient = new RedisClient();
        await redisClient.connect();

        const _gender = !gender ? gender : getFirstLetter(gender);
        const _ageGroup = !ageGroup ? ageGroup : ageGroupToString(ageGroup);
        const _provider = getFirstLetter(provider);

        /**
         * 프로필 사진을 카카오에서 가져오는걸로 하지말고 본인 갤러리에서 직접 설정할 수 있게하는걸로 하자!
         * profileImage가 null일 경우 -> 클라쪽에서 처리 가능 
         */
        __profileImage = profileImage ? await uploadProfileImage(profileImage, snsId) : null;

        // DB에 해당 User 등록
        const newUserIdx = (await User.create({
            USER_EMAIL: email,
            USER_NICKNAME: nickname,
            USER_PROFILE_IMAGE: __profileImage,
            USER_SNS_ID: snsId,
            USER_AGE_GROUP: _ageGroup,
            USER_GENDER: _gender,
            USER_PROVIDER: _provider,
        })).dataValues.IDX;

        // JWT Access + Refresh 발급
        const jwt_at = generateAccessToken(newUserIdx);
        const jwt_rt = generateRefreshToken();

        // Redis에 Refresh Token 저장
        await redisClient.hSet('refreshToken', `userId_${newUserIdx}`, jwt_rt, JWT_REFRESH_TOKEN_EXPIRE_TIME);

        return {
            newUserIdx,
            jwt_token: {
                accessToken: jwt_at,
                refreshToken: jwt_rt
            }
        };
    } catch (err) {
        throw new Error(err);
    } finally {
        if (redisClient)
            redisClient.quit();
    }
};

module.exports = {
    kakaoLoginCallback,
    naverLoginCallback,
    signUp
};