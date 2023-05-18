const express = require('express');
const TravelController = require('../controllers/travel.controller');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { wrapAsync } = require('../utils/util');
const {
    updateTravelStatusValidation,
    createTravelValidation,
    deleteTravelValidation,
    createTravelReviewScoreValidation,
    createTravelLikeValidation,
    createTravelCommentValidation,
    deleteTravelCommentValidation,
    selectTravelCommentValidation
} = require('../middlewares/validations/travel.validation');

const router = express.Router();

// 게시물 생성 API
router.post(
    '/',
    jwtMiddleware,
    createTravelValidation,
    validationMiddleware,
    wrapAsync(TravelController.createTravel)
);

// 게시물 삭제 API
// TODO: 특정 기간동안 보관했다가 삭제할 것인지, 아니면 바로 삭제할 것인지에 따라 HTTP METHOD가 다를듯 (DELETE / PATCH)
// 지금은 PATCH로 진행
router.patch(
    '/',
    jwtMiddleware,
    deleteTravelValidation,
    validationMiddleware,
    wrapAsync(TravelController.deleteTravel)
);

// 게시물 공개 범위 수정 API
router.patch(
    '/status',
    jwtMiddleware,
    updateTravelStatusValidation,
    validationMiddleware,
    wrapAsync(TravelController.updateTravelStatus)
);

// 게시물 평점등록 API -> 등록한 평점은 삭제할수는 없음.
router.post(
    '/review-score',
    jwtMiddleware,
    createTravelReviewScoreValidation,
    validationMiddleware,
    wrapAsync(TravelController.createTravelReviewScore)
);

// 게시물 좋아요 API (OK)
router.post(
    '/like',
    jwtMiddleware,
    createTravelLikeValidation,
    validationMiddleware,
    wrapAsync(TravelController.createTravelLike)
);

// 게시물 댓글 조회 API
router.get(
    '/comments',
    jwtMiddleware,
    selectTravelCommentValidation,
    validationMiddleware,
    wrapAsync(TravelController.getTravelComments)
);

// 게시물 댓글 생성 API
router.post(
    '/comments',
    jwtMiddleware,
    createTravelCommentValidation,
    validationMiddleware,
    wrapAsync(TravelController.createTravelComment)
);

// 게시물 댓글 수정 API
// router.patch(
//     '/update-comment',
//     jwtMiddleware,
//     updateTravelCommentValidation,
//     validationMiddleware,
//     wrapAsync(TravelController.updateTravelComment)
// );

// 게시물 댓글 삭제 API
router.patch(
    '/delete-comment',
    jwtMiddleware,
    deleteTravelCommentValidation,
    validationMiddleware,
    wrapAsync(TravelController.deleteTravelComment)
);

// 특정 게시물 조회 API
router.get('/', TravelController.getTravelDetail);

module.exports = router;
