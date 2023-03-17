const Sequelize = require('sequelize');

module.exports = class TravelThumImage extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '여행 게시물 썸네일 이미지 고유값'
                },
                TRAVEL_IDX: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    comment: '여행 게시물 고유값'
                },
                TRAVEL_IMAGE_URL: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    comment: '여행 게시물 썸네일 이미지 링크 (S3 링크)'
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
                modelName: 'TravelThumImage',
                tableName: 'TRAVEL_THUMNAIL_IMAGE',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    // static associate(db) {}
};
