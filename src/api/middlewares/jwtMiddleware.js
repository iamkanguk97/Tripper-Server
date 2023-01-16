const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const responseMessage = require('../../config/response/baseResponseStatus');
const { errResponse } = require('../../config/response/response-template');
const { JWT_SECRET_KEY } = require('../../config/vars');

// JWT 인증 미들웨어
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        req.verifiedToken = jwt.verify(token, JWT_SECRET_KEY);
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {   // 토큰 만료로 인한 에러 발생
            return res.status(httpStatus.UNAUTHORIZED).send(errResponse(responseMessage.JWT_TOKEN_EXPIRED_ERROR));
        }
        return res.status(httpStatus.UNAUTHORIZED).send(errResponse(responseMessage.JWT_AUTHORIZATION_ERROR));
    }
};

module.exports = jwtMiddleware;