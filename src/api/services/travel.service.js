const { Op } = require('sequelize');
const Travel = require('../models/Travel/Travel');
const TravelScore = require('../models/Travel/TravelScore');

const updateTravelStatus = async (userIdx, travelIdx, travelStatus) => {
    const _newTravelStatus = travelStatus === 'A' ? 'B' : 'A';

    // 공개에서 비공개 또는 비공개에서 공개로 전환
    // 여기서는 에러 발생해도 throw가 아닌 0을 return 한다.
    const updateTravelStatusResult = (
        await Travel.update(
            {
                TRAVEL_STATUS: _newTravelStatus
            },
            {
                where: {
                    [Op.and]: [{ IDX: travelIdx }, { USER_IDX: userIdx }]
                }
            }
        )
    )[0];

    if (!updateTravelStatusResult)
        // 변경사항 없거나 잘못된 문법 사용?
        throw new Error('[Travel->updateTravelStatus] 변경사항이 없거나 잘못된 문법 사용');
    else
        return {
            travelIdx,
            newTravelStatus: _newTravelStatus
        };
};

const createTravelReviewScore = async (userIdx, travelIdx, reviewScore) => {
    /** <Logic>
     * 유저가 전에 점수를 부여한적이 있음 -> update
     * 점수를 부여한적이 없음 -> create
     */
    const whereOption = {
        TRAVEL_IDX: travelIdx,
        USER_IDX: userIdx
    };

    const checkUserScoreExist = !(await TravelScore.findOne({ where: whereOption })) ? 'N' : 'Y'; // DB에서 찾아서 null이면 N 아니면 Y

    let result = null;
    if (checkUserScoreExist === 'N') {
        // 점수를 한번도 부여한적 없음
        result = await TravelScore.create({
            TRAVEL_IDX: travelIdx,
            USER_IDX: userIdx,
            TRAVEL_SCORE: reviewScore
        });
        console.log(result);
    } else {
        // 점수를 이전에 부여했음
        result = await TravelScore.update({ TRAVEL_SCORE: reviewScore }, { where: whereOption });
        console.log(result);
    }
};

const createTravelLike = async (userIdx, travelIdx) => {};

module.exports = {
    updateTravelStatus,
    createTravelReviewScore,
    createTravelLike
};
