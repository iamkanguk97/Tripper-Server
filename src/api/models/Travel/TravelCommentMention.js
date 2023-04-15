const Sequelize = require('sequelize');

module.exports = class TravelCommentMention extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '여행 게시물 댓글 언급 고유값'
                },
                TRAVEL_COMMENT_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '여행 게시물 댓글 고유값'
                },
                MENTION_USER_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '언급받은 사용자 고유값'
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
                modelName: 'TravelCommentMention',
                tableName: 'TRAVEL_COMMENT_MENTION',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    // static associate(db) {}
};
