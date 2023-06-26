const express = require('express');
const CommonController = require('../controllers/common.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { searchAreaValidation } = require('../middlewares/validations/common.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

// 장소검색 API (OK)
router.get('/search-area', searchAreaValidation, validationMiddleware, wrapAsync(CommonController.searchArea));

// 지도검색 API
router.get('/search-map');

module.exports = router;
