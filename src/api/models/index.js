const Sequelize = require('sequelize');

const Travel = require('./Travel/Travel');
const TravelThumImage = require('./Travel/TravelThumImage');
const TravelLike = require('./Travel/TravelLike');
const TravelScore = require('./Travel/TravelScore');
const TravelDay = require('./Travel/TravelDay');
const TravelDayArea = require('./Travel/TravelDayArea');
const TravelDayAreaImage = require('./Travel/TravelDayAreaImage');
const User = require('./User/User');
const UserFollow = require('./User/UserFollow');

const env = process.env.NODE_ENV;
const dbConfig = require('../../config/database')[env];

const db = {};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

db.sequelize = sequelize;

// DB와 테이블 연결
db.Travel = Travel;
db.TravelImage = TravelThumImage;
db.TravelLike = TravelLike;
db.TravelScore = TravelScore;
db.TravelDay = TravelDay;
db.TravelDayArea = TravelDayArea;
db.TravelDayAreaImage = TravelDayAreaImage;

db.User = User;
db.UserFollow = UserFollow;

Travel.init(sequelize);
TravelThumImage.init(sequelize);
TravelLike.init(sequelize);
TravelScore.init(sequelize);
TravelDay.init(sequelize);
TravelDayArea.init(sequelize);
TravelDayAreaImage.init(sequelize);

User.init(sequelize);
UserFollow.init(sequelize);

User.associate(db);
UserFollow.associate(db);

module.exports = db;
