const getReportsQuery = `
    SELECT R.IDX AS reportIdx,
            USER_IDX AS reporterIdx,
            ADMIN_IDX AS adminIdx,
            REPORTED_TRAVEL_IDX AS reportedTravelIdx,
            REPORTED_COMMENT_IDX AS reportedCommentIdx,
            REPORT_TYPE_NAME AS reportType,
            REPORT_SUBJECT AS reportSubject,
            REPORT_RESPONSE_STATUS AS reportResponseStatus,
            DATE_FORMAT(RESPONSE_AT, '%Y-%m-%d') AS reportResponseAt,
            DATE_FORMAT(R.CREATED_AT, '%Y-%m-%d') AS reportCreatedAt
    FROM REPORT AS R
        INNER JOIN REPORT_TYPE AS RT ON R.REPORT_TYPE_IDX = RT.IDX
    WHERE RT.STATUS = 'A'
    ORDER BY R.CREATED_AT DESC;
`;

const getReportDetailQuery = `
    SELECT R.IDX AS reportIdx,
        USER_IDX AS reporterIdx,
        ADMIN_IDX AS adminIdx,
        REPORTED_TRAVEL_IDX AS reportedTravelIdx,
        REPORTED_COMMENT_IDX AS reportedCommentIdx,
        REPORT_TYPE_NAME AS reportType,
        REPORT_SUBJECT AS reportSubject,
        REPORT_CONTENT AS reportContent,
        REPORT_RESPONSE_CONTENT AS reportResponseContent,
        REPORT_RESPONSE_STATUS AS reportResponseStatus,
        RESPONSE_AT AS reportResponseAt,
        DATE_FORMAT(R.CREATED_AT, '%Y-%m-%d') AS reportCreatedAt
    FROM REPORT AS R
        INNER JOIN REPORT_TYPE AS RT ON R.REPORT_TYPE_IDX = RT.IDX
    WHERE R.IDX = :reportIdx;
`;

module.exports = {
    getReportsQuery,
    getReportDetailQuery
};
