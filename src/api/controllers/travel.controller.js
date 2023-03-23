const httpStatus = require('http-status');
const TravelService = require('../services/travel.service');
const { response } = require('../../config/response/response-template');
const responseMessage = require('../../config/response/baseResponseStatus');

const createTravel = async (req, res) => {
    const userIdx = req.verifiedToken.userIdx;
    const imgFiles = req.files; // 게시물 생성에 필요한 이미지 파일들
    const request = JSON.parse(req.body.request); // 나머지 string data들

    const createTravelResult = await TravelService.createTravel(userIdx, request, imgFiles);
    return res.status(httpStatus.CREATED).json(createTravelResult);
};

const deleteTravel = async (req, res) => {};

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
    return res
        .status(httpStatus.OK)
        .json(response(responseMessage.SUCCESS, { message: createTravelReviewScoreResult }));
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
    deleteTravel,
    updateTravelStatus,
    createTravelReviewScore,
    createTravelLike
};
