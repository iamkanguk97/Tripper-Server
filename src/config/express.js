const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { sequelize } = require('../api/models/index');
const { swaggerUi, specs } = require('../config/swagger');

const authRoutes = require('../api/routes/auth.route');
const userRoutes = require('../api/routes/user.route');

/**
* Express instance
* @public
*/
const app = express();

// Sequelize setting
sequelize.sync({
    force: false   // force가 true면 모든 table의 데이터를 초기화!
}).then(() => {
    console.log('Success for DB Connection!');
}).catch((err) => {
    console.log(err);
});

app.use(express.json());   // JSON 형태의 데이터 해석
app.use(express.urlencoded({ extended: true }));   // x-www-form-urlencoded 형태 데이터 해석

app.use(helmet());   // HTTP Secure
app.use(cors());   // CORS

// Setting API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

module.exports = app;