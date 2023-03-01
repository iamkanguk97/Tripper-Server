'use strict';
const Travel = require('../models/Travel/Travel');
const { Op } = require('sequelize');

const updateTravelStatus = async (userIdx, travelIdx, travelStatus) => {
    const _newTravelStatus = travelStatus === 'A' ? 'B' : 'A';
    
    // 공개에서 비공개 또는 비공개에서 공개로 전환
    const updateTravelStatusResult = (await Travel.update({
        TRAVEL_STATUS: _newTravelStatus
    }, {
        where: {
            [Op.and]: [
                { IDX: travelIdx },
                { USER_IDX: userIdx }
                // { USER_IDX: 15 }
            ]
        }
    }))[0];

    return !updateTravelStatusResult 
            ? { updateTravelStatusResult } 
            : { updateTravelStatusResult, result: { travelIdx, newTravelStatus: _newTravelStatus } };
};

module.exports = {
    updateTravelStatus
};