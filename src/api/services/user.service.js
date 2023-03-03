'use strict';
const UserFollow = require('../models/User/UserFollow');
const { Op } = require('sequelize');

const follow = async (myIdx, followUserIdx) => {
    // ORM CRUD에 적용되는 옵션이 다 동일하기 때문에 하나의 변수로 빼놓음.
    const whereOption = {
        [Op.and]: [
            { USER_IDX: myIdx },
            { FOLLOW_TARGET_IDX: followUserIdx }  
        ]
    };

    // 본인과 팔로우 신청 받은 사람과 현재의 팔로우 관계를 DB에서 가져옴.
    let checkRelation = await UserFollow.findOne({
        attributes: ['IDX'],
        where: whereOption
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
    // Response로 줘야할 값: 사용자 인덱스, 사용자 닉네임, 사용자 프로필 사진, 내가 지금 팔로우 하고있는지에 대한 정보
    // option = following (USER_IDX가 myIdx), option = follower (FOLLOW_TARGET_IDX가 myIdx)
    
    const _userIdx = !userIdx ? myIdx : userIdx;
    let listResult = await UserFollow.findAll({
        
    });

    // let followListResult = await UserFollow.findAll({
    //     include: [{
    //         model: User,
    //         attributes: [ 'IDX', 'USER_NICKNAME', 'USER_PROFILE_IMAGE' ],
    //         required: true
    //     }],
    //     where: {
    //         IDX: 15
    //     },
    // });

    // followListResult = followListResult.map(el => el.get({ plain: true }));
    // console.log(followListResult);
    // // console.log(followListResult[0].dataValues);
    // // console.log(followListResult[0]);
};

const deleteFollower = async (myIdx, userIdx) => {
    await UserFollow.destroy({
        where: {
            USER_IDX: userIdx,
            FOLLOW_TARGET_IDX: myIdx
        }
    });

    return parseInt(userIdx);   // 삭제한 팔로워의 userIdx
};

module.exports = {
    follow,
    followList,
    deleteFollower
};