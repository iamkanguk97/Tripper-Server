const passport = require('passport');
const kakao = require('./kakaoStrategy');

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('serializeUser!');
    });

    passport.deserializeUser((id, done) => {
        console.log('deserializeUser!');
    });

    kakao();
};