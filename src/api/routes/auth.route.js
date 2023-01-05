const express = require('express');
// const validate = require('../middlewares/validate');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/verify-nickname', authController.verifyNickname);   // 닉네임 확인 API

module.exports = router;