'use strict';
const { JWT_SECRET_KEY } = require('../../config/vars');

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

module.exports = {
    jwt_sign
};