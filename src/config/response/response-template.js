const response = ({ isSuccess, code, message }, result) => ({
    isSuccess,
    code,
    message,
    result
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
    validationErrorResponse
};
