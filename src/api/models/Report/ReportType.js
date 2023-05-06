const Sequelize = require('sequelize');

module.exports = class ReportType extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '신고 유형 고유값'
                },
                REPORT_TYPE_NAME: {
                    type: Sequelize.STRING(15),
                    allowNull: false,
                    comment: '신고 유형 내용'
                },
                STATUS: {
                    type: Sequelize.STRING(1),
                    allowNull: false,
                    defaultValue: 'A',
                    comment: '데이터 상태값'
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
                modelName: 'ReportType',
                tableName: 'REPORT_TYPE',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }
};
