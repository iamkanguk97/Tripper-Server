const express = require('express');
const AdminController = require('../controllers/admin.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { wrapAsync } = require('../utils/util');
const { adminSignUpValidation, adminLoginValidation, getReportDetailValidation } = require('../middlewares/validations/admin.validation');
const pageValidation = require('../middlewares/validations/page.validation');

const router = express.Router();

router.post('/sign-up', [adminSignUpValidation, validationMiddleware], wrapAsync(AdminController.signUp)); // 관리자 회원가입 API
router.post('/login', [adminLoginValidation, validationMiddleware], wrapAsync(AdminController.login)); // 관리자 로그인 API
router.get('/reports', [pageValidation, validationMiddleware], wrapAsync(AdminController.getReports)); // 신고 조회 API
router.get('/report-detail', [getReportDetailValidation, validationMiddleware], wrapAsync(AdminController.getReportDetail)); // 신고 상세조회 API

module.exports = router;
