'use strict';
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const responseMessage = require('../../config/response/baseResponseStatus');

const errorHandleMiddleware = (error, req, res, next) => {
    console.log(error.constructor.name);
    const err = {
        statusCode: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        // statusCode: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        // message: JSON.parse(error.message) || responseMessage.INTERNAL_SERVER_ERROR
        message: error.statusCode ? JSON.parse(error.message) : responseMessage.INTERNAL_SERVER_ERROR,
    };

    // JWT Error
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
        return res.status(httpStatus.UNAUTHORIZED).json(err.message);
    }

    // WrapAsync로부터 들어온 Error는 따로 객체 만들어서 처리 (Async Error)
    // if (error instanceof Error) {
    //     return res.status(err.statusCode).json({
    //         ...(err.message),
    //         error: {
    //             message: error.message,
    //             stack: error.stack
    //         }
    //     })
    // }
    
    // 이외의 Error들 처리
    return res.status(err.statusCode).json(err.message);
};

module.exports = errorHandleMiddleware;