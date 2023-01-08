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
                comment: '여행 게시물 작성자 고유값'
            },
            TRAVEL_TITLE: {
                type: Sequelize.STRING(50),
                comment: '여행 게시물 제목'  
            },
            TRAVEL_INTRO: {
                type: Sequelize.STRING(200),
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
                type: Sequelize.DATEONLY,
                allowNull: false,
                comment: '여행 이동 수단 (W: 도보, B: 자전거, P: 대중교통, C: 자차)'
            },
            TRAVEL_STATUS: {
                type: Sequelize.DATEONLY,
                comment: '여행 게시물 상태값 (A: 공개, B: 비공개, C: 삭제)'
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
            modelName: 'Travel',
            tableName: 'TRAVEL',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    // static associate(db) {}
};