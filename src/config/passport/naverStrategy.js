const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const { NAVER } = require('../vars');
const { ageGroupToString, getFirstLetter } = require('../../api/utils/util');

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
                    email: profileJson.email ?? null,
                    ageGroup: !profileJson.age ? null : ageGroupToString(profileJson.age),
                    gender: !profileJson.gender ? null : getFirstLetter(profileJson.gender)
                };

                done(null, naverLoginUser);
            }
        )
    );
};
