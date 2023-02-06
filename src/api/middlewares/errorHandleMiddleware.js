const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const Logger = require('../../config/logger');
const responseMessage = require('../../config/response/baseResponseStatus');

const errorHandleMiddleware = (error, req, res, next) => {
    Logger.error(error);   // console에 에러 출력

    const err = {
        statusCode: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        // message: JSON.parse(error.message) || responseMessage.INTERNAL_SERVER_ERROR
        message: error.statusCode ? JSON.parse(error.message) : responseMessage.INTERNAL_SERVER_ERROR
    };

    // JWT Error
    if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
        return res.status(httpStatus.UNAUTHORIZED).json(JSON.parse(error.message));
    }
    
    // 이외의 Error들 처리
    return res.status(err.statusCode).json(err.message);
};

module.exports = errorHandleMiddleware;