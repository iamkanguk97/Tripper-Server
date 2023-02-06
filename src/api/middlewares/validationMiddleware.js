const { validationResult } = require("express-validator");
const { BadRequestError } = require('../utils/errors');

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req).errors;
    
    if (Object.keys(errors).length !== 0) {   // 에러가 있을 경우
        const errorMessage = errors[0].msg;
        throw new BadRequestError(JSON.stringify(errorMessage));
    }

    return next();
};

module.exports = validationMiddleware;