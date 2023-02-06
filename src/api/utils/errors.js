'use strict';
const httpStatus = require('http-status');

class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}

class BadRequestError extends CustomError {
    constructor(message) {
        super(message)
		this.statusCode = httpStatus.BAD_REQUEST;
    }
}

module.exports = {
    CustomError,
    BadRequestError,
};