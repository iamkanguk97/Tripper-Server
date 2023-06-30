const selectParentCommentListQuery = `
    SELECT TC.IDX AS parentCommentIdx,
            TC.USER_IDX AS userIdx,
            U.USER_NICKNAME AS userNickname,
            U.USER_PROFILE_IMAGE AS userProfileImage,
            TC.COMMENT_TEXT AS comment,
            IF(TC.STATUS = 'M', 'Y', 'N') AS isModified,
            (SELECT COUNT(IDX) FROM TRAVEL_COMMENT WHERE TRAVEL_IDX = 10 AND SUPER_COMMENT_IDX = TC.IDX AND STATUS != 'D') AS childCommentCount,
            CASE
                WHEN TIMESTAMPDIFF(SECOND, TC.CREATED_AT, NOW()) < 60 THEN '방금 전'
                WHEN TIMESTAMPDIFF(MINUTE, TC.CREATED_AT, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, TC.CREATED_AT, NOW()), '분전')
                WHEN TIMESTAMPDIFF(HOUR, TC.CREATED_AT, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, TC.CREATED_AT, NOW()), '시간전')
                WHEN TIMESTAMPDIFF(DAY, TC.CREATED_AT, NOW()) < 30 THEN CONCAT(TIMESTAMPDIFF(DAY, TC.CREATED_AT, NOW()), '일전')
                ELSE DATE_FORMAT(TC.CREATED_AT, '%Y년 %m월 %d일')
            END AS createdAt
    FROM TRAVEL_COMMENT AS TC
        INNER JOIN USER AS U ON U.IDX = TC.USER_IDX
    WHERE TC.TRAVEL_IDX = :travelIdx
        AND TC.STATUS != 'D'
        AND TC.SUPER_COMMENT_IDX IS NULL
    ORDER BY TC.CREATED_AT DESC;
`;

const selectChildCommentListQuery = `
    SELECT TC.IDX AS childCommentIdx,
            TC.USER_IDX AS userIdx,
            U.USER_NICKNAME AS userNickname,
            U.USER_PROFILE_IMAGE AS userProfileImage,
            TC.COMMENT_TEXT AS comment,
            IF(TC.STATUS = 'M', 'Y', 'N') AS isModified,
            CASE
                WHEN TIMESTAMPDIFF(SECOND, TC.CREATED_AT, NOW()) < 60 THEN '방금 전'
                WHEN TIMESTAMPDIFF(MINUTE, TC.CREATED_AT, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, TC.CREATED_AT, NOW()), '분전')
                WHEN TIMESTAMPDIFF(HOUR, TC.CREATED_AT, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, TC.CREATED_AT, NOW()), '시간전')
                WHEN TIMESTAMPDIFF(DAY, TC.CREATED_AT, NOW()) < 30 THEN CONCAT(TIMESTAMPDIFF(DAY, TC.CREATED_AT, NOW()), '일전')
                ELSE DATE_FORMAT(TC.CREATED_AT, '%Y년 %m월 %d일')
            END AS createdAt
    FROM TRAVEL_COMMENT AS TC
        INNER JOIN USER AS U ON U.IDX = TC.USER_IDX
    WHERE TC.TRAVEL_IDX = :travelIdx
        AND TC.SUPER_COMMENT_IDX = :superCommentIdx
        AND TC.STATUS != 'D'
    ORDER BY TC.CREATED_AT DESC;
`;

