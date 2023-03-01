/**
 * @swagger
 * tags:
 *  name: Common
 *  description: 이외 기능 리스트 (장소검색 등 공공 API)
 */

'use strict';
const express = require('express');
const CommonController = require('../controllers/common.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { searchAreaValidation } = require('../middlewares/validations/common.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/commons/search-area:
 *      get:
 *          summary: '장소검색 API'
 *          tags: [Common]
 */
router.get(
    '/search-area',
    searchAreaValidation,
    validationMiddleware,
    wrapAsync(CommonController.searchArea)
);

module.exports = router;