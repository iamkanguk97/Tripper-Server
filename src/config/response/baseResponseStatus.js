module.exports = {
    SUCCESS: { isSuccess: true, code: 1000, message: '요청 성공.' },
    DATABASE_ERROR: { isSuccess: false, code: 5000, message: '데이터베이스 에러 발생.' },
    INTERNAL_SERVER_ERROR: { isSuccess: false, code: 5000, message: '서버 내부 에러 발생.' },

    REQUIRE_SIGN_UP: {
        isSuccess: true,
        code: 200,
        message: '환영합니다! 신규 회원의 경우 닉네임 및 프로필 사진 설정 후 서비스 이용이 가능합니다.'
    },
    AUTO_LOGIN_ERROR: {
        isSuccess: false,
        code: 400,
        message: '자동 로그인 에러 발생 (payload null)'
    },
    JWT_AUTHORIZATION_ERROR: { isSuccess: false, code: 401, message: 'JWT 인증 에러 발생.' },
    JWT_TOKEN_EXPIRED_ERROR: { isSuccess: false, code: 401, message: 'JWT 토큰 만료.' },
    API_NOT_FOUND: { isSuccess: false, code: 404, message: 'API NOT FOUND!' },

    PAGE_NUMBER_ERROR: {
        isSuccess: false,
        code: 2000,
        message: '페이지 번호는 1부터 30이하로 입력해주세요.'
    },
    PAGE_SIZE_ERROR: {
        isSuccess: false,
        code: 2001,
        message: '한 페이지에 보여질 문서 수는 1부터 30이하로 입력해주세요.'
    },
    MUST_BE_STRING: {
        isSuccess: false,
        code: 2002,
        message: '문자열 형태로 입력해주세요.'
    },
    MUST_BE_POSITIVE_INTEGER: {
        isSuccess: false,
        code: 2003,
        message: '양의정수 형태로 입력해주세요.'
    },

    NICKNAME_EMPTY: { isSuccess: false, code: 2010, message: '닉네임을 입력해주세요.' },
    NICKNAME_ERROR_TYPE: {
        isSuccess: false,
        code: 2011,
        message: '닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다.'
    },
    NICKNAME_BAD_WORD_INCLUDE: {
        isSuccess: false,
        code: 2012,
        message: '닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요.'
    },
    EMAIL_EMPTY: { isSuccess: false, code: 2013, message: '이메일을 입력해주세요.' },
    EMAIL_TYPE_ERROR: {
        isSuccess: false,
        code: 2014,
        message: '이메일 형식이 잘못되었습니다. 다시 입력해주세요.'
    },
    SNS_ID_EMPTY: { isSuccess: false, code: 2016, message: '소셜로그인 고유값을 입력해주세요.' },
    FOLLOW_TARGET_IDX_EMPTY: {
        isSuccess: false,
        code: 2017,
        message: '팔로우를 신청할 유저의 고유값을 입력해주세요.'
    },
    FOLLOW_LIST_OPTION_EMPTY: {
        isSuccess: false,
        code: 2018,
        message: '팔로잉 또는 팔로워 조회 옵션을 입력해주세요.'
    },
    FOLLOW_LIST_OPTION_ERROR_TYPE: {
        isSuccess: false,
        code: 2019,
        message: '팔로잉 또는 팔로워 조회 옵션이 잘못 입력되었습니다. 다시 입력해주세요.'
    },
    DELETE_FOLLOWER_IDX_EMPTY: {
        isSuccess: false,
        code: 2020,
        message: '삭제할 팔로워의 고유값을 입력해주세요.'
    },
    PROVIDER_EMPTY: { isSuccess: false, code: 2021, message: '사용자 로그인 타입을 입력해주세요.' },
    PROVIDER_ERROR_TYPE: {
        isSuccess: false,
        code: 2022,
        message: '사용자 로그인 타입은 K(KAKAO) 또는 N(NAVER)로 입력해주세요.'
    },
    JWT_ACCESS_TOKEN_EMPTY: {
        isSuccess: false,
        code: 2023,
        message: 'JWT Access-Token을 입력해주세요.'
    },
    JWT_REFRESH_TOKEN_EMPTY: {
        isSuccess: false,
        code: 2024,
        message: 'JWT Refresh-Token을 입력해주세요.'
    },
    KAKAO_SEARCH_AREA_EMPTY: {
        isSuccess: false,
        code: 2025,
        message: '검색하실 장소명을 입력해주세요.'
    },
    KAKAO_SEARCH_AREA_LENGTH_ERROR: {
        isSuccess: false,
        code: 2026,
        message: '장소명은 최소 2글자 이상으로 입력해주세요.'
    },
    TRAVEL_IDX_EMPTY: {
        isSuccess: false,
        code: 2027,
        message: '여행 게시물 고유값을 입력해주세요.'
    },
    KAKAO_SEARCH_PAGE_NUMBER_ERROR: {
        isSuccess: false,
        code: 2028,
        message: '검색 페이지는 1이상 45이하로 입력해주세요.'
    },
    KAKAO_SEARCH_LONGITUDE_EMPTY: { isSuccess: false, code: 2029, message: '경도를 입력해주세요.' },
    KAKAO_SEARCH_LONGITUDE_ERROR_TYPE: {
        isSuccess: false,
        code: 2030,
        message: '잘못된 경도 형식입니다.'
    },
    KAKAO_SEARCH_LATITUDE_EMPTY: { isSuccess: false, code: 2031, message: '위도를 입력해주세요.' },
    KAKAO_SEARCH_LATITUDE_ERROR_TYPE: {
        isSuccess: false,
        code: 2032,
        message: '잘못된 위도 형식입니다.'
    },
    TRAVEL_REVIEW_SCORE_EMPTY: {
        isSuccess: false,
        code: 2033,
        message: '게시물 평점을 입력해주세요.'
    },
    TRAVEL_REVIEW_SCORE_ERROR_TYPE: {
        isSuccess: false,
        code: 2034,
        message: '게시물 평점은 1점에서 5점 사이로 입력해주세요.'
    },
    SOCIAL_LOGIN_ACCESS_TOKEN_EMPY: {
        isSuccess: false,
        code: 2035,
        message: '소셜로그인 Access-Token을 입력해주세요.'
    },
    SOCIAL_LOGIN_PROVIDER_EMPTY: {
        isSuccess: false,
        code: 2036,
        message: '소셜로그인 유형을 입력해주세요.'
    },
    SOCIAL_LOGIN_PROVIDER_ERROR_TYPE: {
        isSuccess: false,
        code: 2037,
        message: '소셜로그인 유형이 잘못되었습니다.'
    },
    SOCIAL_LOGIN_ACCESS_TOKEN_ERROR: {
        isSuccess: false,
        code: 2038,
        message: '소셜로그인 Access-Token 에러가 발생했습니다.'
    },
    CREATE_TRAVEL_INFORMATION_EMPTY: {
        isSuccess: false,
        code: 2039,
        message: '게시물 생성시 필요한 정보들이 없습니다.'
    },
    CREATE_TRAVEL_STARTDATE_EMPTY: {
        isSuccess: false,
        code: 2040,
        message: '여행 시작 날짜를 입력해주세요.'
    },
    CREATE_TRAVEL_ENDDATE_EMPTY: {
        isSuccess: false,
        code: 2041,
        message: '여행 종료 날짜를 입력해주세요.'
    },
    CREATE_TRAVEL_DATE_ERROR_TYPE: {
        isSuccess: false,
        code: 2042,
        message: '여행 시작/종료 날짜는 YYYY-MM-DD 형식으로 입력해주세요.'
    },
    CREATE_TRAVEL_MOVEMETHOD_EMPTY: {
        isSuccess: false,
        code: 2043,
        message: '여행 이동수단을 입력해주세요.'
    },
    CREATE_TRAVEL_MOVEMETHOD_ERROR_TYPE: {
        isSuccess: false,
        code: 2044,
        message: '여행 이동수단 입력이 잘못되었습니다. 형식에 맞게 입력해주세요.'
    },
    CREATE_TRAVEL_THUMNAIL_IMAGE_LENGTH_ERROR: {
        isSuccess: false,
        code: 2045,
        message: '여행 게시물 썸네일 이미지는 최대 5장까지 업로드 가능합니다.'
    },
    CREATE_TRAVEL_TITLE_EMPTY: {
        isSuccess: false,
        code: 2046,
        message: '여행 게시물 제목을 입력해주세요.'
    },
    PARAMETER_IDX_EQUALS_MY_IDX: {
        isSuccess: false,
        code: 2047,
        message: '매개변수로 들어온 사용자 고유값이랑 나의 고유값이랑 동일합니다.'
    },

    SELECT_MYPAGE_OPTION_ERROR_TYPE: {
        isSuccess: false,
        code: 2048,
        message: '마이페이지 조회 옵션이 잘못되었습니다.'
    },
    SELECT_CONTENT_SIZE_ERROR_TYPE: {
        isSuccess: false,
        code: 2049,
        message: '페이징 내용 사이즈는 1이상 15이하로 입력해주세요.'
    },
    SELECT_PAGE_ERROR_TYPE: {
        isSuccess: false,
        code: 2050,
        message: '페이지 번호는 0이상으로 입력해주세요.'
    },
    EMAIL_VERIFY_EMPTY: {
        isSuccess: false,
        code: 2051,
        message: '이메일 인증번호를 입력해주세요.'
    },
    ADMIN_PASSWORD_EMPTY: {
        isSuccess: false,
        code: 2052,
        message: '관리자 비밀번호를 입력해주세요.'
    },
    ADMIN_PASSWORD_WRONG_TYPE: {
        isSuccess: false,
        code: 2053,
        message: '관리자 비밀번호는 영문,숫자 및 특수기호 조합 8자리 이상으로 입력해주세요.'
    },
    ADMIN_PASSWORD_WRONG: { isSuccess: false, code: 2054, message: '잘못된 비밀번호입니다.' },

    TRAVEL_COMMENT_LENGTH_ERROR: {
        isSuccess: false,
        code: 2055,
        message: '게시물 댓글은 최대 200자로 입력 가능합니다.'
    },
    COMMENT_IDX_EMPTY: {
        isSuccess: false,
        code: 2056,
        message: '게시물 댓글 고유값을 입력해주세요.'
    },
    PROFILE_USER_IDX_EMPTY: {
        isSuccess: false,
        code: 2057,
        message: '프로필 조회할 사용자의 고유값을 입력해주세요.'
    },
    PROFILE_USER_IDX_SAME_WITH_ME: {
        isSuccess: false,
        code: 2058,
        message: '프로필 조회할 사용자의 고유값은 다른 유저의 고유값으로 입력해주세요.'
    },

    REPORT_IDX_EMPTY: { isSuccess: false, code: 2059, message: '신고 고유값을 입력해주세요.' },
    SOCIAL_ACCESS_TOKEN_EMPTY: {
        isSuccess: false,
        code: 2060,
        message: '소셜 Access-Token을 입력해주세요.'
    },
    SOCIAL_VENDOR_EMPTY: {
        isSuccess: false,
        code: 2061,
        message: '소셜 로그인 타입을 입력해주세요.'
    },
    SOCIAL_VENDOR_ERROR_TYPE: {
        isSuccess: false,
        code: 2062,
        message: '소셜 로그인 타입은 kakao 또는 naver로 입력해주세요.'
    },
    CREATE_TRAVEL_TITLE_LENGTH_ERROR: {
        isSuccess: false,
        code: 2063,
        message: '여행 게시물 제목은 최대 50자까지 입력 가능합니다.'
    },
    CREATE_TRAVEL_DATE_MORE_THAN_TODAY: {
        isSuccess: false,
        code: 2064,
        message: '여행 시작날짜 및 종료날짜는 오늘 날짜까지만 설정할 수 있습니다.'
    },
    CREATE_TRAVEL_DAY_EMPTY: {
        isSuccess: false,
        code: 2065,
        message: '여행 게시물 생성시 필요한 각 날짜별 정보가 없습니다.'
    },
    CREATE_TRAVEL_DAY_KEYS_ERROR: {
        isSuccess: false,
        code: 2066,
        message: '여행 게시물의 날짜 정보는 설정하신 시작 날짜와 종료 날짜 사이의 날짜들을 key로 설정해야 합니다.'
    },
    CREATE_TRAVEL_DAY_AREA_IMAGE_COUNT_ERROR: {
        isSuccess: false,
        code: 2067,
        message: '여행 게시물의 지역 사진은 최대 5장까지 업로드 가능합니다.'
    },
    CREATE_TRAVEL_INFORMATION_MUST_OBJECT: {
        isSuccess: false,
        code: 2068,
        message: '여행 게시물의 정보는 객체 상태로 전달을 해주셔야 합니다.'
    },
    CREATE_TRAVEL_DAY_MUST_OBJECT: {
        isSuccess: false,
        code: 2069,
        message: '여행 게시물의 날짜 정보는 객체 상태로 전달을 해주셔야 합니다.'
    },
    CREATE_TRAVEL_DAY_AREA_LATITUDE_EMPTY: {
        isSuccess: false,
        code: 2070,
        message: '여행 게시물의 지역 정보에는 위도를 필수로 입력해주세요.'
    },
    CREATE_TRAVEL_DAY_AREA_LONGITUDE_EMPTY: {
        isSuccess: false,
        code: 2071,
        message: '여행 게시물의 지역 정보에는 경도를 필수로 입력해주세요.'
    },
    CREATE_TRAVEL_DAY_AREA_ADDRESS_EMPTY: {
        isSuccess: false,
        code: 2072,
        message: '여행 게시물의 지역 정보에는 주소를 필수로 입력해주세요.'
    },
    CREATE_TRAVEL_DAY_AREA_REVIEW_MUST_OBJECT: {
        isSuccess: false,
        code: 2073,
        message: '여행 게시물의 지역 정보의 리뷰는 객체 상태로 전달해주세요.'
    },
    HOME_OPTION_ERROR_TYPE: {
        isSuccess: false,
        code: 2074,
        message: '홈화면 조회 옵션이 잘못되었습니다. latest, popular, follow 중에 입력해주세요.'
    },
    NON_MEMBER_CANT_FOLLOW_OPTION: {
        isSuccess: false,
        code: 2075,
        message: '비회원 사용자는 홈조회에서 팔로우 옵션을 사용할 수 없습니다.'
    },

    NICKNAME_DUPLICATED: { isSuccess: false, code: 3010, message: '중복된 닉네임입니다.' },
    USER_NOT_EXIST: { isSuccess: false, code: 3011, message: '존재하지 않는 유저입니다.' },
    DELETE_FOLLOWER_NOT_FOLLOW: {
        isSuccess: false,
        code: 3012,
        message: '삭제할 팔로워가 회원님을 팔로우하고 있지 않습니다.'
    },
    USER_SNSID_DUPLICATED: {
        isSuccess: false,
        code: 3013,
        message: '중복된 소셜로그인 고유값입니다.'
    },
    TRAVEL_NOT_EXIST: { isSuccess: false, code: 3014, message: '존재하지 않는 여행 게시물입니다.' },
    KAKAO_SEARCH_EMPTY_RESULT: {
        isSuccess: false,
        code: 3015,
        message: '조회 결과가 없습니다. 조금 더 정확하게 키워드를 입력해주세요.'
    },
    TRAVEL_CANT_ACCESS: {
        isSuccess: false,
        code: 3016,
        message: '접근할 수 없는 여행 게시물입니다.'
    },
    TRAVEL_DELETED: { isSuccess: false, code: 3017, message: '삭제된 여행 게시물입니다.' },
    TRAVEL_NOT_MINE: { isSuccess: false, code: 3018, message: '본인의 게시물이 아닙니다.' },
    USER_WITHDRAWAL: { isSuccess: false, code: 3019, message: '탈퇴한 유저입니다.' },
    TRAVEL_SCORE_SAME_WITH_BEFORE: {
        isSuccess: false,
        code: 3020,
        message: '이전에 부여한 게시물 평점과 동일합니다.'
    },
    TRAVEL_PRIVATE: { isSuccess: false, code: 3021, message: '비공개 여행 게시물입니다.' },
    EMAIL_VERIFY_FAIL: { isSuccess: false, code: 3022, message: '이메일 인증에 실패하였습니다.' },
    MENTION_USER_NOT_EXIST: {
        isSuccess: false,
        code: 3023,
        message: '언급한 사용자가 존재하지 않는 사용자입니다.'
    },
    PARENT_COMMENT_NOT_EXIST: {
        isSuccess: false,
        code: 3024,
        message: '해당 부모댓글이 존재하지 않습니다.'
    },
    COMMENT_NOT_EXIST: {
        isSuccess: false,
        code: 3025,
        message: '존재하지 않는 댓글 고유값입니다.'
    },
    COMMENT_ALREADY_DELETED: { isSuccess: false, code: 3026, message: '삭제된 댓글입니다.' },
    COMMENT_WRITER_NOT_MATCH: {
        isSuccess: false,
        code: 3027,
        message: '해당 댓글의 작성자가 아닙니다.'
    },

    ADMIN_ALREADY_EXIST: {
        isSuccess: false,
        code: 3500,
        message: '이미 가입되어 있는 관리자 이메일입니다.'
    },
    ADMIN_NOT_EXIST: {
        isSuccess: false,
        code: 3501,
        message: '존재하지 않는 관리자 이메일입니다.'
    },
    REPORT_NOT_EXIST: { isSuccess: false, code: 3502, message: '존재하지 않는 신고 내역입니다.' },
    ADMIN_NICKNAME_DUPLICATED: {
        isSuccess: false,
        code: 3503,
        message: '중복된 관리자 닉네임입니다.'
    }
};
