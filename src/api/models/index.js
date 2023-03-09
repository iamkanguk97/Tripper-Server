const Sequelize = require('sequelize');

const Travel = require('./Travel/Travel');
const TravelHashtag = require('./Travel/TravelHashtag');
const TravelImage = require('./Travel/TravelImage');
const TravelLike = require('./Travel/TravelLike');
const TravelScore = require('./Travel/TravelScore');
const User = require('./User/User');
const UserFollow = require('./User/UserFollow');
const Hashtag = require('./Hashtag');

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
db.TravelHashtag = TravelHashtag;
db.TravelImage = TravelImage;
db.TravelLike = TravelLike;
db.TravelScore = TravelScore;

db.User = User;
db.UserFollow = UserFollow;

db.Hashtag = Hashtag;

Travel.init(sequelize);
TravelHashtag.init(sequelize);
TravelImage.init(sequelize);
TravelLike.init(sequelize);
TravelScore.init(sequelize);

User.init(sequelize);
UserFollow.init(sequelize);

Hashtag.init(sequelize);

User.associate(db);
UserFollow.associate(db);

module.exports = db;
