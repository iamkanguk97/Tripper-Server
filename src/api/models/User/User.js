const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                IDX: {
                    type: Sequelize.BIGINT,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                    comment: '사용자 고유값'
                },
                USER_EMAIL: {
                    type: Sequelize.STRING(50),
                    allowNull: true,
                    comment: '사용자 이메일'
                },
                USER_NICKNAME: {
                    type: Sequelize.STRING(10),
                    allowNull: false,
                    comment: '사용자 닉네임 (회원가입 시 설정)'
                },
                USER_PROFILE_IMAGE: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                    comment: '사용자 프로필 이미지 링크 (S3 링크)'
                },
                USER_SNS_ID: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                    comment: '사용자 소셜로그인 고유값'
                },
                USER_AGE_GROUP: {
                    type: Sequelize.STRING(10),
                    allowNull: true,
                    comment: '사용자 연령대'
                },
                USER_GENDER: {
                    type: Sequelize.CHAR(1),
                    allowNull: true,
                    comment: '사용자 성별'
                },
                USER_PROVIDER: {
                    type: Sequelize.CHAR(1),
                    allowNull: false,
                    comment: '사용자 로그인 타입 (K: 카카오, N: 네이버)'
                },
                USER_STATUS: {
                    type: Sequelize.CHAR(1),
                    allowNull: false,
                    defaultValue: 'A',
                    comment: '사용자 상태 (A: 활성화됨, D: 탈퇴됨)'
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
                modelName: 'User',
                tableName: 'USER',
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    static associate(db) {
        db.User.hasMany(db.UserFollow, {
            foreignKey: 'USER_IDX',
            sourceKey: 'IDX',
            constraints: false
        });
        db.User.hasMany(db.UserFollow, {
            foreignKey: 'FOLLOW_TARGET_IDX',
            sourceKey: 'IDX',
            constraints: false
        });
    }
};
