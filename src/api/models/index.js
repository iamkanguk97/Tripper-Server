const Sequelize = require('sequelize');

const Travel = require('./Travel/Travel');
const TravelThumImage = require('./Travel/TravelThumImage');
const TravelLike = require('./Travel/TravelLike');
const TravelScore = require('./Travel/TravelScore');
const TravelDay = require('./Travel/TravelDay');
const TravelDayArea = require('./Travel/TravelDayArea');
const TravelDayAreaImage = require('./Travel/TravelDayAreaImage');
const TravelComment = require('./Travel/TravelComment');
const TravelCommentLike = require('./Travel/TravelCommentLike');
const TravelCommentMention = require('./Travel/TravelCommentMention');
const User = require('./User/User');
const UserFollow = require('./User/UserFollow');
const Admin = require('./Admin/Admin');
const AdminSalt = require('./Admin/AdminSalt');
const Report = require('./Report/Report');
const ReportImage = require('./Report/ReportImage');
const ReportType = require('./Report/ReportType');

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
db.TravelComment = TravelComment;
db.TravelCommentLike = TravelCommentLike;
db.TravelCommentMention = TravelCommentMention;

db.User = User;
db.UserFollow = UserFollow;

db.Admin = Admin;
db.AdminSalt = AdminSalt;

db.Report = Report;
db.ReportImage = ReportImage;
db.ReportType = ReportType;

Travel.init(sequelize);
TravelThumImage.init(sequelize);
TravelLike.init(sequelize);
TravelScore.init(sequelize);
TravelDay.init(sequelize);
TravelDayArea.init(sequelize);
TravelDayAreaImage.init(sequelize);
TravelComment.init(sequelize);
TravelCommentLike.init(sequelize);
TravelCommentMention.init(sequelize);

User.init(sequelize);
UserFollow.init(sequelize);

Admin.init(sequelize);
AdminSalt.init(sequelize);

Report.init(sequelize);
ReportImage.init(sequelize);
ReportType.init(sequelize);

User.associate(db);
UserFollow.associate(db);

Admin.associate(db);
AdminSalt.associate(db);

module.exports = db;
