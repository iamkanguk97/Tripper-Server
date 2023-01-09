module.exports = {
    SUCCESS : { "isSuccess": true, "code": 200, "message": "요청 성공" },

    NICKNAME_EMPTY: { "isSuccess": false, "code": 2010, "message": "닉네임을 입력해주세요." },
    NICKNAME_ERROR_TYPE: { "isSuccess": false, "code": 2011, "message": "닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다." },
    NICKNAME_BAD_WORD_INCLUDE: { "isSuccess": false, "code": 2012, "message": "닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요." },

    KAKAO_ACCESS_TOKEN_EMPTY: { "isSuccess": false, "code": 2013, "message": "카카오 Access-Token을 입력해주세요." },
        
    NICKNAME_DUPLICATED: { "isSuccess": false, "code": 3010, "message": "중복된 닉네임입니다." },

    INTERNAL_SERVER_ERROR: { "isSuccess": false, "code": 5000, "message": "서버 내부 에러 발생." }
};