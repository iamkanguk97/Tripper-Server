const Sequelize = require('sequelize');

/**
 * @swagger
 *  components:
 *      schemas:
 *          UserFollow:
 *              type: object
 *              required:
 *                  - IDX
 *                  - USER_IDX
 *                  - FOLLOW_TARGET_IDX
 *                  - CREATED_AT
 *                  - UPDATED_AT
 *              properties:
 *                  IDX:
 *                      type: integer
 *                      description: '사용자 팔로우 고유값'
 *                  USER_IDX:
 *                      type: integer
 *                      description: '사용자 고유값'
 *                  FOLLOW_TARGET_IDX:
 *                      type: integer
 *                      description: '팔로우를 당하는 사용자 고유값'
 *                  CREATED_AT:
 *                      type: timestamp
 *                      description: '등록 일자'
 *                  UPDATED_AT:
 *                      type: timestamp
 *                      description: '수정 일자'
 *              example:
 *                  IDX: 1
 *                  USER_IDX: 1
 *                  FOLLOW_TARGET_IDX: 2
 *                  CREATED_AT: '2022-01-01 13:00:00'
 *                  UPDATED_AT: '2022-01-01 13:00:00'
 */

module.exports = class Follow extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '사용자 팔로우 고유값'
                },
                USER_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '사용자 고유값'
                },
                FOLLOW_TARGET_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '팔로우를 당하는 사용자 고유값'
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
                modelName: 'UserFollow',
                tableName: 'USER_FOLLOW',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    static associate(db) {
        db.UserFollow.belongsTo(db.User, {
            foreignKey: 'USER_IDX',
            targetKey: 'IDX',
            constraints: false
        });
        db.UserFollow.belongsTo(db.User, {
            foreignKey: 'FOLLOW_TARGET_IDX',
            targetKey: 'IDX',
            constraints: false
        });
    }
};
