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
                done({ accessToken, refreshToken, profile });
            }
        )
    );
};
