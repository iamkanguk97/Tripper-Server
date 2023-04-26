const axios = require('axios');
const User = require('../models/User/User');
const RedisClient = require('../../config/redis');
const { verify, refreshVerify, saveRefreshToken } = require('../utils/jwt-util');
const {
    getFirstLetter,
    uploadProfileImage,
    checkUserExistWithSnsId,
    ageGroupToString,
    genRandomNumber
} = require('../utils/util');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt-util');
const { JWTError, BadRequestError } = require('../errors/index');
const responseMessage = require('../../config/response/baseResponseStatus');
const { sendVerifyEmail } = require('../../config/email');
const { NODEMAILER } = require('../../config/vars');

const kakaoLoginCallback = async (kakaoId, email, ageGroup, gender) => {
    // 소셜로그인 고유값으로 유저 존재하는지 확인
    const checkIsUserExist = await checkUserExistWithSnsId('K', kakaoId);

    /**
     * 유저가 있다 -> token 발급해주기
     * 유저가 없다 -> 회원가입 API로 넘기기
     */
    if (checkIsUserExist !== -1) {
        // 유저가 있다
        const userIdx = checkIsUserExist;
        const jwtAT = generateAccessToken(userIdx); // Access-Token 발급
        const jwtRT = generateRefreshToken(); // Refresh-Token 발급

        const redisClient = new RedisClient();
        await redisClient.connect(); // Redis 연결

        // Redis에 RT 저장 + Redis 연결 끊기
        await saveRefreshToken(redisClient, userIdx, jwtRT);
        await redisClient.quit();

        return {
            requireSignUp: false,
            loginUser: {
                userIdx,
                snsId: kakaoId,
                email,
                ageGroup,
                gender,
                provider: 'K'
            },
            jwt_token: {
                accessToken: jwtAT,
                refreshToken: jwtRT
            }
        };
    }
    return {
        requireSignUp: true,
        snsId: kakaoId,
        email,
        age_group: ageGroup,
        gender,
        provider: 'kakao'
    };
};

const naverLoginCallback = async (naverId, email, ageGroup, gender) => {
    // 소셜로그인 고유값으로 유저 존재하는지 확인
    const checkIsUserExist = await checkUserExistWithSnsId('N', naverId);

    /**
     * 유저가 있다 -> token 발급해주기
     * 유저가 없다 -> 회원가입 API로 넘기기
     */
    if (checkIsUserExist !== -1) {
        // 유저가 있다
        const userIdx = checkIsUserExist;
        const jwtAT = generateAccessToken(userIdx); // Access-Token 발급
        const jwtRT = generateRefreshToken(); // Refresh-Token 발급

        const redisClient = new RedisClient();
        await redisClient.connect(); // Redis 연결

        // Redis에 RT 저장 + Redis 연결 끊기
        await saveRefreshToken(redisClient, userIdx, jwtRT);
        await redisClient.quit();

        return {
            requireSignUp: false,
            loginUser: {
                userIdx,
                snsId: naverId,
                email,
                ageGroup,
                gender,
                provider: 'N'
            },
            jwt_token: {
                accessToken: jwtAT,
                refreshToken: jwtRT
            }
        };
    }
    return {
        requireSignUp: true,
        snsId: naverId,
        email,
        age_group: ageGroup,
        gender,
        provider: 'naver'
    };
};

const socialLogin = async (provider, socialAccessToken) => {
    let snsId;
    let email;
    let ageGroup;
    let gender;
    let socialUserProfile;

    try {
        socialUserProfile = (
            await axios({
                method: 'GET',
                url:
                    provider === 'kakao'
                        ? 'https://kapi.kakao.com/v2/user/me'
                        : 'https://openapi.naver.com/v1/nid/me',
                headers: {
                    Authorization: `Bearer ${socialAccessToken}`,
                    'Content-Type': 'application/json'
                }
            })
        ).data;
    } catch (err) {
        throw new BadRequestError(JSON.stringify(responseMessage.SOCIAL_LOGIN_ACCESS_TOKEN_ERROR));
    }

    if (provider === 'kakao') {
        const kakaoAccount = socialUserProfile.kakao_account;

        snsId = socialUserProfile.id;
        email =
            !kakaoAccount.has_email ||
            (kakaoAccount.has_email && kakaoAccount.email_needs_agreement)
                ? null
                : kakaoAccount.email;
        ageGroup =
            !kakaoAccount.has_age_range ||
            (kakaoAccount.has_age_range && kakaoAccount.age_range_needs_agreement)
                ? null
                : ageGroupToString(kakaoAccount.age_range);
        gender =
            !kakaoAccount.has_gender ||
            (kakaoAccount.has_gender && kakaoAccount.gender_needs_agreement)
                ? null
                : getFirstLetter(kakaoAccount.gender);
    } else {
        const naverResponse = socialUserProfile.response;

        snsId = naverResponse.id;
        email = naverResponse.email ?? null;
        ageGroup = !naverResponse.age ? null : ageGroupToString(naverResponse.age);
        gender = naverResponse.gender ?? null;
    }

    // 소셜로그인 고유값으로 유저 등록되어있는지 확인
    const _provider = getFirstLetter(provider);
    const checkIsUserExist = await checkUserExistWithSnsId(_provider, snsId);

    /**
     * 유저가 있다 -> token 발급해주기
     * 유저가 없다 -> 회원가입 API로 넘기기
     */
    if (checkIsUserExist !== -1) {
        // 유저가 있다
        const userIdx = checkIsUserExist;
        const jwtAT = generateAccessToken(userIdx); // Access-Token 발급
        const jwtRT = generateRefreshToken(); // Refresh-Token 발급

        const redisClient = new RedisClient();
        await redisClient.connect(); // Redis 연결

        // Redis에 RT 저장 + Redis 연결 끊기
        await saveRefreshToken(redisClient, userIdx, jwtRT);
        await redisClient.quit();

        return {
            requireSignUp: false,
            loginUser: {
                userIdx,
                snsId,
                email,
                ageGroup,
                gender,
                provider: _provider
            },
            jwt_token: {
                accessToken: jwtAT,
                refreshToken: jwtRT
            }
        };
    }
    return {
        requireSignUp: true,
        snsId,
        email,
        ageGroup,
        gender,
        provider: _provider
    };
};

