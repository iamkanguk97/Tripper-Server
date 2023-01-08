const Sequelize = require('sequelize');

const Travel = require('./Travel');
const TravelLike = require('./TravelLike');
const Follow = require('./Follow');
const User = require('./User');

const env = process.env.NODE_ENV;
const db_config = require('../../config/database')[env];
const db = {};

const sequelize = new Sequelize(
  db_config.database, 
  db_config.username,
  db_config.password,
  db_config
);

db.sequelize = sequelize;

// DB와 테이블 연결
db.Travel = Travel;
db.TravelLike = TravelLike;
db.Follow = Follow;
db.User = User;

Travel.init(sequelize);
TravelLike.init(sequelize);
Follow.init(sequelize);
User.init(sequelize);

module.exports = db;