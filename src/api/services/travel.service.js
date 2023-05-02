const { Op, Sequelize, QueryTypes } = require('sequelize');
const Travel = require('../models/Travel/Travel');
const TravelScore = require('../models/Travel/TravelScore');
const TravelLike = require('../models/Travel/TravelLike');
const { sequelize } = require('../models/index');
const { getTravelTrans } = require('../utils/util');
const TravelThumImage = require('../models/Travel/TravelThumImage');
const TravelDay = require('../models/Travel/TravelDay');
const TravelDayArea = require('../models/Travel/TravelDayArea');
const TravelDayAreaImage = require('../models/Travel/TravelDayAreaImage');
const TravelComment = require('../models/Travel/TravelComment');
const TravelCommentMention = require('../models/Travel/TravelCommentMention');
const {
    selectParentCommentListQuery,
    selectChildCommentListQuery
} = require('../queries/travel.query');

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
            updatedTravelIdx: travelIdx,
            newTravelStatus: _newTravelStatus
        };
};

const createTravelReviewScore = async (userIdx, travelIdx, reviewScore, checkUserScoreExist) => {
    /** <Logic>
     * 유저가 전에 점수를 부여한적이 있음 -> update
     * 점수를 부여한적이 없음 -> create
     */
    const whereOption = {
        TRAVEL_IDX: travelIdx,
        USER_IDX: userIdx
    };

    if (checkUserScoreExist === 'N') {
        // 점수를 한번도 부여한적 없음
        await TravelScore.create({
            TRAVEL_IDX: travelIdx,
            USER_IDX: userIdx,
            TRAVEL_SCORE: reviewScore
        });
    } else {
        // 점수를 이전에 부여했음
        const updateTravelScoreResult = (
            await TravelScore.update({ TRAVEL_SCORE: reviewScore }, { where: whereOption })
        )[0];

        if (!updateTravelScoreResult)
            throw new Error('[Travel->updateTravelScore] 변경사항이 없거나 잘못된 문법 사용');
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

const createTravelComment = async (userIdx, travelIdx, commentIdx, comment, mentionUsers) => {
    let transaction;
    let newCommentIdx;

    try {
        // BEGIN TRANSACTION
        transaction = await sequelize.transaction();

        // (1) TRAVEL_COMMENT 테이블에 INSERT
        newCommentIdx = (
            await TravelComment.create(
                {
                    USER_IDX: userIdx,
                    TRAVEL_IDX: travelIdx,
                    SUPER_COMMENT_IDX: commentIdx,
                    COMMENT_TEXT: comment
                },
                { transaction }
            )
        ).dataValues.IDX;

        // (2) TRAVEL_COMMENT_MENTION 테이블에 INSERT
        if (mentionUsers.length) {
            await Promise.all(
                mentionUsers.map(async mu => {
                    await TravelCommentMention.create(
                        {
                            TRAVEL_COMMENT_IDX: newCommentIdx,
                            MENTION_USER_IDX: mu
                        },
                        { transaction }
                    );
                })
            );
        }

        // COMMIT
        await transaction.commit();
        return newCommentIdx;
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }
};

const deleteTravelComment = async (userIdx, commentIdx) => {
    let transaction;

    // 해당 댓글이 부모댓글이면 아래 자식댓글도 전부 삭제해야함.
    const checkIsParentComment = await TravelComment.findOne({
        attributes: ['IDX', 'USER_IDX', 'SUPER_COMMENT_IDX'],
        where: {
            IDX: commentIdx,
            USER_IDX: userIdx,
            STATUS: {
                [Op.ne]: 'D'
            }
        }
    });

    try {
        // BEGIN TRANSACTION
        transaction = await sequelize.transaction();

        // 해당 댓글이 부모댓글 -> 자식들 댓글 조회해서 DELETE 처리
        if (checkIsParentComment && !checkIsParentComment.dataValues.SUPER_COMMENT_IDX) {
            const childCommentRows = await TravelComment.findAll(
                {
                    where: {
                        SUPER_COMMENT_IDX: commentIdx,
                        STATUS: {
                            [Op.ne]: 'D'
                        }
                    }
                },
                { transaction }
            );
            if (childCommentRows.length) {
                await Promise.all(
                    childCommentRows.map(async comment => {
                        const updateChildCommentResult = (
                            await TravelComment.update(
                                {
                                    STATUS: 'D',
                                    UPDATED_AT: Sequelize.fn('NOW')
                                },
                                {
                                    where: {
                                        IDX: comment.dataValues.IDX
                                    }
                                },
                                { transaction }
                            )
                        )[0];

                        if (!updateChildCommentResult)
                            throw new Error(
                                '[Travel->updateChildComment] 변경사항이 없거나 잘못된 문법 사용'
                            );
                    })
                );
            }
        }

        const deleteTravelCommentResult = (
            await TravelComment.update(
                {
                    STATUS: 'D',
                    UPDATED_AT: Sequelize.fn('NOW')
                },
                {
                    where: {
                        IDX: commentIdx,
                        USER_IDX: userIdx
                    }
                }
            )
        )[0];

        if (!deleteTravelCommentResult)
            throw new Error('[Travel->deleteTravelComment] 변경사항이 없거나 잘못된 문법 사용');

        // COMMIT
        await transaction.commit();
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }
};

const getTravelComments = async (userIdx, travelIdx) => {
    let transaction;

    try {
        // BEGIN TRANSACTION
        transaction = await sequelize.transaction();

        // (1) 게시물 전체 댓글 수를 가져옴
        const totalCommentCount = await TravelComment.count(
            {
                where: {
                    TRAVEL_IDX: travelIdx,
                    STATUS: {
                        [Op.ne]: 'D'
                    }
                }
            },
            { transaction }
        );

        // (2) 부모 댓글 리스트 가져오기
        const commentList = await sequelize.query(
            selectParentCommentListQuery,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    travelIdx
                }
            },
            { transaction }
        );

        // (3) (2)에서 받아온 부모 댓글 리스트에서 각 부모댓글에 해당하는 자식 댓글 리스트 가져오기
        await Promise.all(
            commentList.map(async parentComment => {
                const childCommentList = await sequelize.query(selectChildCommentListQuery, {
                    type: QueryTypes.SELECT,
                    replacements: {
                        travelIdx,
                        superCommentIdx: parentComment.parentCommentIdx
                    }
                });
                parentComment.childComments = childCommentList;
            })
        );

        // COMMIT
        await transaction.commit();

        return {
            totalCommentCount,
            commentList
        };
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }
};

module.exports = {
    updateTravelStatus,
    createTravelReviewScore,
    createTravelLike,
    createTravel,
    deleteTravel,
    createTravelComment,
    deleteTravelComment,
    getTravelComments
};
