const Sequelize = require('sequelize');

module.exports = class TravelDayAreaImage extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 장소 이미지 고유값'
                },
                TRAVEL_DAY_AREA_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 장소 고유값'
                },
                TRAVEL_DAY_AREA_IMAGE_URL: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    comment: '여행 게시물 날짜정보 장소 이미지 링크'
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
                modelName: 'TravelDayAreaImage',
                tableName: 'TRAVEL_DAY_AREA_IMAGE',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    // static associate(db) {}
};
