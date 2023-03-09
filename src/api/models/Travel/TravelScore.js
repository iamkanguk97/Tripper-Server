const Sequelize = require('sequelize');

module.exports = class TravelScore extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '여행 게시물 점수 고유값'
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
                TRAVEL_SCORE: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    comment: '사용자가 부여한 여행 게시물 점수 (1점 ~ 5점)'
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
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'TravelScore',
                tableName: 'TRAVEL_SCORE',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    // static associate(db) {}
};
