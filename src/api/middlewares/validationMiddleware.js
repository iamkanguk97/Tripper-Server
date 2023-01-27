const { validationResult } = require("express-validator");
const httpStatus = require("http-status");
const { errResponse } = require("../../config/response/response-template");

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req).errors;
    
    if (Object.keys(errors).length !== 0) {   // 에러가 있을 경우
        const errorMessage = errors[0].msg;
        return res.status(httpStatus.BAD_REQUEST).send(errResponse(errorMessage));
    }

    return next();
};

module.exports = validationMiddleware;