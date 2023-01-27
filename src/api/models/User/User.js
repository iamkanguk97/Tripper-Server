const Sequelize = require('sequelize');

/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              required:
 *                  - IDX
 *                  - USER_NICKNAME
 *                  - USER_KAKAO_ID
 *                  - USER_STATUS
 *                  - USER_PROVIDER
 *                  - CREATED_AT
 *                  - UPDATED_AT
 *              properties:
 *                  IDX:
 *                      type: integer
 *                      description: '사용자 고유값'
 *                  USER_EMAIL:
 *                      type: string
 *                      format: email
 *                      description: '사용자 이메일 (카카오에서 받아오는 이메일)'
 *                  USER_NICKNAME:
 *                      type: string
 *                      description: '사용자 닉네임 (회원가입 시 설정)'
 *                  USER_PROFILE_IMAGE:
 *                      type: string
 *                      description: '사용자 프로필 이미지 링크 (S3 링크)'
 *                  USER_KAKAO_ID:
 *                      type: string
 *                      description: '사용자 카카오 고유값'
 *                  USER_AGE_GROUP:
 *                      type: string
 *                      description: '사용자 연령대'
 *                  USER_GENDER:
 *                      type: char
 *                      description: '사용자 성별'
 *                  USER_STATUS:
 *                      type: char
 *                      description: '사용자 상태 (A: 활성화됨, D: 탈퇴됨)'
 *                  USER_PROVIDER:
 *                      type: char
 *                      description: '사용자 로그인 타입 (K: 카카오)'
 *                  CREATED_AT:
 *                      type: timestamp
 *                      description: '등록 일자'
 *                  UPDATED_AT:
 *                      type: timestamp
 *                      description: '수정 일자'
 *              example:
 *                  IDX: 1
 *                  USER_EMAIL: 'iamkanguk97@kakao.com'
 *                  USER_NICKNAME: '욱이'
 *                  USER_PROFILE_IMAGE: 'profileImage.com'
 *                  USER_KAKAO_ID: '123456678123'
 *                  USER_AGE_GROUP: '20대'
 *                  USER_GENDER: 'M'
 *                  USER_STATUS: 'A'
 *                  USER_PROVIDER: 'K'
 *                  CREATED_AT: '2022-01-01 13:00:00'
 *                  UPDATED_AT: '2022-01-01 13:00:00'
 */

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
                allowNull: true,
                comment: '사용자 이메일 (카카오 이메일)'
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
            USER_KAKAO_ID: {
                type: Sequelize.STRING(30),
                allowNull: true,
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
            USER_PROVIDER: {
                type: Sequelize.CHAR(1),
                allowNull: false,
                comment: '사용자 로그인 타입 (K: 카카오)'
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