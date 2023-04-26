const Sequelize = require('sequelize');

module.exports = class AdminSalt extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '관리자 소금값 고유값'
                },
                ADMIN_IDX: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    comment: '관리자 고유값'
                },
                SALT: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    comment: '관리자 소금값'
                }
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'AdminSalt',
                tableName: 'ADMIN_SALT',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    // static associate(db) {}
};
