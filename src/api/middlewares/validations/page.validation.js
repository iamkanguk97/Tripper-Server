const { query } = require('express-validator');
const responseMessage = require('../../../config/response/baseResponseStatus');

/**
 * @title Pagination을 위한 Validation
 * @query page, size
 * - @desc 1부터 30이하로 입력 확인
 *
 * 참고)
 * LIMIT: 출력할 행의 수
 * OFFSET: 가져올 데이터의 초기 위치값
 */
const pageValidation = [
    query('page')
        .optional()
        .isInt({ min: 1, max: 30 })
        .withMessage(responseMessage.PAGE_NUMBER_ERROR)
        .bail(),
    query('size')
        .optional()
        .isInt({ min: 1, max: 30 })
        .withMessage(responseMessage.PAGE_SIZE_ERROR)
        .bail()
];

module.exports = pageValidation;
