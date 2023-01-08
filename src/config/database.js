const { RDS } = require('../config/vars');

const development = {
    host: RDS.END_POINT,
    username: RDS.ID,
    password: RDS.PASSWORD,
    database: RDS.DATABASE,
    dialect: 'mysql'
};

const local = {
    host: RDS.END_POINT,
    username: RDS.ID,
    password: RDS.PASSWORD,
    database: RDS.DATABASE,
    dialect: 'mysql'
};

module.exports = {
    development,
    local
};