const response = ({isSuccess, code, message}, result) => {
    return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        result: result
    }
};
 
const errResponse = ({isSuccess, code, message}) => {
    return {
        isSuccess: isSuccess,
        code: code,
        message: message
    }
};

const validationErrorResponse = (isServerError, error) => {
    return {
        isServerError: isServerError,
        error: error
    }
};
   
module.exports = { 
    response, 
    errResponse, 
    validationErrorResponse 
};