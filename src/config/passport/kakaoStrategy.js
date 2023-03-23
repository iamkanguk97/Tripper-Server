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
                console.log(accessToken);
                console.log(refreshToken);
                console.log(profile);

                const profileJson = profile._json;
                const kakaoAccount = profileJson.kakao_account;
                const kakaoLoginUser = {
                    kakaoId: profileJson.id
                };

                done(null, kakaoLoginUser);
            }
        )
    );
};
