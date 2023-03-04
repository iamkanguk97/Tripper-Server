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
 *          security:
 *              - JWT: []
 *          summary: '게시물 공개범위 수정 API'
 *          description: '게시물을 공개 또는 비공개 상태로 변환할 수 있는 기능입니다. 본인 게시물만 가능합니다.'
 *          tags: [Travel]
 *          parameters:
 *              - in: param
 *                name: travelIdx
 *                required: true
 *                description: '게시물 고유값'
 *                schema:
 *                  type: integer
 *                  example: 1
 *          responses:
 *              '200':
 *              '401':
 *              '500':
 *              '2027':
 *              '3014':
 */
router.patch(
    '/:travelIdx/status',
    jwtMiddleware,
    updateTravelStatusValidation,
    validationMiddleware,
    wrapAsync(TravelController.updateTravelStatus)
);   // 게시물 공개 범위 수정 API

module.exports = router;