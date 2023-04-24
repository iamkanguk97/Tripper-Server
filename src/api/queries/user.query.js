const myFollowingQuery = `
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

const myFollowerQuery = `
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

const otherFollowingQuery = `
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

const otherFollowerQuery = `
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

const userInfoInMyPageQuery = `
    SELECT IDX,
            USER_PROFILE_IMAGE,
            USER_NICKNAME,
            (SELECT COUNT(FOLLOW_TARGET_IDX)
                FROM USER_FOLLOW AS UF
                    INNER JOIN USER AS U ON UF.FOLLOW_TARGET_IDX = U.IDX
                WHERE USER_IDX = :userIdx
                    AND U.USER_STATUS = 'A') AS followingCount,
                (SELECT COUNT(USER_IDX)
                FROM USER_FOLLOW AS UF
                    INNER JOIN USER AS U ON UF.USER_IDX = U.IDX
                WHERE FOLLOW_TARGET_IDX = :userIdx
                    AND U.USER_STATUS = 'A') AS followerCount
        FROM USER AS U
        WHERE U.IDX = :userIdx AND U.USER_STATUS = 'A';
`;

const myTripInMyPageQuery = `
    SELECT T.IDX AS travelIdx,
            T.USER_IDX AS travelWriterIdx,
            TRAVEL_TITLE AS travelTitle,
            TRAVEL_INTRO AS travelIntro,
            TRAVEL_HASHTAG AS travelHashtag,
            TTL.TRAVEL_IMAGE_URL AS travelRepImage,
            CASE WHEN TRAVEL_STATUS = 'A' THEN '공개' ELSE '비공개' END AS travelStatus,
            (
                SELECT
                    CASE
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 5 THEN '최고의 여행!'
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 4 THEN '도움되었어요!'
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 3 THEN '그저 그래요'
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 2 THEN '도움되지 않았어요'
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 1 THEN '별로에요'
                        ELSE '점수 없음'
                    END AS travelScore
                FROM TRAVEL_SCORE
                WHERE TRAVEL_IDX = T.IDX
            ) AS travelScore,
            T.CREATED_AT AS travelCreatedAt
        FROM TRAVEL AS T
            LEFT JOIN (
                SELECT IDX, TRAVEL_IDX, TRAVEL_IMAGE_URL
                FROM TRAVEL_THUMNAIL_IMAGE
                GROUP BY TRAVEL_IDX HAVING MIN(IDX)
            ) AS TTL ON T.IDX = TTL.TRAVEL_IDX
        WHERE T.USER_IDX = :userIdx AND T.TRAVEL_STATUS != 'C'
        ORDER BY T.CREATED_AT DESC
        LIMIT :offset, :contentSize;
`;

const travelLikeInMyPageQuery = `
    SELECT TL.TRAVEL_IDX AS travelIdx,
            T.USER_IDX AS travelWriterIdx,
            TRAVEL_TITLE AS travelTitle,
            TRAVEL_INTRO AS travelIntro,
            TRAVEL_HASHTAG AS travelHashtag,
            TTL.TRAVEL_IMAGE_URL AS travelRepImage,
            'Y' AS travelLikeStatus,
            (
                SELECT
                    CASE
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 5 THEN '최고의 여행!'
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 4 THEN '도움되었어요!'
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 3 THEN '그저 그래요'
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 2 THEN '도움되지 않았어요'
                        WHEN TRUNCATE(AVG(TRAVEL_SCORE), 0) = 1 THEN '별로에요'
                        ELSE '점수 없음'
                    END AS travelScore
                FROM TRAVEL_SCORE
                WHERE TRAVEL_IDX = T.IDX
            ) AS travelScore,
            T.CREATED_AT AS travelCreatedAt
        FROM TRAVEL_LIKE AS TL
            INNER JOIN TRAVEL AS T ON TL.TRAVEL_IDX = T.IDX
            INNER JOIN USER AS U ON T.USER_IDX = U.IDX
            LEFT JOIN (
                SELECT IDX, TRAVEL_IDX, TRAVEL_IMAGE_URL
                FROM TRAVEL_THUMNAIL_IMAGE
                GROUP BY TRAVEL_IDX HAVING MIN(IDX)
            ) AS TTL ON TL.TRAVEL_IDX = TTL.TRAVEL_IDX
        WHERE TL.USER_IDX = :userIdx
            AND U.USER_STATUS = 'A'
            AND T.USER_IDX != :userIdx
            AND T.TRAVEL_STATUS = 'A'
        ORDER BY TL.CREATED_AT DESC
        LIMIT :offset, :contentSize;
`;

module.exports = {
    myFollowingQuery,
    myFollowerQuery,
    otherFollowingQuery,
    otherFollowerQuery,
    userInfoInMyPageQuery,
    myTripInMyPageQuery,
    travelLikeInMyPageQuery
};
