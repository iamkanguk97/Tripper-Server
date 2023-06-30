const { errResponse } = require('../../config/response/response-template');
const HomeService = require('../services/home.service');
const { setUserIdxByToken } = require('../utils/util');
const responseMessage = require('../../config/response/baseResponseStatus');

const getHome = async (req, res) => {
    const option = req.query.option ?? 'latest';
    const userAuth = req.headers.authorization;
    const userIdx = setUserIdxByToken(userAuth);

    // middleware에서 처리하기 조금 비효율적인거 같아서 controller에서 처리하장
    // option이 follow인데 비회원이면 조회 불가능
    if (option === 'follow' && userIdx === 0) {
        return res.send(errResponse(responseMessage.NON_MEMBER_CANT_FOLLOW_OPTION));
    }

    const getHomeResult = await HomeService.getHome(userIdx, option);
    return res.send(getHomeResult);
};

// const getUserAlarms = async (req, res) => {};

module.exports = {
    getHome
    // getUserAlarms
};
