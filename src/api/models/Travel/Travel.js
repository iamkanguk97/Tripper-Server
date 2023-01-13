const Sequelize = require('sequelize');

module.exports = class Travel extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            IDX: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
                comment: '여행 게시물 고유값'
            },
            USER_IDX: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: '여행 게시물 작성자 고유값'
            },
            TRAVEL_TITLE: {
                type: Sequelize.STRING(50),
                allowNull: false,
                comment: '여행 게시물 제목'  
            },
            TRAVEL_INTRO: {
                type: Sequelize.STRING(200),
                allowNull: true,
                comment: '여행 게시물 소개글'
            },
            TRAVEL_START_DATE: {
                type: Sequelize.DATEONLY,
                allowNull: false,
                comment: '여행 시작 날짜'
            },
            TRAVEL_END_DATE: {
                type: Sequelize.DATEONLY,
                allowNull: false,
                comment: '여행 종료 날짜'
            },
            TRAVEL_MOVE_METHOD: {
                type: Sequelize.CHAR(1),
                allowNull: false,
                comment: '여행 이동 수단 (W: 도보, B: 자전거, P: 대중교통, C: 자차)'
            },
            TRAVEL_STATUS: {
                type: Sequelize.CHAR(1),
                allowNull: false,
                defaultValue: 'A',
                comment: '여행 게시물 상태값 (A: 공개, B: 비공개, C: 삭제)'
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
            modelName: 'Travel',
            tableName: 'TRAVEL',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // static associate(db) {}
};