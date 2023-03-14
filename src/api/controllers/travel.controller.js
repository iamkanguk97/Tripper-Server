const httpStatus = require('http-status');
const TravelService = require('../services/travel.service');
const { response } = require('../../config/response/response-template');
const responseMessage = require('../../config/response/baseResponseStatus');

const createTravel = async (req, res) => {
    // 여행 시작일자와 종료일자
    // 여행 이동수단
    // 여행 제목
    // 해시태그 (선택)
    // 썸네일 사진 (최대 5장)
    // 여행 소개
    const { userIdx } = req.verifiedToken;
};

const updateTravelStatus = async (req, res) => {
    const { userIdx } = req.verifiedToken;
    const travelIdx = parseInt(req.params.travelIdx);
    const { travelStatus } = req;

    const updateTravelStatusResult = await TravelService.updateTravelStatus(
        userIdx,
        travelIdx,
        travelStatus
    );
    return res
        .status(httpStatus.OK)
        .json(response(responseMessage.SUCCESS, updateTravelStatusResult));
};

const createTravelReviewScore = async (req, res) => {
    const userIdx = req.verifiedToken.userIdx;
    const { travelIdx, reviewScore } = req.body;

    const createTravelReviewScoreResult = await TravelService.createTravelReviewScore(
        userIdx,
        travelIdx,
        reviewScore
    );
    return res.status(httpStatus.OK).json(createTravelReviewScoreResult);
};

const createTravelLike = async (req, res) => {
    const userIdx = req.verifiedToken.userIdx;
    const travelIdx = req.body.travelIdx;

    const createTravelLikeResult = await TravelService.createTravelLike(userIdx, travelIdx);
    return res
        .status(httpStatus.OK)
        .json(response(responseMessage.SUCCESS, { message: createTravelLikeResult }));
};

module.exports = {
    createTravel,
    updateTravelStatus,
    createTravelReviewScore,
    createTravelLike
};
