'use strict';
const httpStatus = require('http-status');
const CommonService = require('../services/common.service');
const responseMessage = require('../../config/response/baseResponseStatus');
const { response } = require('../../config/response/response-template');

const searchArea = async (req, res) => {
    const area = req.query.area;
    const page_number = req.query.page ? parseInt(req.query.page) : 1;
    const latitude = req.query.lat; // 클라이언트의 현재 위도
    const longitude = req.query.lon; // 클라이언트의 현재 경도

    const searchAreaResult = await CommonService.searchArea(area, page_number, latitude, longitude);
    if (searchAreaResult.code === 3015)
        return res.status(httpStatus.BAD_REQUEST).json(searchAreaResult);
    return res.status(httpStatus.OK).json(response(responseMessage.SUCCESS, searchAreaResult));
};

module.exports = {
    searchArea
};
