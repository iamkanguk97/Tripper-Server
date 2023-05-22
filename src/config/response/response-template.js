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

const pageResponse = (currentPage, totalPage) => ({
    is_end: currentPage >= totalPage,
    currentPage,
    totalPage
});

module.exports = {
    response,
    errResponse,
    validationErrorResponse,
    pageResponse
};
