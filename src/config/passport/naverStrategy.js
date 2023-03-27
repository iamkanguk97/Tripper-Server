const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const { NAVER } = require('../vars');

module.exports = () => {
    passport.use(
        new NaverStrategy(
            {
                clientID: NAVER.CLIENT_ID,
                clientSecret: NAVER.CLIENT_SECRET_KEY,
                callbackURL: NAVER.CALLBACK_URL
            },
            (accessToken, refreshToken, profile, done) => {
                // console.log(accessToken);
                // console.log(refreshToken);
                // console.log(profile);

                const profileJson = profile._json;
                const naverLoginUser = {
                    naverId: profileJson.id,
                    email: profileJson.email,
                    ageGroup: profileJson.age ?? null,
                    gender: profileJson.gender ?? null
                };

                done(null, naverLoginUser);
            }
        )
    );
};
