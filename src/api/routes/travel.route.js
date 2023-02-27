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

module.exports = router;