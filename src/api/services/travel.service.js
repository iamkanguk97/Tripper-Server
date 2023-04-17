const { Op } = require('sequelize');
const Travel = require('../models/Travel/Travel');
const TravelScore = require('../models/Travel/TravelScore');
const TravelLike = require('../models/Travel/TravelLike');
const { sequelize, TravelDayArea } = require('../models');
const { getTravelTrans } = require('../utils/util');
const TravelThumImage = require('../models/Travel/TravelThumImage');
const TravelDay = require('../models/Travel/TravelDay');
const TravelDayAreaImage = require('../models/Travel/TravelDayAreaImage');

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

const createTravel = async (userIdx, travelInformation, day) => {
    const travelThumImages = travelInformation.travelThumnailImages;
    let transaction;
    let newTravelIdx;

    try {
        // BEGIN TRANSACTION
        transaction = await sequelize.transaction();

        // TRAVEL 테이블에 INSERT -> newTravelIdx 가져옴
        newTravelIdx = (
            await Travel.create(
                {
                    USER_IDX: userIdx,
                    TRAVEL_START_DATE: travelInformation.travelStartDate,
                    TRAVEL_END_DATE: travelInformation.travelEndDate,
                    TRAVEL_MOVE_METHOD: getTravelTrans(travelInformation.moveMethod),
                    TRAVEL_TITLE: travelInformation.travelTitle,
                    TRAVEL_HASHTAG: travelInformation.travelHashtag ?? null,
                    TRAVEL_INTRO: travelInformation.travelIntroduce ?? null
                },
                { transaction }
            )
        ).dataValues.IDX;

        // TRAVEL 썸네일 이미지 INSERT
        await Promise.all(
            travelThumImages.map(async img => {
                await TravelThumImage.create(
                    {
                        TRAVEL_IDX: newTravelIdx,
                        TRAVEL_IMAGE_URL: img
                    },
                    { transaction }
                );
            })
        );

        await Promise.all(
            Object.keys(day).map(async date => {
                // TRAVEL_DAY INSERT
                const newTravelDayIdx = (
                    await TravelDay.create(
                        {
                            TRAVEL_IDX: newTravelIdx,
                            TRAVEL_DAY_DATE: date
                        },
                        { transaction }
                    )
                ).dataValues.IDX;

                day[date].newTravelDayIdx = newTravelDayIdx;
                const dayDateArea = day[date].area;

                if (dayDateArea) {
                    await Promise.all(
                        dayDateArea.map(async area => {
                            // TRAVEL_DAY_AREA INSERT
                            const newTravelDayAreaIdx = (
                                await TravelDayArea.create(
                                    {
                                        TRAVEL_DAY_IDX: day[date].newTravelDayIdx,
                                        AREA_NAME: area.name ?? null,
                                        AREA_ADDRESS: area.address,
                                        AREA_CATEGORY: area.category ?? null,
                                        AREA_LATITUDE: area.latitude,
                                        AREA_LONGITUDE: area.longitude,
                                        AREA_REVIEW: area.review.comment ?? null
                                    },
                                    { transaction }
                                )
                            ).dataValues.IDX;

                            await Promise.all(
                                // TRAVEL_DAY_AREA_IMAGE INSERT
                                area.review.images.map(async img => {
                                    await TravelDayAreaImage.create(
                                        {
                                            TRAVEL_DAY_AREA_IDX: newTravelDayAreaIdx,
                                            TRAVEL_DAY_AREA_IMAGE_URL: img
                                        },
                                        { transaction }
                                    );
                                })
                            );
                        })
                    );
                }
            })
        );

        // COMMIT
        await transaction.commit();

        return {
            newTravelIdx
        };
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }
};

const deleteTravel = async (userIdx, travelIdx) => {
    const deleteTravelResult = (
        await Travel.update(
            {
                TRAVEL_STATUS: 'C' // 삭제 처리
            },
            {
                where: {
                    IDX: travelIdx,
                    USER_IDX: userIdx
                }
            }
        )
    )[0];

    if (!deleteTravelResult)
        // 변경사항 없거나 잘못된 문법 사용?
        throw new Error('[Travel->deleteTravel] 변경사항이 없거나 잘못된 문법 사용');

    return travelIdx;
};

module.exports = {
    updateTravelStatus,
    createTravelReviewScore,
    createTravelLike,
    createTravel,
    deleteTravel
};
