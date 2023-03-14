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

module.exports = {
    myFollowingQuery,
    myFollowerQuery,
    otherFollowingQuery,
    otherFollowerQuery
};
