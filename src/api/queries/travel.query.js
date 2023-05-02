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
                ELSE DATE_FORMAT(TC.CREATED_AT, '%y년 %m월 %d일')
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
                ELSE DATE_FORMAT(TC.CREATED_AT, '%y년 %m월 %d일')
            END AS createdAt
    FROM TRAVEL_COMMENT AS TC
        INNER JOIN USER AS U ON U.IDX = TC.USER_IDX
    WHERE TC.TRAVEL_IDX = :travelIdx
        AND TC.SUPER_COMMENT_IDX = :superCommentIdx
        AND TC.STATUS != 'D'
    ORDER BY TC.CREATED_AT DESC;
`;

module.exports = {
    selectParentCommentListQuery,
    selectChildCommentListQuery
};
