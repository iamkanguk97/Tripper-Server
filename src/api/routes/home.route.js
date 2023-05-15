const express = require('express');
const HomeController = require('../controllers/home.controller');

const router = express.Router();

router.get('/', HomeController.getHome);

router.get('/alarms', HomeController.getUserAlarms);

module.exports = router;
