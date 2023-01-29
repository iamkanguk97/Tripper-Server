const User = require('../models/User/User');

// 회원 탈퇴 및 존재 유무 확인하는 Validation Function
const checkUserStatusFunc = async (value) => {
    const checkUserResult = await User.findOne({
        where: {
            IDX: value,
            USER_STATUS: 'A'
        }
    });
    
    if (!checkUserResult)
        return Promise.reject('USER NOT EXIST')
};

module.exports = {
    checkUserStatusFunc
};