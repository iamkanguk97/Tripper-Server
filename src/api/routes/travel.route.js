/**
 * @swagger
 * tags:
 *  name: Travel
 *  description: 게시물 관련 기능 리스트
 */

'use strict';
const express = require('express');
const TravelController = require('../controllers/travel.controller');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { wrapAsync } = require('../utils/util');
const { updateTravelStatusValidation } = require('../middlewares/validations/travel.validation');

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/travels/:
 *      post:
 *          summary: '게시물 생성 API'
 *          tags: [Travel]
 */
router.post(
    '/',
    validationMiddleware,
    jwtMiddleware,
    TravelController.createTravel
);

/**
 * @swagger
 * paths:
 *  /api/travels/{travelIdx}/status:
 *      patch:
 *          summary: '게시물 공개범위 수정 API'
 *          tags: [Travel]
 */
router.patch(
    '/:travelIdx/status',
    jwtMiddleware,
    updateTravelStatusValidation,
    validationMiddleware,
    wrapAsync(TravelController.updateTravelStatus)
);   // 게시물 공개 범위 수정 API

module.exports = router;