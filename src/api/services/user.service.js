const { Op, QueryTypes } = require('sequelize');
const UserFollow = require('../models/User/UserFollow');
const { sequelize } = require('../models/index');

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
    let query = '';

    // TODO: 추후 클라이언트랑 협의해서 페이징 적용필요

    if (!userIdx) {
        // 상대방 고유값이 없음 -> 본인의 팔로잉 또는 팔로워 조회
        if (option === 'following') {
            // 팔로잉 조회
            query = `
                SELECT UF.FOLLOW_TARGET_IDX AS followingUserIdx,
                       U.USER_NICKNAME AS followingUserNick,
                       U.USER_PROFILE_IMAGE AS followingUserProfileImage,
                       'Y' AS isFollowing
                FROM USER_FOLLOW AS UF
                    INNER JOIN USER AS U
                    ON U.IDX = UF.FOLLOW_TARGET_IDX
                WHERE USER_IDX = :myIdx
                      AND U.USER_STATUS != 'D';
            `;
        } else if (option === 'follower') {
            // 팔로워 조회
            query = `
                SELECT T.USER_IDX AS followerIdx,
                       T.USER_NICKNAME AS followerNick,
                       T.USER_PROFILE_IMAGE AS followerProfileImage,
                       IF(UF2.IDX IS NOT NULL, 'Y', 'N') AS isFollowing
                FROM (
                    SELECT UF.USER_IDX,
                            U.USER_NICKNAME,
                            U.USER_PROFILE_IMAGE
                    FROM USER_FOLLOW AS UF
                        INNER JOIN USER AS U
                        ON UF.USER_IDX = U.IDX
                    WHERE UF.FOLLOW_TARGET_IDX = :myIdx
                        AND U.USER_STATUS != 'D'
                ) AS T
                    LEFT JOIN USER_FOLLOW AS UF2
                    ON UF2.FOLLOW_TARGET_IDX = T.USER_IDX AND UF2.USER_IDX = :myIdx;
            `;
        }
    } else {
        // 상대방 고유값이 있음 -> 상대방의 팔로잉 또는 팔로워 조회
        // TODO: 쿼리가 반복되는 부분이 많기때문에 조건식으로 string 조합해도 괜찮을듯?
        if (option === 'following') {
            query = `
                SELECT T.FOLLOW_TARGET_IDX AS followingUserIdx,
                        T.USER_NICKNAME AS followingUserNick,
                        T.USER_PROFILE_IMAGE AS followingUserProfileImage,
                        CASE
                            WHEN ISNULL(T2.IDX) = 1 AND T.FOLLOW_TARGET_IDX = :myIdx THEN 'M'
                            WHEN ISNULL(T2.IDX) = 1 AND T.FOLLOW_TARGET_IDX != :myIdx THEN 'N'
                            ELSE 'Y'
                        END AS 'isFollowing'
                FROM (
                    SELECT UF.FOLLOW_TARGET_IDX,
                            U.USER_NICKNAME,
                            U.USER_PROFILE_IMAGE
                    FROM USER_FOLLOW AS UF
                        INNER JOIN USER AS U
                        ON UF.FOLLOW_TARGET_IDX = U.IDX
                    WHERE UF.USER_IDX = :userIdx
                ) AS T
                    LEFT JOIN (
                        SELECT UF2.IDX,
                            UF2.FOLLOW_TARGET_IDX
                        FROM USER_FOLLOW AS UF2
                        WHERE UF2.USER_IDX = :myIdx
                    ) AS T2 ON T.FOLLOW_TARGET_IDX = T2.FOLLOW_TARGET_IDX;
            `;
        } else if (option === 'follower') {
            query = `
                SELECT T.USER_IDX,
                        T.USER_NICKNAME,
                        T.USER_PROFILE_IMAGE,
                        CASE
                            WHEN ISNULL(T2.IDX) = 1 AND T.USER_IDX = :myIdx THEN 'M'
                            WHEN ISNULL(T2.IDX) = 1 AND T.USER_IDX != :myIdx THEN 'N'
                            ELSE 'Y'
                        END AS 'isFollowing'
                FROM (
                    SELECT UF.USER_IDX,
                            U.USER_NICKNAME,
                            U.USER_PROFILE_IMAGE
                    FROM USER_FOLLOW AS UF
                        INNER JOIN USER AS U
                        ON U.IDX = UF.USER_IDX
                    WHERE UF.FOLLOW_TARGET_IDX = :userIdx
                ) AS T
                    LEFT JOIN (
                        SELECT UF2.IDX,
                                UF2.FOLLOW_TARGET_IDX
                        FROM USER_FOLLOW AS UF2
                        WHERE UF2.USER_IDX = :myIdx
                    ) AS T2 ON T.USER_IDX = T2.FOLLOW_TARGET_IDX;
            `;
        }
    }

    listResult = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
            myIdx: 11,
            userIdx: 16
            // myIdx: myIdx
            // userIdx: userIdx
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

module.exports = {
    follow,
    followList,
    deleteFollower
};
