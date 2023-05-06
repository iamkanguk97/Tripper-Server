const httpStatus = require('http-status');
const AdminService = require('../services/admin.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response, errResponse } = require('../../config/response/response-template');

const signUp = async (req, res) => {
    const { email, password, nickname } = req.body;
    const signUpResult = await AdminService.signUp(email, password, nickname);
    return res
        .status(httpStatus.CREATED)
        .json(response(responseMessage.CREATE_SUCCESS, signUpResult));
};

const login = async (req, res) => {
    const { password } = req.body;
    const adminIdx = req.adminIdx;
    // 이메일은 이미 Middleware단에서 확인완료
    const loginResult = await AdminService.login(adminIdx, password);

    if (!loginResult)
        return res
            .status(httpStatus.BAD_REQUEST)
            .json(errResponse(responseMessage.ADMIN_PASSWORD_WRONG));
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, loginResult));
};

const getReports = async (req, res) => {
    const getReportsResult = await AdminService.getReports();
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, getReportsResult));
};

const getReportDetail = async (req, res) => {
    const reportIdx = req.param.reportIdx;
    const getReportDetailResult = await AdminService.getReportDetail(reportIdx);
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, getReportDetailResult));
};

module.exports = {
    signUp,
    login,
    getReports,
    getReportDetail
};