const selectTravelInfoDetailQuery = `
    SELECT 
            T.IDX AS travelIdx, 
            T.USER_IDX AS userIdx,
            U.USER_NICKNAME AS userNickname,
            U.USER_PROFILE_IMAGE AS userProfileImage,
            JSON_ARRAY(GROUP_CONCAT(TRAVEL_IMAGE_URL SEPARATOR ',')) AS travelThumnailImages,
            T.TRAVEL_TITLE AS travelTitle,
            T.TRAVEL_INTRO AS travelIntro,
            T.TRAVEL_HASHTAG AS travelHashtag,
            IFNULL(COUNT(TS.IDX), 0) AS travelScoreCount,
            CASE
                WHEN TRUNCATE(AVG(TS.TRAVEL_SCORE), 0) = 5 THEN '최고의 여행'
                WHEN TRUNCATE(AVG(TS.TRAVEL_SCORE), 0) = 4 THEN '도움되었어요!'
                WHEN TRUNCATE(AVG(TS.TRAVEL_SCORE), 0) = 3 THEN '그저 그래요'
                WHEN TRUNCATE(AVG(TS.TRAVEL_SCORE), 0) = 2 THEN '도움되지 않았어요'
                WHEN TRUNCATE(AVG(TS.TRAVEL_SCORE), 0) = 1 THEN '별로에요'
                ELSE '점수 없음'
            END AS travelScoreAverage,
            IFNULL(COUNT(TL.IDX), 0) AS travelLikeCount,
            IFNULL(COUNT(TC.IDX), 0) AS travelCommentCount,
            IF(EXISTS(SELECT IDX FROM TRAVEL_LIKE WHERE TRAVEL_IDX = :travelIdx AND USER_IDX = :userIdx)=1, 'ACTIVE', 'INACTIVE') AS isLike,
            CASE
                WHEN TIMESTAMPDIFF(SECOND, T.CREATED_AT, NOW()) <= 0 THEN CONCAT(TIMESTAMPDIFF(SECOND, T.CREATED_AT, NOW()), '방금 전')
                WHEN TIMESTAMPDIFF(SECOND, T.CREATED_AT, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(SECOND, T.CREATED_AT, NOW()), '초 전')
                WHEN TIMESTAMPDIFF(MINUTE, T.CREATED_AT, NOW()) < 60 THEN CONCAT(TIMESTAMPDIFF(MINUTE, T.CREATED_AT, NOW()), '분 전')
                WHEN TIMESTAMPDIFF(HOUR, T.CREATED_AT, NOW()) < 24 THEN CONCAT(TIMESTAMPDIFF(HOUR, T.CREATED_AT, NOW()), '시간 전')
                WHEN TIMESTAMPDIFF(DAY, T.CREATED_AT, NOW()) < 30 THEN CONCAT(TIMESTAMPDIFF(DAY, T.CREATED_AT, NOW()), '일 전')
                WHEN TIMESTAMPDIFF(MONTH, T.CREATED_AT, NOW()) < 12 THEN CONCAT(TIMESTAMPDIFF(MONTH, T.CREATED_AT, NOW()), '달 전')
                ELSE CONCAT(TIMESTAMPDIFF(YEAR, T.CREATED_AT, NOW()), '년 전')
            END AS createdAt
        FROM TRAVEL AS T
            INNER JOIN USER AS U ON T.USER_IDX = U.IDX
            INNER JOIN TRAVEL_THUMNAIL_IMAGE TTI on T.IDX = TTI.TRAVEL_IDX
            LEFT JOIN TRAVEL_SCORE AS TS ON T.IDX = TS.TRAVEL_IDX
            LEFT JOIN TRAVEL_LIKE AS TL ON TL.TRAVEL_IDX = T.IDX
            LEFT JOIN TRAVEL_COMMENT AS TC ON TC.TRAVEL_IDX = T.IDX AND TC.STATUS = 'A'
        WHERE T.IDX = :travelIdx
            AND T.TRAVEL_STATUS != 'C';
`;

const selectTravelDayInfoDetailQuery = `
    SELECT TDA.TRAVEL_DAY_IDX AS dayIdx,
        TDA.IDX AS areaIdx,
        AREA_NAME AS areaName,
        AREA_ADDRESS AS areaAddress,
        AREA_CATEGORY AS areaCategory,
        AREA_LATITUDE AS areaLatitude,
        AREA_LONGITUDE AS areaLongitude,
        AREA_REVIEW AS areaReview,
        CASE
            WHEN ISNULL(GROUP_CONCAT(TRAVEL_DAY_AREA_IMAGE_URL SEPARATOR ',')) = 1 THEN JSON_ARRAY()
            WHEN ISNULL(GROUP_CONCAT(TRAVEL_DAY_AREA_IMAGE_URL SEPARATOR ',')) = 0 THEN JSON_ARRAY(GROUP_CONCAT(TRAVEL_DAY_AREA_IMAGE_URL SEPARATOR ','))
        END AS areaImages
    FROM TRAVEL_DAY_AREA AS TDA
        LEFT JOIN TRAVEL_DAY_AREA_IMAGE AS TDAI ON TDA.IDX = TDAI.TRAVEL_DAY_AREA_IDX
    WHERE TDA.TRAVEL_DAY_IDX = :travelDayIdx
    GROUP BY TDA.IDX;
`;

module.exports = {
    selectParentCommentListQuery,
    selectChildCommentListQuery,
    selectTravelInfoDetailQuery,
    selectTravelDayInfoDetailQuery
};
