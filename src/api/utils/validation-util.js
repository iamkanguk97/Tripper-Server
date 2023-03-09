/**
 * express-validator에서 사용할 custom-function을 정리해놓은 파일
 * *.validation.js에서 직접 작성해도 되지만 코드가 더러워 보여서 따로 정리.
 */
'use strict';
const User = require('../models/User/User');
const UserFollow = require('../models/User/UserFollow');
const Travel = require('../models/Travel/Travel');
const responseMessage = require('../../config/response/baseResponseStatus');
const Logger = require('../../config/logger');
const { Op } = require('sequelize');
const { checkBadWord } = require('../utils/util');
const { validationErrorResponse } = require('../../config/response/response-template');

// 회원 탈퇴 및 존재 유무 확인하는 Validation Function
const checkUserStatusFunc = async value => {
    if (!value)
        // value가 없으면 넘겨보냄
        return Promise.resolve();
    else {
        try {
            const checkUserResult = await User.findOne({
                where: {
                    IDX: value,
                    USER_STATUS: 'A'
                }
            });

            if (!checkUserResult) return Promise.reject(responseMessage.USER_NOT_EXIST);
        } catch (err) {
            Logger.error(err);
            return Promise.reject(validationErrorResponse(true, err));
        }
    }
};

// 회원 닉네임 중복 검사
const checkNickDuplicate = async value => {
    try {
        const checkDupNickResult = await User.findOne({ where: { USER_NICKNAME: value } }); // 여기서 에러 발생함 -> catch문으로 이동댐!!
        if (checkDupNickResult)
            // 해당 닉네임을 사용하고 있는 유저가 있다!
            return Promise.reject(responseMessage.NICKNAME_DUPLICATED);
    } catch (err) {
        Logger.error(err);
        return Promise.reject({
            isServerError: true,
            error: err
        });
    }
};

// 부적절한 단어 포함 여부 확인 (현재는 닉네임만)
const checkBadWordInclude = async value => {
    try {
        const checkBadNickResult = await checkBadWord(value);
        if (checkBadNickResult)
            // 닉네임에 부적절한 단어 포함중
            return Promise.reject(responseMessage.NICKNAME_BAD_WORD_INCLUDE);
    } catch (err) {
        Logger.error(err);
        return Promise.reject({
            isServerError: true,
            error: err
        });
    }
};

// snsId 중복 확인
const checkSnsIdDuplicate = async snsId => {
    try {
        const checkSnsIdDuplicateResult = await User.findOne({
            where: {
                USER_SNS_ID: snsId,
                USER_STATUS: 'A'
            }
        });

        if (checkSnsIdDuplicateResult) return Promise.reject(responseMessage.USER_SNSID_DUPLICATED);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

// Header에 Access-Token이 있는지 확인
// 일반 API에는 jwtMiddleware가 있기 때문에 사용 안해도 되지만 jwtMiddleware를 사용안하는 경우 이 util 함수 사용 필요!
const checkAccessTokenEmpty = async token => {
    try {
        const _token = token.split('Bearer ')[1];
        if (!_token)
            // token을 입력 안했을경우
            return Promise.reject(responseMessage.JWT_ACCESS_TOKEN_EMPTY);
    } catch (err) {
        Logger.error(err);
        return Promise.reject({
            isServerError: true,
            error: err
        });
    }
};

// 유저가 자기 자신을 팔로우 하고있는지 확인
const checkUserFollowMe = async (value, { req }) => {
    try {
        // 해당 유저가 본인을 팔로우하고 있는지 확인
        const checkFollow = await UserFollow.findOne({
            where: {
                USER_IDX: value,
                FOLLOW_TARGET_IDX: req.verifiedToken.userIdx
            }
        });

        if (!checkFollow) return Promise.reject(responseMessage.DELETE_FOLLOWER_NOT_FOLLOW);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

// 여행 게시물이 실제로 있는지 확인
const checkTravelExist = async (value, { req }) => {
    try {
        const checkMyTravelValid = await Travel.findOne({
            where: {
                [Op.and]: [{ USER_IDX: req.verifiedToken.userIdx }, { IDX: value }],
                TRAVEL_STATUS: {
                    [Op.ne]: 'C'
                }
            }
        });

        if (!checkMyTravelValid) return Promise.reject(responseMessage.TRAVEL_NOT_EXIST);
        else {
            req.travelStatus = checkMyTravelValid.dataValues.TRAVEL_STATUS;
        }
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

module.exports = {
    checkUserStatusFunc,
    checkNickDuplicate,
    checkBadWordInclude,
    checkSnsIdDuplicate,
    checkAccessTokenEmpty,
    checkUserFollowMe,
    checkTravelExist
};
