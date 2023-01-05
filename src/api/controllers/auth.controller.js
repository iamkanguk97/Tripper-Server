const authService = require('../services/auth.service');

const verifyNickname = async (req, res) => {
    const nickname = req.query.nickname;
    const checkNickname = await authService.verifyNickname(nickname);
};

module.exports = {
    verifyNickname
};