const { body } = require("express-validator");
const responseMessage = require('../../../config/response/baseResponseStatus');
const User = require("../../models/User/User");

/**
 * 팔로우 기능 API Validator
 * - 팔로우 상대 IDX 유무 확인 + 실제 존재하는 유저인지 확인 (탈퇴 유무까지)
 */
const followValidation = [
    body('followUserIdx')
        .notEmpty().withMessage(responseMessage.FOLLOW_TARGET_IDX_EMPTY).bail()
        .custom(async (value) => {
            const checkUserResult = await User.findOne({
                where: {
                    IDX: value,
                    USER_STATUS: 'A'
                }
            });
            if (!checkUserResult)
                return Promise.reject('USER NOT EXIST')
        }).withMessage(responseMessage.USER_NOT_EXIST).bail()
];

module.exports = {
    followValidation
};