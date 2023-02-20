'use strict';
const { JWT_SECRET_KEY } = require('../../config/vars');
const jwt = require('jsonwebtoken');

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

const jwt_refresh = () => {
    return jwt.sign(
        {},   // refresh token은 payload 없이 발급
        JWT_SECRET_KEY,
        { algorithm: 'HS256', expiresIn: '14d' }
    );
};

// JWT Refresh Token 검증
const jwt_refresh_verify = async (userIdx, token) => {
    /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환하게 해줍니다.*/
       // const getAsync = promisify(redisClient.get).bind(redisClient);

       try {
        
       } catch (err) {

       }
    
    //    try {
    //      const data = await getAsync(userId); // refresh token 가져오기
    //      if (token === data) {
    //        try {
    //          jwt.verify(token, secret);
    //          return true;
    //        } catch (err) {
    //          return false;
    //        }
    //      } else {
    //        return false;
    //      }
    //    } catch (err) {
    //      return false;
    //    }
};


module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verify,
    jwt_refresh_verify
};