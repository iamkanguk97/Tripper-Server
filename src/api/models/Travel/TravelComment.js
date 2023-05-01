const Sequelize = require('sequelize');

module.exports = class TravelComment extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '여행 게시물 댓글 고유값'
                },
                USER_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '여행 게시물 댓글 작성자 고유값'
                },
                TRAVEL_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '여행 게시물 고유값'
                },
                SUPER_COMMENT_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: true,
                    comment: '여행 게시물 부모댓글 고유값'
                },
                COMMENT_TEXT: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: '여행 게시물 댓글 내용'
                },
                STATUS: {
                    type: Sequelize.CHAR(1),
                    allowNull: false,
                    defaultValue: 'A',
                    comment: '여행 게시물 댓글 상태'
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
                modelName: 'TravelComment',
                tableName: 'TRAVEL_COMMENT',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    // static associate(db) {}
};
