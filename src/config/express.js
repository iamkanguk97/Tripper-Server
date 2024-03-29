const express = require('express');
const cors = require('cors');
// const basicAuth = require('express-basic-auth');
const helmet = require('helmet');
const passport = require('passport');
const httpStatus = require('http-status');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const morganMiddleware = require('../api/middlewares/morganMiddleware');
const passportConfig = require('./passport');
const Logger = require('./logger');
const responseMessage = require('./response/baseResponseStatus');
const errorHandleMiddleware = require('../api/middlewares/errorHandleMiddleware');

const { errResponse } = require('./response/response-template');
const { sequelize } = require('../api/models/index');
// const { swaggerUi, specs } = require('./swagger');
// const { SWAGGER } = require('./vars');

const authRoutes = require('../api/routes/auth.route');
const userRoutes = require('../api/routes/user.route');
const travelRoutes = require('../api/routes/travel.route');
const commonRoutes = require('../api/routes/common.route');
const adminRoutes = require('../api/routes/admin.route');
const homeRoutes = require('../api/routes/home.route');

/**
 * Express instance
 * @public
 */
const app = express();

// Sequelize setting
sequelize
    .sync({
        // force: false // force가 true면 모든 table의 데이터를 초기화!
        alter: true
    })
    .then(() => {
        Logger.info('Success for DB Connection!');
    })
    .catch(err => {
        Logger.error(err);
    });

app.use(express.json()); // JSON 형태의 데이터 해석
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded 형태 데이터 해석

app.use(methodOverride()); // PUT, DELETE Method를 위한 library

app.use(helmet()); // HTTP Secure
app.use(cors()); // CORS
app.use(fileUpload()); // for file-upload

app.use(morganMiddleware);

app.use(passport.initialize());

// Setting API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/travels', travelRoutes);
app.use('/api/commons', commonRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/home', homeRoutes);

// Swagger
// app.use(
//     '/api-docs',
//     basicAuth({
//         users: { [SWAGGER.ID]: SWAGGER.PASSWORD },
//         challenge: true
//     }),
//     swaggerUi.serve,
//     swaggerUi.setup(specs, { explorer: true })
// );

// Passport setting
passportConfig();

// 404 NOT FOUND Middleware
app.use((req, res, next) => {
    const errMessage = responseMessage.API_NOT_FOUND;
    Logger.error(`API NOT FOUND! (${req.method} ${req.url})`);
    return res.status(httpStatus.NOT_FOUND).json(errResponse(errMessage));
    // next(res.status(httpStatus.NOT_FOUND).json(errResponse(errMessage)));
});

// Error Handler Middleware
app.use(errorHandleMiddleware);

module.exports = app;
