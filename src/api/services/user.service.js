const { Op, QueryTypes } = require('sequelize');
const UserFollow = require('../models/User/UserFollow');
const Travel = require('../models/Travel/Travel');
const { sequelize } = require('../models/index');
const {
    myFollowingQuery,
    myFollowerQuery,
    otherFollowingQuery,
    otherFollowerQuery,
    userInfoInMyPageQuery,
    myTripInMyPageQuery,
    travelLikeInMyPageQuery,
    getTravelCountInLikeQuery,
    userInfoInProfileQuery,
    userTravelInfoInProfileQuery
} = require('../queries/user.query');
const User = require('../models/User/User');
const Report = require('../models/Report/Report');
const ReportImage = require('../models/Report/ReportImage');
const ReportType = require('../models/Report/ReportType');

const follow = async (myIdx, followUserIdx) => {
    // ORM CRUD에 적용되는 옵션이 다 동일하기 때문에 하나의 변수로 빼놓음.
    const whereOption = {
        [Op.and]: [{ USER_IDX: myIdx }, { FOLLOW_TARGET_IDX: followUserIdx }]
    };

    // 본인과 팔로우 신청 받은 사람과 현재의 팔로우 관계를 DB에서 가져옴.
    let checkRelation = await UserFollow.findOne({
        attributes: ['IDX'],
        where: whereOption
    });
    checkRelation = !checkRelation ? 'N' : 'Y'; // NULL이면 'N' 처리

    /**
     * checkRelation === 'N'
     *  - 팔로우를 새로 생성하는 부분 (팔로우 요청)
     *  - INSERT를 통해 새로운 ROW 생성
     *
     * checkRelation === 'Y'
     *  - 팔로우 취소
     *  - DELETE? UPDATE? => DELETE 확정
     *      - STATUS로 값을 처리할까 했었는데 사실 불필요한 데이터기 때문에 물리적으로 삭제해도 괜찮을거 같음.
     */
    let rm = '';
    if (checkRelation === 'N') {
        await UserFollow.create({
            USER_IDX: myIdx,
            FOLLOW_TARGET_IDX: followUserIdx
        });
        rm = '팔로우 요청 성공';
    } else {
        await UserFollow.destroy({ where: whereOption });
        rm = '팔로우 취소 성공';
    }

    return rm;
};

const followList = async (myIdx, userIdx, option) => {
    let listResult = null;
    let query = null;

    // TODO: 추후 클라이언트랑 협의해서 페이징 적용필요

    if (!userIdx) {
        // 상대방 고유값이 없음 -> 본인의 팔로잉 또는 팔로워 조회
        query = option === 'following' ? myFollowingQuery : myFollowerQuery;
    } else {
        // 상대방 고유값이 있음 -> 상대방의 팔로잉 또는 팔로워 조회
        query = option === 'following' ? otherFollowingQuery : otherFollowerQuery;
    }

    listResult = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
            myIdx,
            userIdx
        }
    });

    return listResult;
};

const deleteFollower = async (myIdx, userIdx) => {
    const deleteFollowerResult = await UserFollow.destroy({
        where: {
            [Op.and]: [{ USER_IDX: userIdx }, { FOLLOW_TARGET_IDX: myIdx }]
        }
    });

    if (!deleteFollowerResult)
        // 삭제된 데이터가 없거나 잘못된 문법 사용?
        throw new Error('[User->deleteFollower] 삭제된 데이터가 없거나 잘못된 문법 사용!');
    else return userIdx;
};

