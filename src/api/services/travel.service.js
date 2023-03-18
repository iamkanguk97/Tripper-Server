const { Op } = require('sequelize');
const Travel = require('../models/Travel/Travel');
const TravelScore = require('../models/Travel/TravelScore');
const TravelLike = require('../models/Travel/TravelLike');
const { getTravelTrans } = require('../utils/util');
// const TravelThum = require('../models/Travel/TravelThumImage');
// const TravelHashtag = require('../models/Travel/TravelHashtag');

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

    if (checkUserScoreExist === 'N') {
        // 점수를 한번도 부여한적 없음
        await TravelScore.create({
            TRAVEL_IDX: travelIdx,
            USER_IDX: userIdx,
            TRAVEL_SCORE: reviewScore
        });
    } else {
        // 점수를 이전에 부여했음
        await TravelScore.update({ TRAVEL_SCORE: reviewScore }, { where: whereOption });
    }

    return `게시물 점수 ${reviewScore}점 부여 성공!`;
};

const createTravelLike = async (userIdx, travelIdx) => {
    /** <Logic>
     * 1. 사용자가 해당 게시물을 좋아요 하고 있는지 안하고 있는지 확인
     * 2. 1번에서 나온 상태에 따라서 처리 (생성 또는 삭제)
     */
    const option = {
        USER_IDX: userIdx,
        TRAVEL_IDX: travelIdx
    };

    const isUserLike = !(await TravelLike.findOne({ where: option })) ? 'N' : 'Y';

    let rm = '';
    if (isUserLike === 'N') {
        // 좋아요를 안누른 상태 -> create
        await TravelLike.create(option);
        rm = '게시글 좋아요 활성화 성공';
    } else {
        // 좋아요 누른 상태 -> delete
        await TravelLike.destroy({ where: option });
        rm = '게시글 좋아요 비활성화 성공';
    }

    return rm;
};

const createTravel = async (userIdx, request, imgFiles) => {
    // 1. travel_data + travelThumImage 부분 DB에 insert
    // 2. day_data 부분 DB에 insert
    // 3. 1번과 2번 모두 Promise.all로 성능개선
    console.log(request);
    console.log(imgFiles);
    const travelData = request.travel_data;
    const travelThumImage = imgFiles.travelThumImage;

    // TRAVEL 테이블에 Data INSERT + 새로운 TRAVEL_IDX Return
    const newTravelIdx = (
        await Travel.create({
            USER_IDX: userIdx,
            TRAVEL_TITLE: travelData.travelTitle,
            TRAVEL_INTRO: travelData.travelIntroduce,
            TRAVEL_START_DATE: travelData.travelStartDate,
            TRAVEL_END_DATE: travelData.travelEndDate,
            TRAVEL_MOVE_METHOD: getTravelTrans(travelData.travelTransportation)
        })
    ).dataValues.IDX;

    // TRAVEL_THUMNAIL_IMAGE 테이블
    // 썸네일 이미지는 최대 5장으로 업로드 가능하기 때문에 forEach를 사용해도 성능에 크게 문제가 안될거 같다.
    travelThumImage.forEach(img => {
        const imgKey = `travel_${newTravelIdx}_thum_${img.md5}`;
    });

    // const travelHashtagInsertResult = await TravelHashtag.create();
};

module.exports = {
    updateTravelStatus,
    createTravelReviewScore,
    createTravelLike,
    createTravel
};
