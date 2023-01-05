const express = require('express');
const helmet = require('helmet');

const authRoutes = require('../api/routes/auth.route');
const userRoutes = require('../api/routes/user.route');

/**
* Express instance
* @public
*/
const app = express();

app.use(express.json());   // JSON 형태의 데이터 해석
app.use(express.urlencoded({ extended: true }));   // x-www-form-urlencoded 형태 데이터 해석

app.use(helmet());

// Setting API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;