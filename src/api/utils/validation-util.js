/**
 * express-validator에서 사용할 custom-function을 정리해놓은 파일
 * *.validation.js에서 직접 작성해도 되지만 코드가 더러워 보여서 따로 정리.
 */

const { Op } = require('sequelize');
const { default: axios } = require('axios');
const User = require('../models/User/User');
const UserFollow = require('../models/User/UserFollow');
const Travel = require('../models/Travel/Travel');
const TravelScore = require('../models/Travel/TravelScore');
const responseMessage = require('../../config/response/baseResponseStatus');
const Logger = require('../../config/logger');
const { validationErrorResponse } = require('../../config/response/response-template');
const Admin = require('../models/Admin/Admin');
const TravelComment = require('../models/Travel/TravelComment');

// 회원 존재 및 탈퇴 확인하는 Validation
const checkUserStatus = async value => {
    try {
        const checkUserResult = await User.findOne({
            where: {
                IDX: value
            }
        });

        // DB에 해당 유저의 아이디가 등록X
        if (!checkUserResult) return Promise.reject(responseMessage.USER_NOT_EXIST);
        if (checkUserResult.dataValues.USER_STATUS === 'D') return Promise.reject(responseMessage.USER_WITHDRAWAL);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

// 매개변수로 들어온 idx랑 JWT의 idx가 같은지 확인
const checkParameterIdxEqualMyIdx = async (value, { req }) => {
    try {
        const userIdx = req.verifiedToken.userIdx;
        if (parseInt(userIdx) === parseInt(value)) return Promise.reject(responseMessage.PARAMETER_IDX_EQUALS_MY_IDX);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

// 회원 탈퇴 및 존재 유무 확인하는 Validation Function
// const checkUserStatusFunc = async value => {
//     if (!value)
//         // value가 없으면 넘겨보냄
//         return Promise.resolve();

//     try {
//         const checkUserResult = await User.findOne({
//             where: {
//                 IDX: value,
//                 USER_STATUS: 'A'
//             }
//         });

//         if (!checkUserResult) return Promise.reject(responseMessage.USER_NOT_EXIST);
//     } catch (err) {
//         Logger.error(err);
//         return Promise.reject(validationErrorResponse(true, err));
//     }
// };

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
        return Promise.reject(validationErrorResponse(true, err));
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

// 내 여행 게시물이 실제로 있는지 확인
const checkMyTravelExist = async (value, { req }) => {
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

        req.travelStatus = checkMyTravelValid.dataValues.TRAVEL_STATUS;
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

// const checkTravelDateIsOver = async date => {
//     try {
//         // console.log(date);
//         // 오늘 날짜가 지난 날짜인지 확인
//         //
//         return date;
//     } catch (err) {
//         Logger.error(err);
//         return Promise.reject(validationErrorResponse(true, err));
//     }
// };

// const checkTravelDay = async day => {};

const checkTravelStatusExceptPrivate = async travelIdx => {
    try {
        // 해당 여행 게시물이 DB에 있는지
        const checkTravelExist = await Travel.findOne({
            where: {
                IDX: travelIdx
            }
        });
        if (!checkTravelExist) return Promise.reject(responseMessage.TRAVEL_NOT_EXIST);

        // 있으면 그 게시물이 삭제된 게시물인지 확인
        if (checkTravelExist.dataValues.TRAVEL_STATUS === 'C') return Promise.reject(responseMessage.TRAVEL_DELETED);
        if (checkTravelExist.dataValues.TRAVEL_STATUS === 'B') return Promise.reject(responseMessage.TRAVEL_PRIVATE);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

const checkMyTravel = async (value, { req }) => {
    try {
        const checkMyTravelResult = await Travel.findOne({
            where: {
                IDX: value,
                USER_IDX: req.verifiedToken.userIdx
            }
        });

        if (!checkMyTravelResult) return Promise.reject(responseMessage.TRAVEL_NOT_MINE);

        // SERVICE 단에서 또 호출하지 않게 req 변수에 담음
        req.travelStatus = checkMyTravelResult.dataValues.TRAVEL_STATUS;
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

const checkBeforeReviewScore = async (value, { req }) => {
    try {
        const travelIdx = parseInt(req.body.travelIdx);
        const checkUserScore = await TravelScore.findOne({
            attributes: ['TRAVEL_SCORE'],
            where: {
                TRAVEL_IDX: travelIdx,
                USER_IDX: req.verifiedToken.userIdx
            }
        });
        const checkUserScoreExist = !checkUserScore ? 'N' : 'Y';

        if (checkUserScoreExist === 'Y' && value === checkUserScore.dataValues.TRAVEL_SCORE) {
            return Promise.reject(responseMessage.TRAVEL_SCORE_SAME_WITH_BEFORE);
        }

        req.checkUserScoreExist = checkUserScoreExist;
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

const checkMentionUserStatus = async (value, { req }) => {
    try {
        const mentionUserIdRows = await Promise.all(
            value.map(async nickname => {
                const checkMentionUser = await User.findOne({
                    where: {
                        USER_NICKNAME: nickname,
                        USER_STATUS: 'A'
                    }
                });

                if (!checkMentionUser) return Promise.reject(responseMessage.MENTION_USER_NOT_EXIST);
                return checkMentionUser.dataValues.IDX;
            })
        );

        req.mentionUserIdRows = mentionUserIdRows;
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

const checkParentCommentAble = async value => {
    try {
        if (value !== null) {
            const checkCommentExist = await TravelComment.findOne({
                where: {
                    IDX: value,
                    STATUS: {
                        [Op.ne]: 'D'
                    }
                }
            });

            if (!checkCommentExist) return Promise.reject(responseMessage.PARENT_COMMENT_NOT_EXIST);
        }
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

const checkIsMyComment = async (value, { req }) => {
    try {
        const userIdx = req.verifiedToken.userIdx;

        const checkCommentExist = await TravelComment.findOne({
            where: {
                IDX: value
            }
        });

        if (!checkCommentExist) return Promise.reject(responseMessage.COMMENT_NOT_EXIST);
        if (checkCommentExist.dataValues.STATUS === 'D') return Promise.reject(responseMessage.COMMENT_ALREADY_DELETED);
        if (checkCommentExist.dataValues.USER_IDX !== userIdx) return Promise.reject(responseMessage.COMMENT_WRITER_NOT_MATCH);
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

const checkUserIdxIsOther = async (value, { req }) => {
    try {
        if (parseInt(value) === parseInt(req.verifiedToken.userIdx)) {
            return Promise.reject(responseMessage.PROFILE_USER_IDX_SAME_WITH_ME);
        }
    } catch (err) {
        Logger.error(err);
        return Promise.reject(validationErrorResponse(true, err));
    }
};

module.exports = {
    // checkUserStatusFunc,
    checkSnsIdDuplicate,
    checkAccessTokenEmpty,
    checkUserFollowMe,
    checkMyTravelExist,
    // checkTravelDateIsOver,
    // checkTravelDay,
    checkTravelStatusExceptPrivate,
    checkMyTravel,
    checkUserStatus,
    checkParameterIdxEqualMyIdx,
    checkBeforeReviewScore,
    checkMentionUserStatus,
    checkParentCommentAble,
    checkIsMyComment,
    checkUserIdxIsOther
};
