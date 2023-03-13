/**
 * @swagger
 * tags:
 *  name: Travel
 *  description: 게시물 관련 기능 리스트
 */

const express = require('express');
const TravelController = require('../controllers/travel.controller');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { wrapAsync } = require('../utils/util');
const {
    updateTravelStatusValidation,
    createTravelValidation,
    createTravelReviewScoreValidation,
    createTravelLikeValidation
} = require('../middlewares/validations/travel.validation');

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/travels/:
 *      post:
 *          summary: '게시물 생성 API'
 *          tags: [Travel]
 */
router.post('/', createTravelValidation, validationMiddleware, jwtMiddleware, TravelController.createTravel);

/**
 * @swagger
 * paths:
 *  /api/travels/{travelIdx}/status:
 *      patch:
 *          security:
 *              - JWT: []
 *          summary: '게시물 공개범위 수정 API'
 *          description: '게시물을 공개 또는 비공개 상태로 변환할 수 있는 기능입니다. 본인 게시물만 가능합니다.'
 *          tags: [Travel]
 *          parameters:
 *              - in: param
 *                name: travelIdx
 *                required: true
 *                description: '게시물 고유값'
 *                schema:
 *                  type: integer
 *                  example: 1
 *          responses:
 *              '200':
 *                  description: '요청 성공'
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
 *                                          - travelIdx
 *                                          - newTravelStatus
 *                                      properties:
 *                                          travelIdx:
 *                                              type: integer
 *                                              example: 1
 *                                          newTravelStatus:
 *                                              type: string
 *                                              example: 'A (또는) B'
 *              '401':
 *                  description: 'JWT 인증 에러 발생 (또는) JWT 토큰 만료'
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
 *                                      example: 401
 *                                  message:
 *                                      type: string
 *                                      example: 'JWT 인증 에러 발생 (또는) JWT 토큰 만료'
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
 *              '2027':
 *                  description: '여행 게시물 고유값을 입력해주세요.'
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
 *                                      example: 2027
 *                                  message:
 *                                      type: string
 *                                      example: '여행 게시물 고유값을 입력해주세요.'
 *              '3014':
 *                  description: '존재하지 않는 여행 게시물입니다.'
 */
router.patch(
    '/:travelIdx/status',
    jwtMiddleware,
    updateTravelStatusValidation,
    validationMiddleware,
    wrapAsync(TravelController.updateTravelStatus)
); // 게시물 공개 범위 수정 API (OK)

router.post(
    '/review-score',
    jwtMiddleware,
    createTravelReviewScoreValidation,
    validationMiddleware,
    wrapAsync(TravelController.createTravelReviewScore)
); // 게시물 평점등록 API

router.post(
    '/like',
    jwtMiddleware,
    // createTravelLikeValidation,
    // validationMiddleware,
    wrapAsync(TravelController.createTravelLike)
); // 게시물 좋아요 API

module.exports = router;
