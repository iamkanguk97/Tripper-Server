const Sequelize = require('sequelize');

module.exports = class TravelLike extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            IDX: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: '여행 게시물 좋아요 고유값'
            },
            TRAVEL_IDX: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '여행 게시물 고유값'
            },
            USER_IDX: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '사용자 고유값'
            },
            TRAVEL_LIKE_STATUS: {
                type: Sequelize.CHAR(1),
                allowNull: false,
                defaultValue: 'Y',
                comment: '여행 게시물 좋아요 상태'
            },
            CREATED_AT: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            UPDATED_AT: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'TravelLike',
            tableName: 'TRAVEL_LIKE',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // static associate(db) {}
}