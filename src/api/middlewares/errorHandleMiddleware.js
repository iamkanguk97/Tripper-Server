'use strict';
const httpStatus = require('http-status');
const Logger = require('../../config/logger');
const responseMessage = require('../../config/response/baseResponseStatus');
const { BadRequestError, JWTError, CustomServerError } = require('../utils/errors');

// TODO: 이 에러 핸들링 부분은 지금 약간 뒤죽박죽이라고 생각함. 나중에 한번에 통일할 수 있게 코드 리팩토링 필요할듯?
const errorHandleMiddleware = (error, req, res, next) => {
    Logger.error(error); // 에러 로깅

    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message = null;

    if (error instanceof BadRequestError) {
        // BadRequestError일 경우
        message = JSON.parse(error.message);
    }

    if (error instanceof JWTError) {
        // JWT 관련 에러일 경우
        const _responseMessage = error.message.includes('expired') // expired라는 단어가 있으면 => 토큰 만료 에러 메세지 전달
            ? responseMessage.JWT_TOKEN_EXPIRED_ERROR
            : responseMessage.JWT_AUTHORIZATION_ERROR;

        message = { ..._responseMessage };
    }

    if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
        // 이외의 500번 에러일 경우
        const _error = error instanceof CustomServerError ? JSON.parse(error.message) : error;
        message = {
            ...responseMessage.INTERNAL_SERVER_ERROR,
            error: {
                message: _error.message,
                stack: _error.stack
            }
        };
    }

    return res.status(statusCode).json(message);
};

module.exports = errorHandleMiddleware;
