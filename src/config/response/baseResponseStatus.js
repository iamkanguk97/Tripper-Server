module.exports = {
    SUCCESS : { "isSuccess": true, "code": 200, "message": "요청 성공." },
    JWT_AUTHORIZATION_ERROR: { "isSuccess": false, "code": 401, "message": "JWT 인증 에러 발생." },
    JWT_TOKEN_EXPIRED_ERROR: { "isSuccess": false, "code": 401, "message": "JWT 토큰 만료." },
    API_NOT_FOUND: { "isSuccess": false, "code": 404, "message": "API NOT FOUND!" },
    INTERNAL_SERVER_ERROR: { "isSuccess": false, "code": 500, "message": "서버 내부 에러 발생." },

    NICKNAME_EMPTY: { isSuccess: false, "code": 2010, "message": "닉네임을 입력해주세요." },
    NICKNAME_ERROR_TYPE: { "isSuccess": false, "code": 2011, "message": "닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다." },
    NICKNAME_BAD_WORD_INCLUDE: { "isSuccess": false, "code": 2012, "message": "닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요." },
    EMAIL_EMPTY: { "isSuccess": false, "code": 2013, "message": "이메일을 입력해주세요." },
    EMAIL_TYPE_ERROR: { "isSuccess": false, "code": 2014, "message": "이메일 형식이 잘못되었습니다. 다시 입력해주세요." },
    NICKNAME_EMPTY: { "isSuccess": false, "code": 2015, "message": "닉네임을 입력해주세요." },
    KAKAOID_EMPTY: { "isSuccess": false, "code": 2016, "message": "카카오 고유값을 입력해주세요." },
    FOLLOW_TARGET_IDX_EMPTY: { "isSuccess": false, "code": 2017, "message": "팔로우를 신청할 유저의 고유값을 입력해주세요." },
    FOLLOW_LIST_OPTION_EMPTY: { "isSuccess": false, "code": 2018, "message": "팔로잉 또는 팔로워 조회 옵션을 입력해주세요." },
    FOLLOW_LIST_OPTION_ERROR_TYPE: { "isSuccess": false, "code": 2019, "message": "팔로잉 또는 팔로워 조회 옵션이 잘못 입력되었습니다. 다시 입력해주세요." },
    DELETE_FOLLOWER_IDX_EMPTY: { "isSuccess": false, "code": 2020, "message": "삭제할 팔로워의 고유값을 입력해주세요." },

    NICKNAME_DUPLICATED: { "isSuccess": false, "code": 3010, "message": "중복된 닉네임입니다." },
    USER_NOT_EXIST: { "isSuccess": false, "code": 3011, "message": "존재하지 않는 유저입니다." },
    DELETE_FOLLOWER_NOT_FOLLOW: { "isSuccess": false, "code": 3012, "message": "삭제할 팔로워가 회원님을 팔로우하고 있지 않습니다." },
};