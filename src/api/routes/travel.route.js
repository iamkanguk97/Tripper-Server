const express = require('express');
const TravelController = require('../controllers/travel.controller');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { wrapAsync } = require('../utils/util');
const {
    updateTravelStatusValidation,
    createTravelValidation,
    createTravelReviewScoreValidation,
    createTravelLikeValidation
} = require('../middlewares/validations/travel.validation');

const router = express.Router();

// 게시물 생성 API
router.post(
    '/',
    createTravelValidation,
    validationMiddleware,
    jwtMiddleware,
    TravelController.createTravel
);

// 게시물 공개 범위 수정 API (OK)
router.patch(
    '/:travelIdx/status',
    jwtMiddleware,
    updateTravelStatusValidation,
    validationMiddleware,
    wrapAsync(TravelController.updateTravelStatus)
);

// 게시물 평점등록 API
router.post(
    '/review-score',
    jwtMiddleware,
    createTravelReviewScoreValidation,
    validationMiddleware,
    wrapAsync(TravelController.createTravelReviewScore)
);

// 게시물 좋아요 API
router.post(
    '/like',
    jwtMiddleware,
    createTravelLikeValidation,
    validationMiddleware,
    wrapAsync(TravelController.createTravelLike)
);

module.exports = router;
