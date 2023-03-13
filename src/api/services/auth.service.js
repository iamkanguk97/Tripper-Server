const User = require('../models/User/User');
const RedisClient = require('../../config/redis');
const { verify, refreshVerify } = require('../utils/jwt-util');
const { getFirstLetter, ageGroupToString, uploadProfileImage, checkUserExistWithSnsId } = require('../utils/util');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt-util');
const { JWTError } = require('../utils/errors');

const kakaoLoginCallback = async (accessToken, refreshToken, profile) => {
    let redisClient = null;
    try {
        // 소셜로그인 고유값으로 유저 존재하는지 확인
        const checkIsUserExist = await checkUserExistWithSnsId('K', profile.id);

        /**
         * 유저가 있다 -> token 발급해주기
         * 유저가 없다 -> 회원가입 API로 넘기기
         */
        if (checkIsUserExist !== false && typeof checkIsUserExist === 'number') {
            // 유저가 있음
            // Redis Connection
            redisClient = new RedisClient();
            await redisClient.connect();

            const userIdx = checkIsUserExist;
            const jwtAt = generateAccessToken(userIdx);
            const jwtRt = await generateRefreshToken(userIdx, redisClient);

            // TODO: 카카오쪽에서 발급받은 AccessToken과 RefreshToken은 추후 필요할 때 클라쪽으로 Response 보내주자!
            return {
                isError: false,
                requireSignUp: false,
                result: {
                    userIdx,
                    jwt_token: {
                        accessToken: jwtAt,
                        refreshToken: jwtRt
                    }
                }
            };
        }
        // 유저가 없음
        const isAgeGroup = profile._json.kakao_account.has_age_range; // 유저가 연령대 동의했는지 여부
        const isGender = profile._json.kakao_account.has_gender; // 유저가 성별 동의했는지 여부

        // 회원가입 API로 넘기기
        return {
            isError: false,
            requireSignUp: true,
            result: {
                snsId: profile.id,
                email: profile._json.kakao_account.email,
                age_group: isAgeGroup ? profile._json.kakao_account.age_range : null,
                gender: isGender ? profile._json.kakao_account.gender : null,
                provider: 'kakao'
            }
        };
    } catch (err) {
        // 에러 발생 -> Middleware로 넘기기 위해 Return
        return { isError: true, error: err };
    } finally {
        if (redisClient) redisClient.quit();
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
        if (checkIsUserExist !== false && typeof checkIsUserExist === 'number') {
            // Redis Connection
            redisClient = new RedisClient();
            await redisClient.connect();

            const userIdx = checkIsUserExist;
            const jwtAt = generateAccessToken(userIdx);
            const jwtRt = await generateRefreshToken(userIdx, redisClient);

            return {
                isError: false,
                requireSignUp: false,
                result: {
                    userIdx,
                    jwt_token: {
                        accessToken: jwtAt,
                        refreshToken: jwtRt
                    }
                }
            };
        }
        // 회원가입 API로 넘기기
        return {
            isError: false,
            requireSignUp: true,
            result: {
                snsId: profile.id,
                email: profile._json.email,
                age_group: profile._json.age ? profile._json.age : null,
                gender: profile._json.gender ? profile._json.gender : null,
                provider: 'naver'
            }
        };
    } catch (err) {
        // 에러 발생 -> Middleware로 넘기기 위해 Return
        return { isError: true, error: err };
    } finally {
        if (redisClient) redisClient.quit();
    }
};

const signUp = async (email, nickname, profileImage, snsId, ageGroup, gender, provider) => {
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
        const newUserIdx = (
            await User.create({
                USER_EMAIL: email,
                USER_NICKNAME: nickname,
                USER_PROFILE_IMAGE: __profileImage,
                USER_SNS_ID: snsId,
                USER_AGE_GROUP: _ageGroup,
                USER_GENDER: _gender,
                USER_PROVIDER: _provider
            })
        ).dataValues.IDX;

        // JWT Access + Refresh 발급
        const jwtAt = generateAccessToken(newUserIdx);
        const jwtRt = await generateRefreshToken(newUserIdx, redisClient);

        return {
            newUserIdx,
            jwt_token: {
                accessToken: jwtAt,
                refreshToken: jwtRt
            }
        };
    } catch (err) {
        throw new Error(err);
    } finally {
        if (redisClient) redisClient.quit();
    }
};

const tokenRefresh = async (accessToken, refreshToken) => {
    /**
     * (1) Access-Token + Refresh-Token 모두 만료된 경우 => 새로 로그인 필요
     * (2) Access-Token 만료 + Refresh-Token 만료되지 않음 => 새로운 Access-Token 발급
     * (3) Access-Token 만료되지 않음 + Refresh-Token이 만료된 경우 => 새로운 Refresh-Token 발급
     * (4) Access-Token이 만료되지 않은 경우 => tokenRefresh 필요 없음.
     */
    let rm = null;
    const accessTokenVerify = verify(accessToken); // Access-Token 검증
    const _refreshTokenVerify = await refreshVerify(refreshToken); // Refresh-Token 검증

    if (!accessTokenVerify.isSuccess) {
        // Access-Token 검증에 실패함
        if (accessTokenVerify.message === 'jwt expired') {
            // Access-Token 사용 만료
            if (!_refreshTokenVerify && typeof _refreshTokenVerify === 'boolean') {
                // Refresh-Token도 만료일 경우 => 새로 로그인 필요
                // console.log('새로 로그인이 필요합니다!');
                rm = { message: '세션이 만료되었습니다. 로그인을 다시 진행해주세요.' };
            } else {
                // Refresh-Token이 만료되지 않았음 => 새로운 Access-Token 발급
                const userIdx = parseInt(_refreshTokenVerify.split('_')[1]);
                const newAccessToken = generateAccessToken(userIdx);
                // console.log(`[사용자 ${userIdx}] 새로운 Access-Token 발급 완료! => ${newAccessToken}`);
                rm = {
                    message: '새로운 Access-Token이 발급되었습니다.',
                    info: { userIdx, accessToken: newAccessToken }
                };
            }
        } else {
            // Access-Token 검증에 문제 발생 (malformed 등) => 에러 throw
            throw new JWTError(accessTokenVerify.message);
        }
    } else {
        // Access-Token 검증에 성공
        if (!_refreshTokenVerify && typeof _refreshTokenVerify === 'boolean') {
            // Refresh-Token이 만료일 경우 => 새로운 Refresh-Token 발급
            const userIdx = parseInt(accessTokenVerify.result.userIdx);
            const newRefreshToken = await generateRefreshToken(userIdx);
            // console.log(`[사용자 ${userIdx}] 새로운 Refresh-Token 발급 완료! => ${newRefreshToken}`);
            rm = {
                message: '새로운 Refresh-Token이 발급되었습니다.',
                info: { userIdx, refreshToken: newRefreshToken }
            };
        } else {
            // Access-Token + Refresh-Token 모두 정상상태 => 특별한 Action 필요 없음.
            rm = { message: 'Access-Token과 Refresh-Token이 모두 정상 상태입니다.' };
        }
    }

    return rm;
};

module.exports = {
    kakaoLoginCallback,
    naverLoginCallback,
    signUp,
    tokenRefresh
};
