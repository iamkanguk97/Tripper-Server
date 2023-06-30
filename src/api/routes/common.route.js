const express = require('express');
const CommonController = require('../controllers/common.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { searchAreaValidation } = require('../middlewares/validations/common.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

router.get('/search-area', [searchAreaValidation, validationMiddleware], wrapAsync(CommonController.searchArea)); // 장소검색 API

// 지도검색 API
router.get('/search-map');

module.exports = router;
