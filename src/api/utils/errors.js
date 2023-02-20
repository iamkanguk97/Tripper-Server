'use strict';
const httpStatus = require('http-status');

// 500번대 서버 에러 (데이터베이스 에러 포함)
class ServerError extends Error {
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

class JWTError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = httpStatus.UNAUTHORIZED;
    }
}

module.exports = {
    ServerError,
    BadRequestError,
    JWTError
};