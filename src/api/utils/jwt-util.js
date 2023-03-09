'use strict';
const { JWT_SECRET_KEY, JWT_REFRESH_TOKEN_EXPIRE_TIME } = require('../../config/vars');
const jwt = require('jsonwebtoken');
const RedisClient = require('../../config/redis');
const { getKeyByValue } = require('./util');

// JWT Access Token 발급
const generateAccessToken = newUserIdx => {
    const payload = {
        // access token에 들어갈 payload
        userIdx: newUserIdx
    };

    return jwt.sign(payload, JWT_SECRET_KEY, { algorithm: 'HS256', expiresIn: '1h' });
};

// JWT Refresh Token 발급
const generateRefreshToken = async (userIdx, redisClient = null) => {
    const newRefreshToken = jwt.sign(
        {}, // refresh token은 payload 없이 발급
        JWT_SECRET_KEY,
        { algorithm: 'HS256', expiresIn: '14d' }
    );

    if (!redisClient) {
        let _redisClient = null;
        try {
            _redisClient = new RedisClient();
            await _redisClient.connect();
            await _redisClient.hSet(
                'refreshToken',
                `userId_${userIdx}`,
                newRefreshToken,
                JWT_REFRESH_TOKEN_EXPIRE_TIME
            );
        } catch (err) {
            throw new Error(err);
        } finally {
            _redisClient.quit();
        }
    } else {
        // Redis에 Refresh-Token 저장
        await redisClient.hSet(
            'refreshToken',
            `userId_${userIdx}`,
            newRefreshToken,
            JWT_REFRESH_TOKEN_EXPIRE_TIME
        );
    }

    return newRefreshToken;
};

// JWT Access Token 검증
const verify = token => {
    let decoded = null;
    try {
        decoded = jwt.verify(token, JWT_SECRET_KEY);
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
const refreshVerify = async token => {
    let redisClient = null;
    try {
        redisClient = new RedisClient();
        await redisClient.connect();

        const refreshTokens = await redisClient.hGetAll('refreshToken'); // refreshToken key에 있는 field 전부 가져옴
        return getKeyByValue(refreshTokens, token); // Redis에 parameter로 전달된 해당 토큰이 있는지 확인
        // return getKeyByValue(refreshTokens, 'asdf');   // Redis에 parameter로 전달된 해당 토큰이 있는지 확인
    } catch (err) {
        throw new Error(err);
    } finally {
        if (redisClient) redisClient.quit();
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verify,
    refreshVerify
};
