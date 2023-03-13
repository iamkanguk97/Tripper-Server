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
        .json(response(responseMessage.SUCCESS, { deleteUserIdx: deleteFollowerIdx }));
};

module.exports = {
    follow,
    followList,
    deleteFollower
};
