const Sequelize = require('sequelize');

module.exports = class Admin extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '관리자 고유값'
                },
                ADMIN_EMAIL: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    comment: '관리자 이메일'
                },
                ADMIN_NICKNAME: {
                    type: Sequelize.STRING(20),
                    allowNull: false,
                    comment: '관리자 닉네임'
                },
                ADMIN_PASSWORD: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                    comment: '관리자 암호화된 비밀번호'
                },
                ADMIN_STATUS: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                    defaultValue: 'ACTIVE',
                    comment: '관리자 상태값 (ACTIVE, WITHDRAW)'
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
                modelName: 'Admin',
                tableName: 'ADMIN',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    static associate(db) {
        db.Admin.hasOne(db.AdminSalt, {
            foreignKey: 'ADMIN_IDX',
            sourceKey: 'IDX',
            constraints: false
        });
    }
};
