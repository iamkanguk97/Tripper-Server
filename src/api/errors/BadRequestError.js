const httpStatus = require('http-status');

// 500번 서버에러 (validationMiddleware 에러)
class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = httpStatus.BAD_REQUEST;
    }
}

module.exports = BadRequestError;
