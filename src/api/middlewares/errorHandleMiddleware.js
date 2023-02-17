'use strict';
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const responseMessage = require('../../config/response/baseResponseStatus');
const { BadRequestError, ServerError } = require('../utils/errors');

const errorHandleMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message = null;

    if (error instanceof BadRequestError) {   // BadRequestError일 경우
        message = JSON.parse(error.message);
    }

    if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
        message = {
            ...responseMessage.INTERNAL_SERVER_ERROR,
            error
        };
    }

    return res.status(statusCode).json(message);
    // console.log(error);
    // const err = {
    //     statusCode: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    //     // message: JSON.parse(error.message) || responseMessage.INTERNAL_SERVER_ERROR
    //     // message: error.statusCode ? JSON.parse(error.message) : responseMessage.INTERNAL_SERVER_ERROR,
    //     // message: error.statusCode ? JSON.parse(error.message) : responseMessage.INTERNAL_SERVER_ERROR,
    //     message: JSON.parse(error.message)
    // };

    // // JWT Error
    // if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
    //     return res.status(httpStatus.UNAUTHORIZED).json(err.message);
    // }

    // // WrapAsync로부터 들어온 Error는 따로 객체 만들어서 처리 (Async Error)
    // // instanceof Error로 하게 되면 모든 error를 감지하기 때문에 현재로서는 Custom Error가 아니면 해당 조건문으로 들어오게 함.
    // if (!(error instanceof BadRequestError || error instanceof ServerError)) {
    //     console.log('asdf');
    //     return res.status(err.statusCode).json({
    //         ...(err.message),
    //         error: {
    //             message: error.message,
    //             stack: error.stack
    //         }
    //     })
    // }
    
    // // 이외의 Error들 처리
    // return res.status(err.statusCode).json(err.message);
};

module.exports = errorHandleMiddleware;