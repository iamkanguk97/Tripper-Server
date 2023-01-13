const Sequelize = require('sequelize');

module.exports = class TravelHashtag extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            IDX: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: '여행 게시물 해시태그 고유값'
            },
            TRAVEL_IDX: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '여행 게시물 고유값'
            },
            HASHTAG_IDX: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '해시태그 고유값'
            },
            TRAVEL_HASHTAG_STATUS: {
                type: Sequelize.CHAR(1),
                allowNull: false,
                defaultValue: 'Y',
                comment: '여행 게시물 해시태그 상태값'
            },
            CREATED_AT: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: '생성 일자'
            },
            UPDATED_AT: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: '수정 일자'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'TravelHashtag',
            tableName: 'TRAVEL_HASHTAG',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // static associate(db) {}
};