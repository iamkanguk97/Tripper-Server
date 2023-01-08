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
            FOLLOW_STATUS: {
                type: Sequelize.CHAR(1),
                allowNull: false,
                defaultValue: 'Y',
                comment: '팔로우 상태 (Y: 활성화, N: 비활성화)'
            },
            CREATED_AT: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            UPDATED_AT: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Follow',
            tableName: 'FOLLOW',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // static associate(db) {}
};