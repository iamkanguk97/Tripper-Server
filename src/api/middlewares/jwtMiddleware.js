'use strict';
const jwt = require('jsonwebtoken');
const responseMessage = require('../../config/response/baseResponseStatus');
const { JWT_SECRET_KEY } = require('../../config/vars');
const { JWTError } = require('../utils/errors');

// JWT 인증 미들웨어
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        req.verifiedToken = jwt.verify(token, JWT_SECRET_KEY);
        return next();
    } catch (err) {
        throw new JWTError(err);
    }
};

module.exports = jwtMiddleware;