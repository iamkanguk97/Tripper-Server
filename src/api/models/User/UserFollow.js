const Sequelize = require('sequelize');

module.exports = class Follow extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            IDX: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: '사용자 팔로우 고유값'
            },
            USER_IDX: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '사용자 고유값'
            },
            FOLLOW_TARGET_IDX: {
                type: Sequelize.INTEGER,
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
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'UserFollow',
            tableName: 'USER_FOLLOW',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // static associate(db) {}
};