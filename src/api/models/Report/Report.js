const Sequelize = require('sequelize');

module.exports = class Report extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '신고 고유값'
                },
                USER_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '신고자 고유값'
                },
                ADMIN_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: true,
                    comment: '관리자 고유값'
                },
                REPORTED_TRAVEL_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: true,
                    comment: '신고대상 게시물 고유값'
                },
                REPORTED_COMMENT_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: true,
                    comment: '신고대상 게시물 댓글 고유값'
                },
                REPORT_TYPE_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '신고 유형 고유값'
                },
                REPORT_SUBJECT: {
                    type: Sequelize.STRING(50),
                    allowNull: false,
                    comment: '신고 주제'
                },
                REPORT_CONTENT: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: '신고 내용'
                },
                REPORT_RESPONSE_CONTENT: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: '신고 답변 내용'
                },
                REPORT_RESPONSE_STATUS: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                    defaultValue: 'WAITING',
                    comment: '신고 답변 상태 (WAITING / COMPLETE)'
                },
                RESPONSE_AT: {
                    type: 'TIMESTAMP',
                    allowNull: true,
                    comment: '신고 답변 일시'
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
                modelName: 'Report',
                tableName: 'REPORT',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }
};
