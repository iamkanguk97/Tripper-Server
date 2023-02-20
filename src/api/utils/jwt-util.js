'use strict';
const { JWT_SECRET_KEY } = require('../../config/vars');
const jwt = require('jsonwebtoken');
const RedisClient = require('../../config/redis');
const { getKeyByValue } = require('./util');

// JWT Access Token 발급
const generateAccessToken = (newUserIdx) => {
    const payload = {   // access token에 들어갈 payload
        userIdx: newUserIdx
    };

    return jwt.sign(
        payload,
        JWT_SECRET_KEY,
        { algorithm: 'HS256', expiresIn: '1h' }
    );
};

// JWT Refresh Token 발급
const generateRefreshToken = () => {
    return jwt.sign(
        {},   // refresh token은 payload 없이 발급
        JWT_SECRET_KEY,
        { algorithm: 'HS256', expiresIn: '14d' }
    );
};

// JWT Access Token 검증
const verify = (token) => {
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
        }
    }
};

// JWT Refresh Token 검증
const refreshVerify = async (token) => {
    let redisClient = null;
    try {
        redisClient = new RedisClient();
        await redisClient.connect();

        const refreshTokens = await redisClient.hGetAll('refreshToken');
        // const userRefreshTokenExist = getKeyByValue(refreshTokens, token);
        return getKeyByValue(refreshTokens, 'asdf');   // Redis에 parameter로 전달된 해당 토큰이 있는지 확인
    } catch (err) {
        throw new Error(err);
    } finally {
        if (redisClient)
            redisClient.quit();
    }
};

// const refreshVerify = async (userIdx, token) => {
//     let redisClient = null;
//     try {
//         redisClient = new RedisClient();
//         await redisClient.connect();

//         const refreshTokenGetKey = `userId_${11}`;
//         // const refreshTokenGetKey = `userId_${userIdx}`;
//         const result = await redisClient.hGet('refreshToken', refreshTokenGetKey);

//         if (token === result) {
//             const verifyRefreshToken = jwt.verify(token, JWT_SECRET_KEY);
//             console.log(verifyRefreshToken);
//         }
//     } catch (err) {
//         throw new Error(err);
//     } finally {
//         if (redisClient)
//             redisClient.quit();
//     }
// };


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verify,
    refreshVerify
};