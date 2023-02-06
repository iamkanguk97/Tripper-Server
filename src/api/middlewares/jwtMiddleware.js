const jwt = require('jsonwebtoken');
const responseMessage = require('../../config/response/baseResponseStatus');
const { JWT_SECRET_KEY } = require('../../config/vars');

// JWT 인증 미들웨어
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        req.verifiedToken = jwt.verify(token, JWT_SECRET_KEY);
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {   // 토큰 만료로 인한 에러 발생
            throw new jwt.TokenExpiredError(JSON.stringify(responseMessage.JWT_TOKEN_EXPIRED_ERROR));
        }
        throw new jwt.JsonWebTokenError(JSON.stringify(responseMessage.JWT_AUTHORIZATION_ERROR));
    }
};

module.exports = jwtMiddleware;