const signUp = async (email, nickname, profileImage, snsId, ageGroup, gender, provider) => {
    /**
     * 프로필 사진을 카카오에서 가져오는걸로 하지말고 본인 갤러리에서 직접 설정할 수 있게하는걸로 하자!
     * profileImage가 null일 경우 -> 클라쪽에서 처리 가능
     */
    const _profileImage = profileImage ? await uploadProfileImage(profileImage, snsId) : null;

    // DB에 해당 User 등록
    const newUserIdx = (
        await User.create({
            USER_EMAIL: email,
            USER_NICKNAME: nickname,
            USER_PROFILE_IMAGE: _profileImage,
            USER_SNS_ID: snsId,
            USER_AGE_GROUP: ageGroup,
            USER_GENDER: gender,
            USER_PROVIDER: provider
        })
    ).dataValues.IDX;

    // JWT Access + Refresh 발급
    const jwtAT = generateAccessToken(newUserIdx);
    const jwtRT = generateRefreshToken();

    const redisClient = new RedisClient();
    await redisClient.connect(); // Redis 연결

    // Redis에 RT 저장 + Redis 연결 끊기
    await saveRefreshToken(redisClient, newUserIdx, jwtRT);
    await redisClient.quit();

    return {
        new_user: {
            userId: newUserIdx,
            email,
            snsId,
            profileImage: _profileImage,
            ageGroup,
            gender,
            provider
        },
        jwt_token: {
            accessToken: jwtAT,
            refreshToken: jwtRT
        }
    };
};

const tokenRefresh = async (accessToken, refreshToken) => {
    /**
     * (1) Access-Token + Refresh-Token 모두 만료된 경우 => 새로 로그인 필요
     * (2) Access-Token 만료 + Refresh-Token 만료되지 않음 => 새로운 Access-Token 발급
     * (3) Access-Token 만료되지 않음 + Refresh-Token이 만료된 경우 => 새로운 Refresh-Token 발급
     * (4) Access-Token이 만료되지 않은 경우 => tokenRefresh 필요 없음.
     */
    const redisClient = new RedisClient();
    await redisClient.connect(); // Redis 연결

    let rm = null;
    const accessTokenVerify = verify(accessToken); // Access-Token 검증
    const refreshTokenVerify = await refreshVerify(redisClient, refreshToken); // Refresh-Token 검증

    if (!accessTokenVerify.isSuccess) {
        // Access-Token 검증에 실패함
        if (accessTokenVerify.message === 'jwt expired') {
            // Access-Token 사용 만료
            if (!refreshTokenVerify && typeof refreshTokenVerify === 'boolean') {
                // Refresh-Token도 만료일 경우 => 새로 로그인 필요
                // console.log('새로 로그인이 필요합니다!');
                rm = { message: '세션이 만료되었습니다. 로그인을 다시 진행해주세요.' };
            } else {
                // Refresh-Token이 만료되지 않았음 => 새로운 Access-Token 발급
                const userIdx = parseInt(refreshTokenVerify.split('_')[1]);
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
        if (!refreshTokenVerify && typeof refreshTokenVerify === 'boolean') {
            // Refresh-Token이 만료일 경우 => 새로운 Refresh-Token 발급
            const userIdx = parseInt(accessTokenVerify.result.userIdx);
            const newRefreshToken = generateRefreshToken(userIdx);
            await saveRefreshToken(redisClient, userIdx, newRefreshToken);
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

    await redisClient.quit();
    return rm;
};

const getEmailVerify = async (email, verifyNumber) => {
    const redisClient = new RedisClient();
    await redisClient.connect(); // Redis 연결

    // Redis에 저장되어있는 인증번호 가져오기
    const storedVerifyNumber = await redisClient.hGet('emailVerify', `E_${email}`);
    const verifyResult = !(!storedVerifyNumber || storedVerifyNumber !== verifyNumber);

    // 인증 성공하면 해당 데이터 삭제
    if (verifyResult) {
        await redisClient.hDel('emailVerify', `E_${email}`);
    }

    await redisClient.quit();
    return verifyResult;
};

const postEmailVerify = async email => {
    const redisClient = new RedisClient();
    await redisClient.connect(); // Redis 연결

    // 랜덤 난수 생성
    const verifyNumber = genRandomNumber(6);

    await Promise.all([
        await sendVerifyEmail(email, verifyNumber),
        await redisClient.hSet('emailVerify', `E_${email}`, verifyNumber, NODEMAILER.EXPIRE_TIME) // email-인증번호 저장
    ]);

    await redisClient.quit(); // Redis 연결 끊기
};

module.exports = {
    kakaoLoginCallback,
    naverLoginCallback,
    signUp,
    tokenRefresh,
    socialLogin,
    getEmailVerify,
    postEmailVerify
};
