const httpStatus = require('http-status');
const UserService = require('../services/user.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response } = require('../../config/response/response-template');

const follow = async (req, res) => {
    const { followUserIdx } = req.body;
    const myIdx = req.verifiedToken.userIdx;

    const followResultMessage = await UserService.follow(myIdx, followUserIdx);
    return res
        .status(httpStatus.OK)
        .json(response(responseMessage.SUCCESS, { message: followResultMessage }));
};

const followList = async (req, res) => {
    const myIdx = req.verifiedToken.userIdx;
    const { userIdx, option } = req.query;

    const followListResult = await UserService.followList(myIdx, userIdx, option);
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, followListResult));
};

const deleteFollower = async (req, res) => {
    const myIdx = req.verifiedToken.userIdx;
    const deleteUserIdx = parseInt(req.headers.useridx);

    const deleteFollowerIdx = await UserService.deleteFollower(myIdx, deleteUserIdx);
    return res
        .status(httpStatus.OK)
        .json(response(responseMessage.SUCCESS, { deletedUserIdx: deleteFollowerIdx }));
};

const getProfile = async (req, res) => {
    const myIdx = req.verifiedToken.userIdx;
    const userIdx = req.query.userIdx;

    const getProfileResult = await UserService.getProfile(myIdx, userIdx);
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, getProfileResult));
};

const getMyPage = async (req, res) => {
    const userIdx = req.verifiedToken.userIdx;
    const option = req.query.option ?? 'mytrip';
    const page = parseInt(req.query.page) || 1; // 페이지 번호
    const contentSize = parseInt(req.query.contentSize) || 15; // 페이지에서 보여줄 컨텐츠 수.

    const getMyPageResult = await UserService.getMyPage(userIdx, option, page, contentSize);
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, getMyPageResult));
};

const updateMyPage = async (req, res) => {
    const userIdx = req.verifiedToken.userIdx;
    const profileImgUrl = req.body.profileImgUrl ?? null;
    const nickname = req.body.nickname;

    await UserService.updageMyPage(userIdx, profileImgUrl, nickname);
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS));
};

const createReport = async (req, res) => {
    const userIdx = req.verifiedToken.userIdx;
    const travelIdx = parseInt(req.body.travelIdx);
    const travelCommentIdx = parseInt(req.body.travelCommentIdx) ?? null;
    const { reportType, reportSubject, reportContent } = req.body;
    const reportImages = req.body.reportImages ?? [];

    const createReportResult = await UserService.createReport(
        userIdx,
        travelIdx,
        travelCommentIdx,
        reportType,
        reportSubject,
        reportContent,
        reportImages
    );
    return res
        .status(httpStatus.CREATED)
        .json(response(responseMessage.SUCCESS, { newReportIdx: createReportResult }));
};

const getReportTypes = async (req, res) => {
    const getReportTypesResult = await UserService.getReportTypes();
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, getReportTypesResult));
};

module.exports = {
    follow,
    followList,
    deleteFollower,
    getProfile,
    getMyPage,
    updateMyPage,
    createReport,
    getReportTypes
};
