const httpStatus = require('http-status');

// 500번 서버에러 (validationMiddleware 에러)
class CustomServerError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
}

module.exports = CustomServerError;
