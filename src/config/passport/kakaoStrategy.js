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
                // console.log(accessToken);
                // console.log(refreshToken);
                // console.log(profile);

                const profileJson = profile._json;
                const kakaoAccount = profileJson.kakao_account;
                const kakaoLoginUser = {
                    kakaoId: profileJson.id,
                    email:
                        !kakaoAccount.has_email ||
                        (kakaoAccount.has_email && kakaoAccount.email_needs_agreement)
                            ? null
                            : kakaoAccount.email,
                    ageGroup:
                        !kakaoAccount.has_age_range ||
                        (kakaoAccount.has_age_range && kakaoAccount.age_range_needs_agreement)
                            ? null
                            : kakaoAccount.age_range,
                    gender:
                        !kakaoAccount.has_gender ||
                        (kakaoAccount.has_gender && kakaoAccount.gender_needs_agreement)
                            ? null
                            : kakaoAccount.age_range
                };

                done(null, kakaoLoginUser);
            }
        )
    );
};
