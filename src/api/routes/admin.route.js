const express = require('express');
const AdminController = require('../controllers/admin.controller');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

// 관리자 회원가입 API
router.post('/sign-up', wrapAsync(AdminController.signUp));

// 관리자 로그인 API
router.post('/login', AdminController.login);

module.exports = router;
