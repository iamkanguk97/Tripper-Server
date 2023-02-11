'use strict';
const { JWT_SECRET_KEY } = require('../../config/vars');
const jwt = require('jsonwebtoken');

// JWT Access Token 발급
const jwt_sign = (newUserIdx) => {
    const payload = {   // access token에 들어갈 payload
        userIdx: newUserIdx
    };

    return jwt.sign(
        payload,
        JWT_SECRET_KEY,
        { algorithm: 'HS256', expiresIn: '1h' }
    );
};

const jwt_refresh = () => {
    return jwt.sign(
        {},   // refresh token은 payload 없이 발급
        JWT_SECRET_KEY,
        { algorithm: 'HS256', expiresIn: '14d' }
    );
};

module.exports = {
    jwt_sign,
    jwt_refresh
};