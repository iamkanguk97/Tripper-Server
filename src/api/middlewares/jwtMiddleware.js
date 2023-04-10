const jwt = require('jsonwebtoken');
const { JWT } = require('../../config/vars');
const { JWTError } = require('../errors/index');

// JWT 인증 미들웨어
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        req.verifiedToken = jwt.verify(token, JWT.ACCESS_SECRET_KEY);
        return next();
    } catch (err) {
        throw new JWTError(err);
    }
};

module.exports = jwtMiddleware;
