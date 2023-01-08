const Sequelize = require('sequelize');

// TODO: 사용자 프로필 사진 컬럼 추가 필요!
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            IDX: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: '사용자 고유값'
            },
            USER_EMAIL: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: '사용자 이메일 (카카오 이메일)'
            },
            USER_NICKNAME: {
                type: Sequelize.STRING(10),
                allowNull: false,
                comment: '사용자 닉네임 (회원가입 시 설정)'
            },
            USER_KAKAO_ID: {
                type: Sequelize.STRING(30),
                allowNull: false,
                comment: '사용자 카카오 고유값'
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
            CREATED_AT: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                comment: '생성 일자'
            },
            UPDATED_AT: {
                type: 'TIMESTAMP',
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
                comment: '수정 일자'
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'USER',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // static associate(db) {}
};