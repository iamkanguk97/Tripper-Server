'use strict';
const Travel = require('../models/Travel/Travel');
const { Op } = require('sequelize');

const updateTravelStatus = async (userIdx, travelIdx, travelStatus) => {
    const _newTravelStatus = travelStatus === 'A' ? 'B' : 'A';
    
    // 공개에서 비공개 또는 비공개에서 공개로 전환
    // 여기서는 에러 발생해도 throw가 아닌 0을 return 한다.
    const updateTravelStatusResult = (await Travel.update({
        TRAVEL_STATUS: _newTravelStatus
    }, {
        where: {
            [Op.and]: [
                { IDX: travelIdx },
                { USER_IDX: userIdx }
            ]
        }
    }))[0];

    if (!updateTravelStatusResult)   // 변경사항 없거나 잘못된 문법 사용?
        throw new Error('[Travel->updateTravelStatus] 변경사항이 없거나 잘못된 문법 사용');
    else
        return {
            travelIdx, 
            newTravelStatus: _newTravelStatus
        };
};

module.exports = {
    updateTravelStatus
};