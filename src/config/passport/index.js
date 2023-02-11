const kakao = require('./kakaoStrategy');
const naver = require('./naverStrategy');

module.exports = () => {
    kakao();
    naver();
};