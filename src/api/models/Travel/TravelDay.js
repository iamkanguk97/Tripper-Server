const Sequelize = require('sequelize');

module.exports = class TravelDay extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 고유값'
                },
                TRAVEL_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '여행 게시물 고유값'
                },
                TRAVEL_DAY_NUMBER: {
                    type: Sequelize.BIGINT,
                    allowNull: true,
                    comment: '여행 게시물 날짜정보 순서'
                },
                TRAVEL_DAY_DATE: {
                    type: Sequelize.DATEONLY,
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 날짜'
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
                modelName: 'TravelDay',
                tableName: 'TRAVEL_DAY',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }
};
