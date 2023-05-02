const selectParentCommentListQuery = `
    SELECT TC.IDX,
            TC.USER_IDX,
            TC.COMMENT_TEXT,
            IF(TC.STATUS = 'M', 'Y', 'N') AS isModified,
            TC.CREATED_AT
    FROM TRAVEL_COMMENT AS TC
    WHERE TC.TRAVEL_IDX = :travelIdx
        AND TC.STATUS != 'D'
        AND SUPER_COMMENT_IDX IS NULL
    ORDER BY TC.CREATED_AT DESC;
`;

module.exports = {
    selectParentCommentListQuery
};
