const Logger = require('../../config/logger');
const User = require('../models/User/User');
const UserFollow = require('../models/User/UserFollow');

const follow = async (myIdx, followUserIdx) => { 
    // ORM CRUD에 적용되는 옵션이 다 동일하기 때문에 하나의 변수로 빼놓음.
    const option = {
        USER_IDX: myIdx,
        FOLLOW_TARGET_IDX: followUserIdx
    };

    // 본인과 팔로우 신청 받은 사람과 현재의 팔로우 관계를 DB에서 가져옴.
    let checkRelation = await UserFollow.findOne({
        attributes: ['IDX'],
        where: option
    });
    checkRelation = !checkRelation ? 'N' : 'Y';   // NULL이면 'N' 처리
    
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
        await UserFollow.create(option);
        rm = '팔로우 요청 성공';
    } else {
        await UserFollow.destroy({ where: option });
        rm = '팔로우 취소 성공';
    }

    return rm;
};

const followList = async (myIdx, userIdx, option) => {
    const _userIdx = !userIdx ? myIdx : userIdx;

    let followListResult = await UserFollow.findAll({
        where: {
            [ option === 'following' ? 'USER_IDX' : 'FOLLOW_TARGET_IDX' ]: _userIdx,
        }
    });
    console.log(followListResult);
};

module.exports = {
    follow,
    followList
};