const path = require('path');
require('dotenv').config({ path: path.join(__dirname, `/envs/.env.${process.env.NODE_ENV}`) });

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    RDS: {
        END_POINT: process.env.RDS_ENDPOINT,
        PORT: process.env.RDS_PORT,
        ID: process.env.RDS_ID,
        PASSWORD: process.env.RDS_PASSWORD,
        DATABASE: process.env.RDS_DATABASE
    }
};