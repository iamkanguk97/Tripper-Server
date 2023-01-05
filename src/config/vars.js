const path = require('path');
require('dotenv').config({ path: path.join(__dirname, `/envs/.env.${process.env.NODE_ENV}`) });

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
};