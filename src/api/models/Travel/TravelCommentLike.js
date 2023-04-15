const Sequelize = require('sequelize');

module.exports = class TravelCommentLike extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '여행 게시물 댓글 좋아요 고유값'
                },
                TRAVEL_COMMENT_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '여행 게시물 댓글 고유값'
                },
                LIKE_USER_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '좋아요를 누른 사용자 고유값'
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
                modelName: 'TravelCommentLike',
                tableName: 'TRAVEL_COMMENT_LIKE',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    // static associate(db) {}
};
