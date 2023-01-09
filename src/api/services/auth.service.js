const User = require('../models/User/User');

const verifyNickname = async (nickname) => {
    const verifyResult = await User.findOne({ where: { USER_NICKNAME: nickname }});   // DB에서 해당 닉네임을 가진 Row가 존재하는지 확인
    return verifyResult ? true : false;
};

module.exports = {
    verifyNickname
};