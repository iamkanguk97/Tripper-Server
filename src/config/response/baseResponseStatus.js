module.exports = {
    SUCCESS : { "isSuccess": true, "code": 200, "message": "요청 성공." },
    CREATE_SUCCESS: { "isSuccess": true, "code": 201, "message": "요청 성공." },
    REQUIRE_SIGN_UP: { "isSuccess": true, "code": 200, "message": "환영합니다! 신규 회원의 경우 닉네임 및 프로필 사진 설정 후 서비스 이용이 가능합니다." },
    AUTO_LOGIN_ERROR: { "isSuccess": false, "code": 400, "message": "자동 로그인 에러 발생 (payload null)" },
    JWT_AUTHORIZATION_ERROR: { "isSuccess": false, "code": 401, "message": "JWT 인증 에러 발생." },
    JWT_TOKEN_EXPIRED_ERROR: { "isSuccess": false, "code": 401, "message": "JWT 토큰 만료." },
    API_NOT_FOUND: { "isSuccess": false, "code": 404, "message": "API NOT FOUND!" },
    DATABASE_ERROR: { "isSuccess": false, "code": 500, "message": "데이터베이스 에러 발생." },
    INTERNAL_SERVER_ERROR: { "isSuccess": false, "code": 500, "message": "서버 내부 에러 발생." },

    NICKNAME_EMPTY: { isSuccess: false, "code": 2010, "message": "닉네임을 입력해주세요." },
    NICKNAME_ERROR_TYPE: { "isSuccess": false, "code": 2011, "message": "닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다." },
    NICKNAME_BAD_WORD_INCLUDE: { "isSuccess": false, "code": 2012, "message": "닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요." },
    EMAIL_EMPTY: { "isSuccess": false, "code": 2013, "message": "이메일을 입력해주세요." },
    EMAIL_TYPE_ERROR: { "isSuccess": false, "code": 2014, "message": "이메일 형식이 잘못되었습니다. 다시 입력해주세요." },
    SNS_ID_EMPTY: { "isSuccess": false, "code": 2016, "message": "소셜로그인 고유값을 입력해주세요." },
    FOLLOW_TARGET_IDX_EMPTY: { "isSuccess": false, "code": 2017, "message": "팔로우를 신청할 유저의 고유값을 입력해주세요." },
    FOLLOW_LIST_OPTION_EMPTY: { "isSuccess": false, "code": 2018, "message": "팔로잉 또는 팔로워 조회 옵션을 입력해주세요." },
    FOLLOW_LIST_OPTION_ERROR_TYPE: { "isSuccess": false, "code": 2019, "message": "팔로잉 또는 팔로워 조회 옵션이 잘못 입력되었습니다. 다시 입력해주세요." },
    DELETE_FOLLOWER_IDX_EMPTY: { "isSuccess": false, "code": 2020, "message": "삭제할 팔로워의 고유값을 입력해주세요." },
    PROVIDER_EMPTY: { "isSuccess": false, "code": 2021, "message": "사용자 로그인 타입을 입력해주세요." },
    PROVIDER_ERROR_TYPE: { "isSuccess": false, "code": 2022, "message": "사용자 로그인 타입은 K(KAKAO) 또는 N(NAVER)로 입력해주세요." },
    JWT_ACCESS_TOKEN_EMPTY: { "isSuccess": false, "code": 2023, "message": "JWT Access-Token을 입력해주세요." },
    JWT_REFRESH_TOKEN_EMPTY: { "isSuccess": false, "code": 2024, "message": "JWT Refresh-Token을 입력해주세요." },
    KAKAO_SEARCH_AREA_EMPTY: { "isSuccess": false, "code": 2025, "message": "검색하실 장소명을 입력해주세요." },
    KAKAO_SEARCH_AREA_LENGTH_ERROR: { "isSuccess": false, "code": 2026, "message": "장소명은 최소 2글자 이상으로 입력해주세요." },
    TRAVEL_IDX_EMPTY: { "isSuccess": false, "code": 2027, "message": "여행 게시물 고유값을 입력해주세요." },
    KAKAO_SEARCH_PAGE_NUMBER_ERROR: { "isSuccess": false, "code": 2028, "message": "검색 페이지는 1이상 45이하로 입력해주세요." },
    KAKAO_SEARCH_LONGITUDE_EMPTY: { "isSuccess": false, "code": 2029, "message": "경도를 입력해주세요." },
    KAKAO_SEARCH_LONGITUDE_ERROR_TYPE: { "isSuccess": false, "code": 2030, "message": "잘못된 경도 형식입니다." },
    KAKAO_SEARCH_LATITUDE_EMPTY: { "isSuccess": false, "code": 2031, "message": "위도를 입력해주세요." },
    KAKAO_SEARCH_LATITUDE_ERROR_TYPE: { "isSuccess": false, "code": 2032, "message": "잘못된 위도 형식입니다." },
    TRAVEL_REVIEW_SCORE_EMPTY: { "isSuccess": false, "code": 2033, "message": "게시물 평점을 입력해주세요." },
    TRAVEL_REVIEW_SCORE_ERROR_TYPE: { "isSuccess": false, "code": 2034, "message": "게시물 평점은 1점에서 5점 사이로 입력해주세요." },
    SOCIAL_LOGIN_ACCESS_TOKEN_EMPY: { "isSuccess": false, "code": 2035, "message": "소셜로그인 Access-Token을 입력해주세요." },
    SOCIAL_LOGIN_PROVIDER_EMPTY: { "isSuccess": false, "code": 2036, "message": "소셜로그인 유형을 입력해주세요." },
    SOCIAL_LOGIN_PROVIDER_ERROR_TYPE: { "isSuccess": false, "code": 2037, "message": "소셜로그인 유형이 잘못되었습니다." },
    SOCIAL_LOGIN_ACCESS_TOKEN_ERROR: { "isSuccess": false, "code": 2038, "message": "소셜로그인 Access-Token 에러가 발생했습니다." },
    
    CREATE_TRAVEL_INFORMATION_EMPTY: { "isSuccess": false, "code": 2039, "message": "게시물 생성시 필요한 정보들이 없습니다." },
    CREATE_TRAVEL_STARTDATE_EMPTY: { "isSuccess": false, "code": 2040, "message": "여행 시작 날짜를 입력해주세요." },
    CREATE_TRAVEL_ENDDATE_EMPTY: { "isSuccess": false, "code": 2041, "message": "여행 종료 날짜를 입력해주세요." },
    CREATE_TRAVEL_DATE_ERROR_TYPE: { "isSuccess": false, "code": 2042, "message": "여행 시작/종료 날짜는 YYYY-MM-DD 형식으로 입력해주세요." },
    CREATE_TRAVEL_MOVEMETHOD_EMPTY: { "isSuccess": false, "code": 2043, "message": "여행 이동수단을 입력해주세요." },
    CREATE_TRAVEL_MOVEMETHOD_ERROR_TYPE: { "isSuccess": false, "code": 2044, "message": "여행 이동수단 입력이 잘못되었습니다. 형식에 맞게 입력해주세요." },
    CREATE_TRAVEL_THUMNAIL_IMAGE_LENGTH_ERROR: { "isSuccess": false, "code": 2045, "message": "여행 게시물 썸네일 이미지는 최대 5장까지 업로드 가능합니다." },
    CREATE_TRAVEL_TITLE_EMPTY: { "isSuccess": false, "code": 2046, "message": "여행 게시물 제목을 입력해주세요." },

    NICKNAME_DUPLICATED: { "isSuccess": false, "code": 3010, "message": "중복된 닉네임입니다." },
    USER_NOT_EXIST: { "isSuccess": false, "code": 3011, "message": "존재하지 않는 유저입니다." },
    DELETE_FOLLOWER_NOT_FOLLOW: { "isSuccess": false, "code": 3012, "message": "삭제할 팔로워가 회원님을 팔로우하고 있지 않습니다." },
    USER_SNSID_DUPLICATED: { "isSuccess": false, "code": 3013, "message": "중복된 소셜로그인 고유값입니다." },
    TRAVEL_NOT_EXIST: { "isSuccess": false, "code": 3014, "message": "존재하지 않는 여행 게시물입니다." },
    KAKAO_SEARCH_EMPTY_RESULT: { "isSuccess": false, "code": 3015, "message": "조회 결과가 없습니다. 조금 더 정확하게 키워드를 입력해주세요." },
    TRAVEL_CANT_SET_REVIEW_SCORE: { "isSuccess": false, "code": 3016, "message": "접근할 수 없는 여행 게시물입니다." },
};