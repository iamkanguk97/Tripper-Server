const { Op, QueryTypes } = require('sequelize');
const UserFollow = require('../models/User/UserFollow');
const { sequelize } = require('../models/index');
const {
    myFollowingQuery,
    myFollowerQuery,
    otherFollowingQuery,
    otherFollowerQuery
} = require('../queries/user.query');

const follow = async (myIdx, followUserIdx) => {
    // ORM CRUD에 적용되는 옵션이 다 동일하기 때문에 하나의 변수로 빼놓음.
    const whereOption = {
        [Op.and]: [{ USER_IDX: myIdx }, { FOLLOW_TARGET_IDX: followUserIdx }]
    };

    // 본인과 팔로우 신청 받은 사람과 현재의 팔로우 관계를 DB에서 가져옴.
    let checkRelation = await UserFollow.findOne({
        attributes: ['IDX'],
        where: whereOption
    });
    checkRelation = !checkRelation ? 'N' : 'Y'; // NULL이면 'N' 처리

    /**
     * checkRelation === 'N'
     *  - 팔로우를 새로 생성하는 부분 (팔로우 요청)
     *  - INSERT를 통해 새로운 ROW 생성
     *
     * checkRelation === 'Y'
     *  - 팔로우 취소
     *  - DELETE? UPDATE? => DELETE 확정
     *      - STATUS로 값을 처리할까 했었는데 사실 불필요한 데이터기 때문에 물리적으로 삭제해도 괜찮을거 같음.
     */
    let rm = '';
    if (checkRelation === 'N') {
        await UserFollow.create({
            USER_IDX: myIdx,
            FOLLOW_TARGET_IDX: followUserIdx
        });
        rm = '팔로우 요청 성공';
    } else {
        await UserFollow.destroy({ where: whereOption });
        rm = '팔로우 취소 성공';
    }

    return rm;
};

const followList = async (myIdx, userIdx, option) => {
    let listResult = null;
    let query = null;

    // TODO: 추후 클라이언트랑 협의해서 페이징 적용필요

    if (!userIdx) {
        // 상대방 고유값이 없음 -> 본인의 팔로잉 또는 팔로워 조회
        query = option === 'following' ? myFollowingQuery : myFollowerQuery;
    } else {
        // 상대방 고유값이 있음 -> 상대방의 팔로잉 또는 팔로워 조회
        query = option === 'following' ? otherFollowingQuery : otherFollowerQuery;
    }

    listResult = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
            myIdx: 11,
            userIdx: 16
            // myIdx: myIdx
            // userIdx: userIdx
        }
    });

    return listResult;
};

const deleteFollower = async (myIdx, userIdx) => {
    const deleteFollowerResult = await UserFollow.destroy({
        where: {
            [Op.and]: [{ USER_IDX: userIdx }, { FOLLOW_TARGET_IDX: myIdx }]
        }
    });

    if (!deleteFollowerResult)
        // 삭제된 데이터가 없거나 잘못된 문법 사용?
        throw new Error('[User->deleteFollower] 삭제된 데이터가 없거나 잘못된 문법 사용!');
    else return userIdx;
};

module.exports = {
    follow,
    followList,
    deleteFollower
};
