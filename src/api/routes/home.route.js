const express = require('express');
const HomeController = require('../controllers/home.controller');
const { homeValidation } = require('../middlewares/validations/home.validation');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get('/', [homeValidation, validationMiddleware], HomeController.getHome); // 홈화면 조회 API
// router.get('/alarms', HomeController.getUserAlarms);

module.exports = router;
