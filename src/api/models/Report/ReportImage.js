const Sequelize = require('sequelize');

module.exports = class ReportImage extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '신고 이미지 고유값'
                },
                REPORT_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '신고 고유값'
                },
                REPORT_IMAGE_URL: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    comment: '신고 이미지 링크'
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
                modelName: 'ReportImage',
                tableName: 'REPORT_IMAGE',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }
};
