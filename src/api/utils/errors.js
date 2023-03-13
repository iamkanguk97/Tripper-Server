const httpStatus = require('http-status');

// 500번 서버에러 (validationMiddleware 에러)
class CustomServerError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
}

// 400번대 요청 에러
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = httpStatus.BAD_REQUEST;
    }
}

// 401에러 (JWT 인증 관련 에러)
class JWTError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = httpStatus.UNAUTHORIZED;
    }
}

module.exports = {
    CustomServerError,
    BadRequestError,
    JWTError
};
