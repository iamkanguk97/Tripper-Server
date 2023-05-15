const response = ({ isSuccess, code, message }, result) => ({
    isSuccess,
    code,
    message,
    result
});

const pageResponse = ({ isSuccess, code, message }, result, meta) => ({
    isSuccess,
    code,
    message,
    result,
    meta
});

const errResponse = ({ isSuccess, code, message }) => ({
    isSuccess,
    code,
    message
});

const validationErrorResponse = (isServerError, error) => ({
    isServerError,
    error
});

module.exports = {
    response,
    errResponse,
    validationErrorResponse,
    pageResponse
};
