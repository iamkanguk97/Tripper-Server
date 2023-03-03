'use strict';
const { validationResult } = require("express-validator");
const { BadRequestError, ServerError } = require('../utils/errors');
const responseMessage = require('../../config/response/baseResponseStatus');

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req).errors;
    
    if (Object.keys(errors).length !== 0) {   // 에러가 있을 경우
        const errorMessage = errors[0].msg;

        if (Object.keys(errorMessage).includes('isServerError')) {   // isServerError 키가 있을경우 -> 서버 내부 에러 발생
            const _error = errorMessage.error;
            const _errorMessage = {
                message: _error.message,
                stack: _error.stack
            };
            console.log('hello!!!!!');
            console.log(_errorMessage);
            throw new Error(JSON.stringify(_errorMessage));
            // throw new ServerError(JSON.stringify(_errorMessage));
        } else {
            throw new BadRequestError(JSON.stringify(errorMessage));
        }
    }

    return next();
};

module.exports = validationMiddleware;