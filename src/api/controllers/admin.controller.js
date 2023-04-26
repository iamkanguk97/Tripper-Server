const httpStatus = require('http-status');
const AdminService = require('../services/admin.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response } = require('../../config/response/response-template');

const signUp = async (req, res) => {
    const { email, password, nickname } = req.body;
    const signUpResult = await AdminService.signUp(email, password, nickname);
    return res
        .status(httpStatus.CREATED)
        .json(response(responseMessage.CREATE_SUCCESS, signUpResult));
};

const login = async (req, res) => {};

module.exports = {
    signUp,
    login
};
