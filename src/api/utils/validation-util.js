/**
 * express-validator에서 사용할 custom-function을 정리해놓은 파일
 * *.validation.js에서 직접 작성해도 되지만 코드가 더러워 보여서 따로 정리.
 */
'use strict';
const User = require('../models/User/User');
const responseMessage = require('../../config/response/baseResponseStatus');
const Logger = require('../../config/logger');
const { checkBadWord } = require('../utils/util');

// 회원 탈퇴 및 존재 유무 확인하는 Validation Function
const checkUserStatusFunc = async (value) => {
    try {
        const checkUserResult = await User.findOne({
            where: {
                IDX: value,
                USER_STATUS: 'A'
            }
        });
        
        if (!checkUserResult)
            return Promise.reject(responseMessage.USER_NOT_EXIST);
    } catch (err) {
        Logger.error(err);
        return Promise.reject({
            isServerError: true,
            error: err
        });
    }
};

// 회원 닉네임 중복 검사
const checkNickDuplicate = async (value) => {
    try {
        const checkDupNickResult = await User.findOne({ where: { USER_NICKNAME: value } });   // 여기서 에러 발생함 -> catch문으로 이동댐!!
        if (checkDupNickResult)   // 해당 닉네임을 사용하고 있는 유저가 있다!
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
const checkBadWordInclude = async (value) => {
    try {
        const checkBadNickResult = await checkBadWord(value);
        if (checkBadNickResult)   // 닉네임에 부적절한 단어 포함중
            return Promise.reject(responseMessage.NICKNAME_BAD_WORD_INCLUDE);
    } catch (err) {
        Logger.error(err);
        return Promise.reject({
            isServerError: true,
            error: err
        });
    }
};

module.exports = {
    checkUserStatusFunc,
    checkNickDuplicate,
    checkBadWordInclude
};