const httpStatus = require('http-status');
const TravelService = require('../services/travel.service');
const { response } = require('../../config/response/response-template');
const responseMessage = require('../../config/response/baseResponseStatus');

const createTravel = async (req, res) => {
    const userIdx = req.verifiedToken.userIdx;
    const { travelInformation, day } = req.body;

    const createTravelResult = await TravelService.createTravel(userIdx, travelInformation, day);
    return res
        .status(httpStatus.CREATED)
        .json(response(responseMessage.CREATE_SUCCESS, createTravelResult));
};

const deleteTravel = async (req, res) => {
    const userIdx = req.verifiedToken.userIdx;
    const travelIdx = req.body.travelIdx;

    const deleteTravelResult = await TravelService.deleteTravel(userIdx, travelIdx);
    return res
        .status(httpStatus.OK)
        .json(response(responseMessage.SUCCESS, { deletedTravelIdx: deleteTravelResult }));
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

const createTravelComment = async (req, res) => {};

const getTravelComments = async (req, res) => {};

module.exports = {
    createTravel,
    deleteTravel,
    updateTravelStatus,
    createTravelReviewScore,
    createTravelLike,
    createTravelComment,
    getTravelComments
};
