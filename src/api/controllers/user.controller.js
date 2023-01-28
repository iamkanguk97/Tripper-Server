const httpStatus = require('http-status');
const UserService = require('../services/user.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response } = require('../../config/response/response-template');

const follow = async (req, res) => {
    const followUserIdx = req.body.followUserIdx;
    const myIdx = req.verifiedToken.userIdx;
    
    const followResultMessage = await UserService.follow(myIdx, followUserIdx);
    return res.status(httpStatus.OK).send(response(responseMessage.SUCCESS, { message: followResultMessage }));
};

module.exports = {
    follow,
};