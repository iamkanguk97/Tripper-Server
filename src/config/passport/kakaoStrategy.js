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
                done({ accessToken, refreshToken, profile });
            }
        )
    );
};
