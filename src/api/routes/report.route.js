const express = require('express');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const ReportController = require('../controllers/report.controller');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

// 신고하기 API
router.post('/', jwtMiddleware, wrapAsync(ReportController.createReport));

module.exports = router;
