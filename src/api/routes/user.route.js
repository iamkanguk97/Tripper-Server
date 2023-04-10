const express = require('express');
const UserController = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const {
    followValidation,
    followListValidation,
    deleteFollowerValidation,
    getProfileValidation
} = require('../middlewares/validations/user.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

// 팔로우 API
router.post(
    '/following',
    jwtMiddleware,
    followValidation,
    validationMiddleware,
    wrapAsync(UserController.follow)
);

// 팔로잉 또는 팔로워 조회 API
router.get(
    '/follow-list',
    jwtMiddleware,
    followListValidation,
    validationMiddleware,
    wrapAsync(UserController.followList)
);

// 본인 팔로워 삭제 API (OK)
router.delete(
    '/follower',
    jwtMiddleware,
    deleteFollowerValidation,
    validationMiddleware,
    wrapAsync(UserController.deleteFollower)
);

// 마이페이지 조회 API
router.get('/my-page', jwtMiddleware, wrapAsync(UserController.getMyPage));

// 마이페이지 수정 API
router.put('/my-page', jwtMiddleware, validationMiddleware, wrapAsync(UserController.updateMyPage));

// 상대방 프로필 조회 API
router.get(
    '/:userIdx/profile',
    jwtMiddleware,
    getProfileValidation,
    validationMiddleware,
    wrapAsync(UserController.getProfile)
);

module.exports = router;
