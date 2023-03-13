const httpStatus = require('http-status');

// 401에러 (JWT 인증 관련 에러)
class JWTError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = httpStatus.UNAUTHORIZED;
    }
}

module.exports = JWTError;