const getMyPage = async (userIdx, option, page, contentSize) => {
    let transaction;
    let travelCount;

    // mytrip일 때와 like일 때와 totalCount 분리
    if (option === 'mytrip') {
        travelCount = await Travel.count({
            where: {
                USER_IDX: userIdx,
                [Op.not]: { TRAVEL_STATUS: 'C' }
            }
        });
    } else {
        travelCount = (
            await sequelize.query(getTravelCountInLikeQuery, {
                type: QueryTypes.SELECT,
                replacements: {
                    userIdx
                }
            })
        )[0].travelLikeCount;
    }

    const skipSize = (page - 1) * contentSize; // 다음 페이지 갈 때 건너뛸 리스트 개수.
    const pnTotal = Math.ceil(travelCount / contentSize); // 페이지네이션의 전체 카운트

    try {
        // BEGIN TRANSACTION
        transaction = await sequelize.transaction();

        // 프로필사진, 닉네임, 팔로잉 및 팔로워 수 조회
        const selectUserInfo = await sequelize.query(
            userInfoInMyPageQuery,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    userIdx
                }
            },
            { transaction }
        );

        // 내 게시물 또는 내가 좋아요 누른 게시물
        const selectUserTravels = await sequelize.query(
            option === 'mytrip' ? myTripInMyPageQuery : travelLikeInMyPageQuery,
            {
                type: QueryTypes.SELECT,
                replacements: {
                    userIdx,
                    offset: skipSize,
                    contentSize
                }
            },
            { transaction }
        );

        await transaction.commit();

        return {
            currentPage: page,
            totalPage: pnTotal,
            userInfo: selectUserInfo[0],
            userTravels: selectUserTravels
        };
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }
};

const updageMyPage = async (userIdx, profileImgUrl, nickname) => {
    const updateMyPageResult = (
        await User.update(
            {
                USER_NICKNAME: nickname,
                USER_PROFILE_IMAGE: profileImgUrl
            },
            {
                where: {
                    IDX: userIdx
                }
            }
        )
    )[0];

    if (!updateMyPageResult)
        throw new Error('[User->updateMyPage] 변경사항이 없거나 잘못된 문법 사용');
};

const getProfile = async (myIdx, userIdx) => {
    let transaction;
    let userInfo = {};
    let userTravelInfo = [];

    try {
        // BEGIN TRANSACTION
        transaction = await sequelize.transaction();

        // (1) 상대방 프로필 상단 조회 (기본 정보)
        userInfo = (
            await sequelize.query(userInfoInProfileQuery, {
                type: QueryTypes.SELECT,
                replacements: {
                    userIdx: myIdx,
                    targetIdx: userIdx
                }
            })
        )[0];

        // (2) 상대방 프로필 하단 조회 (게시물 정보)
        userTravelInfo = await sequelize.query(userTravelInfoInProfileQuery, {
            type: QueryTypes.SELECT,
            replacements: {
                userIdx: myIdx,
                targetIdx: userIdx
            }
        });

        // COMMIT
        await transaction.commit();

        return {
            userInfo,
            userTravelInfo
        };
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }
};

const createReport = async (
    userIdx,
    travelIdx,
    travelCommentIdx,
    reportType,
    reportSubject,
    reportContent,
    reportImages
) => {
    let transaction;
    let newReportIdx;

    try {
        // START TRANSACTION
        transaction = await sequelize.transaction();

        // (1) REPORT 테이블에 INSERT
        newReportIdx = (
            await Report.create(
                {
                    USER_IDX: userIdx,
                    REPORTED_TRAVEL_IDX: travelIdx,
                    REPORTED_COMMENT_IDX: travelCommentIdx,
                    REPORT_TYPE: reportType,
                    REPORT_SUBJECT: reportSubject,
                    REPORT_CONTENT: reportContent
                },
                { transaction }
            )
        ).dataValues.IDX;

        // (2) REPORT_IMAGE 테이블에 INSERT
        if (reportImages.length) {
            await Promise.all(
                reportImages.map(async img => {
                    await ReportImage.create({
                        REPORT_IDX: newReportIdx,
                        REPORT_IMAGE_URL: img
                    });
                })
            );
        }

        // COMMIT
        await transaction.commit();
        return newReportIdx;
    } catch (err) {
        if (transaction) await transaction.rollback();
        throw new Error(err);
    }
};

const getReportTypes = async () => {
    const getReportTypesResult = await ReportType.findAll({
        attributes: ['IDX', 'REPORT_TYPE_NAME'],
        where: {
            STATUS: 'A'
        },
        raw: true
    });

    return getReportTypesResult;
};

module.exports = {
    follow,
    followList,
    deleteFollower,
    getMyPage,
    updageMyPage,
    getProfile,
    createReport,
    getReportTypes
};
