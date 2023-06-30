const moment = require('moment');
const _ = require('lodash');
const { Op } = require('sequelize');
const Logger = require('../../../../config/logger');
const responseMessage = require('../../../../config/response/baseResponseStatus');
const Travel = require('../../../models/Travel/Travel');
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

// 게시물 고유값을 통해 유효한 게시물인지 확인 + 본인 게시물 허용 관련
const checkTravelStatusAble = async (value, { req }) => {
    try {
        const travel = await Travel.findOne({
            attributes: ['IDX', 'USER_IDX', 'TRAVEL_STATUS'],
            where: {
                IDX: value,
                TRAVEL_STATUS: {
                    [Op.ne]: 'C'
                }
            }
        }); // 해당 고유값으로 게시물 있는지 확인

        // travel이 null이면 해당 게시물이 존재하지 않는 것 -> 에러 발생
        if (!travel) return Promise.reject(responseMessage.TRAVEL_NOT_EXIST);

        const isTravelWriterIsMe = travel.dataValues.USER_IDX === req.verifiedToken.userIdx;
        const travelStatus = travel.dataValues.TRAVEL_STATUS;

        /**
         * 본인 게시물일 경우 -> travelStatus가 'A'와 'B'이면 모두 가능 => 검사 필요 X
         * 본인 게시물이 아닐 경우 -> travelStatus가 only 'A'일 경우만 가능
         */
        if (!isTravelWriterIsMe && travelStatus !== 'A')
            // 본인게시물이 아니고 A가 아닐 경우 -> 에러 발생
            return Promise.reject(responseMessage.TRAVEL_CANT_ACCESS);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

module.exports = {
    checkTravelDate,
    checkTravelDayKeys,
    checkTravelStatusAble
};
