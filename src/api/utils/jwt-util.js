const jwt = require('jsonwebtoken');
const { JWT } = require('../../config/vars');
const { getKeyByValue } = require('./util');

// JWT Access Token 발급
const generateAccessToken = userIdx => {
    const payload = {
        // access token에 들어갈 payload
        userIdx
    };

    return jwt.sign(payload, JWT.ACCESS_SECRET_KEY, { algorithm: 'HS256', expiresIn: '1h' });
};

// JWT Refresh Token 발급 -> payload 없음
const generateRefreshToken = () => {
    return jwt.sign({}, JWT.REFRESH_SECRET_KEY, { algorithm: 'HS256', expiresIn: '14d' });
};

// JWT Refresh Token 저장
const saveRefreshToken = async (redisClient, userIdx, refreshToken) => {
    await redisClient.hSet(
        'refreshToken',
        `userId_${userIdx}`,
        refreshToken,
        JWT.REFRESH_TOKEN_EXPIRE_TIME
    );
};

// JWT Access Token 검증
const verify = token => {
    let decoded = null;
    try {
        decoded = jwt.verify(token, JWT.ACCESS_SECRET_KEY);
        return {
            isSuccess: true,
            result: decoded
        };
    } catch (err) {
        return {
            isSuccess: false,
            message: err.message
        };
    }
};

// JWT Refresh Token 검증
const refreshVerify = async (redisClient, refreshToken) => {
    const refreshTokens = await redisClient.hGetAll('refreshToken'); // refreshToken key에 있는 field 전부 가져옴
    return getKeyByValue(refreshTokens, refreshToken); // Redis에 parameter로 전달된 해당 토큰이 있는지 확인
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    saveRefreshToken,
    verify,
    refreshVerify
};
