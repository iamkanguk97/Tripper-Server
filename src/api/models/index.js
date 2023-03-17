const Sequelize = require('sequelize');

const Travel = require('./Travel/Travel');
const TravelHashtag = require('./Travel/TravelHashtag');
const TravelThumImage = require('./Travel/TravelThumImage');
const TravelLike = require('./Travel/TravelLike');
const TravelScore = require('./Travel/TravelScore');
const User = require('./User/User');
const UserFollow = require('./User/UserFollow');
const Hashtag = require('./Hashtag');

const env = process.env.NODE_ENV;
const dbConfig = require('../../config/database')[env];

const db = {};

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

db.sequelize = sequelize;

// DB와 테이블 연결
db.Travel = Travel;
db.TravelHashtag = TravelHashtag;
db.TravelImage = TravelThumImage;
db.TravelLike = TravelLike;
db.TravelScore = TravelScore;

db.User = User;
db.UserFollow = UserFollow;

db.Hashtag = Hashtag;

Travel.init(sequelize);
TravelHashtag.init(sequelize);
TravelThumImage.init(sequelize);
TravelLike.init(sequelize);
TravelScore.init(sequelize);

User.init(sequelize);
UserFollow.init(sequelize);

Hashtag.init(sequelize);

User.associate(db);
UserFollow.associate(db);

module.exports = db;
