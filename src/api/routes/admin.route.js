const express = require('express');
const AdminController = require('../controllers/admin.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { wrapAsync } = require('../utils/util');
const { adminSignUpValidation } = require('../middlewares/validations/admin.validation');

const router = express.Router();

// 관리자 회원가입 API
router.post(
    '/sign-up',
    adminSignUpValidation,
    validationMiddleware,
    wrapAsync(AdminController.signUp)
);

// 관리자 로그인 API
router.post('/login', AdminController.login);

module.exports = router;
