'use strict';
const httpStatus = require('http-status');
const TravelService = require('../services/travel.service');
const { response, errResponse } = require('../../config/response/response-template');
const responseMessage = require('../../config/response/baseResponseStatus');

const createTravel = async (req, res) => {
    // 여행 시작일자와 종료일자
    // 여행 이동수단
    // 여행 제목
    // 해시태그 (선택)
    // 썸네일 사진 (최대 5장)
    // 여행 소개
};

const updateTravelStatus = async (req, res) => {
    const userIdx = req.verifiedToken.userIdx;
    const travelIdx = parseInt(req.params.travelIdx);
    const travelStatus = req.travelStatus;
    
    const updateTravelStatusResult = await TravelService.updateTravelStatus(userIdx, travelIdx, travelStatus);
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, updateTravelStatusResult ));
};

module.exports = {
    createTravel,
    updateTravelStatus
};