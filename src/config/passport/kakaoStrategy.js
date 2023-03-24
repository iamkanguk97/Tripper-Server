const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { KAKAO } = require('../vars');

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: KAKAO.REST_API_KEY,
                callbackURL: KAKAO.CALLBACK_URL
            },
            (accessToken, refreshToken, profile, done) => {
                // 이메일이 제일 중요
                const profileJson = profile._json;
                const kakaoAccount = profileJson.kakao_account;
                const kakaoLoginUser = {
                    kakaoId: profileJson.id,
                    // email: !kakaoAccount.has_email || (kakaoAccount.has_email && ),
                    ageGroup: 1,
                    gender: true
                };
            }
        )
    );
};
