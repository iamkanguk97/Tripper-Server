const REGEX_NICKNAME = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/;   // 닉네임 정규식
const REGEX_LONGITUDE = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;   // 경도 정규식
const REGEX_LATITUDE = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;   // 위도 정규식

module.exports = {
    REGEX_NICKNAME,
    REGEX_LONGITUDE,
    REGEX_LATITUDE
};