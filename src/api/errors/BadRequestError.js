const httpStatus = require('http-status');

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = httpStatus.BAD_REQUEST;
    }
}

module.exports = BadRequestError;
