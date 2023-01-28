const { RDS } = require('../config/vars');

const development = {
    host: RDS.END_POINT,
    username: RDS.ID,
    password: RDS.PASSWORD,
    database: RDS.DATABASE,
    dialect: 'mysql',
    logging: true   // console에 sequelize log 출력 여부
};

const local = {
    host: RDS.END_POINT,
    username: RDS.ID,
    password: RDS.PASSWORD,
    database: RDS.DATABASE,
    dialect: 'mysql',
    logging: false
};

module.exports = {
    development,
    local
};