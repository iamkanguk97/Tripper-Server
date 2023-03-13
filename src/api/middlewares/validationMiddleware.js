const { validationResult } = require('express-validator');
const { BadRequestError, CustomServerError } = require('../utils/errors');

const validationMiddleware = (req, res, next) => {
    const { errors } = validationResult(req);

    if (Object.keys(errors).length !== 0) {
        // 에러가 있을 경우
        const errorMessage = errors[0].msg;

        if (Object.keys(errorMessage).includes('isServerError')) {
            // isServerError 키가 있을경우 -> 서버 내부 에러 발생
            const e = errorMessage.error;
            const em = {
                message: e.message,
                stack: e.stack
            };
            throw new CustomServerError(JSON.stringify(em));
        } else {
            throw new BadRequestError(JSON.stringify(errorMessage));
        }
    }

    return next();
};

module.exports = validationMiddleware;
