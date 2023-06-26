const moment = require('moment');
const _ = require('lodash');
const Logger = require('../../../../config/logger');
const responseMessage = require('../../../../config/response/baseResponseStatus');
const { validationErrorResponse } = require('../../../../config/response/response-template');
const { getBetweenDates } = require('../../../utils/util');

/**
 * @title 여행 게시물 날짜 확인 Validation Function
 * @param value
 * - @Body travelStartDate, travelEndDate
 */
const checkTravelDate = async value => {
    try {
        const today = moment(); // 오늘 날짜
        const travelDate = moment(value); // 여행 게시물 날짜

        if (today < travelDate) return Promise.reject(responseMessage.CREATE_TRAVEL_DATE_MORE_THAN_TODAY);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

/**
 * @title 여행 게시물 날짜 정보의 키 확인 (startDate와 endDate 사이의 날짜들로 이루어져 있는지)
 * @param value
 * - @Body day 객체내의 정보들
 * @param req
 */
const checkTravelDayKeys = async (value, { req }) => {
    try {
        const startDate = req.body.travelInformation.travelStartDate;
        const endDate = req.body.travelInformation.travelEndDate;
        const betweenDates = getBetweenDates(startDate, endDate); // 여행 시작날짜와 종료날짜 사이의 날짜들
        const requestDates = Object.keys(value); // 요청으로 들어온 day 객체의 날짜들

        const checkResult = _.isEqual(betweenDates, requestDates);
        if (!checkResult) return Promise.reject(responseMessage.CREATE_TRAVEL_DAY_KEYS_ERROR);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

module.exports = {
    checkTravelDate,
    checkTravelDayKeys
};
