const Sequelize = require('sequelize');

module.exports = class TravelDayArea extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 장소 고유값'
                },
                TRAVEL_DAY_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 고유값'
                },
                AREA_NAME: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    comment: '여행 게시물 날짜정보 장소 이름'
                },
                AREA_ADDRESS: {
                    type: Sequelize.STRING(200),
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 장소 주소'
                },
                AREA_CATEGORY: {
                    type: Sequelize.STRING(10),
                    allowNull: true,
                    comment: '여행 게시물 날짜정보 장소 카테고리'
                },
                AREA_LATITUDE: {
                    type: Sequelize.DECIMAL(18, 10),
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 장소 위도'
                },
                AREA_LONGITUDE: {
                    type: Sequelize.DECIMAL(18, 10),
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 장소 경도'
                },
                AREA_REVIEW: {
                    type: Sequelize.STRING(200),
                    allowNull: true,
                    comment: '여행 게시물 날짜정보 장소 리뷰'
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
                modelName: 'TravelDayArea',
                tableName: 'TRAVEL_DAY_AREA',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    // static associate(db) {}
};
