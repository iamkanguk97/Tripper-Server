/**
 * @swagger
 * tags:
 *  name: Common
 *  description: 이외 기능 리스트 (장소검색 등 공공 API)
 */
'use strict';
const express = require('express');
const CommonController = require('../controllers/common.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { searchAreaValidation } = require('../middlewares/validations/common.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/commons/search-area:
 *      get:
 *          summary: '장소검색 API'
 *          description: '게시물 작성시 사용되는 장소검색 API입니다. 카카오 Open API를 사용했습니다.'
 *          tags: [Common]
 *          parameters:
 *              - in: query
 *                name: area
 *                required: true
 *                description: '검색할 장소 키워드'
 *                schema:
 *                  type: string
 *                  example: '카카오프렌즈 강남역점'
 *              - in: query
 *                name: page
 *                required: false
 *                description: '검색할 페이지 번호'
 *                schema:
 *                  type: integer
 *                  example: 1
 *              - in: query
 *                name: lat
 *                required: true
 *                description: '사용자 위도 좌표'
 *                schema:
 *                  type: string
 *                  example: '37.4161231'
 *              - in: query
 *                name: lon
 *                required: true
 *                description: '사용자 경도 좌표'
 *                schema:
 *                  type: string
 *                  example: '126.610451151'
 *          responses:
 *              '200':
 *                  description: '요청 성공.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
 *                                  - result
 *                              properties:
 *                                  isSuccess:
 *                                      type: boolean
 *                                      example: true
 *                                  code:
 *                                      type: integer
 *                                      example: 200
 *                                  message:
 *                                      type: string
 *                                      example: '요청 성공'
 *                                  result:
 *                                      type: object
 *                                      required:
 *                                          - pageNumber
 *                                          - is_end
 *                                          - list
 *                                      properties:
 *                                          pageNumber:
 *                                              type: integer
 *                                              example: 1
 *                                          is_end:
 *                                              type: boolean
 *                                              example: false
 *                                          list:
 *                                              type: array
 *                                              items:
 *                                                  type: object
 *                                                  required:
 *                                                      - address_name
 *                                                      - place_name
 *                                                      - x
 *                                                      - y
 *                                                  properties:
 *                                                      address_name:
 *                                                          type: string
 *                                                          example: '인천 연수구 송도동 308-1'
 *                                                      category_code:
 *                                                          type: string
 *                                                          example: 'CS2'
 *                                                      category_name:
 *                                                          type: string
 *                                                          example: '편의점'
 *                                                      place_name:
 *                                                          type: string
 *                                                          example: 'GS25 송도점'
 *                                                      x:
 *                                                          type: string
 *                                                          example: '126.61243896059749'
 *                                                      y:
 *                                                          type: string
 *                                                          example: '37.41463872663659'
 *              '500':
 *                  description: '서버 내부 에러 발생'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
 *                              properties:
 *                                  isSuccess:
 *                                      type: boolean
 *                                      example: false
 *                                  code:
 *                                      type: integer
 *                                      example: 500
 *                                  message:
 *                                      type: string
 *                                      example: '서버 내부 에러 발생.'
 *                                  error:
 *                                      type: object
 *                                      properties:
 *                                          message:
 *                                              type: string
 *                                              example: '에러 메세지 내용'
 *                                          stack:
 *                                              type: string
 *                                              example: '에러가 발생한 위치 내용'
 *                  
 *              '2025':
 *                  description: '검색하실 장소명을 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
 *                              properties:
 *                                  isSuccess:
 *                                      type: boolean
 *                                      example: false
 *                                  code:
 *                                      type: integer
 *                                      example: 2025
 *                                  message:
 *                                      type: string
 *                                      example: '검색하실 장소명을 입력해주세요.'
 *              '2026':
 *                  description: '장소명은 최소 2글자 이상으로 입력해주세요.'
 *              '2028':
 *                  description: '검색 페이지는 1이상 45이하로 입력해주세요.'
 *              '2029':
 *                  description: '경도를 입력해주세요.'
 *              '2030':
 *                  description: '잘못된 경도 형식입니다.'
 *              '2031':
 *                  description: '위도를 입력해주세요.'
 *              '2032':
 *                  description: '잘못된 위도 형식입니다.'
 *              '3015'
 *                  description: '조회 결과가 없습니다. 조금 더 정확하게 키워드를 입력해주세요.'
 */
router.get(
    '/search-area',
    searchAreaValidation,
    validationMiddleware,
    wrapAsync(CommonController.searchArea)
);   // 장소검색 API (OK)

module.exports = router;