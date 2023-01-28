/**
 * @swagger
 * tags:
 *  name: User
 *  description: 회원 관련 기능 리스트
 */

const express = require('express');
const UserController = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { followValidation } = require('../middlewares/validations/user.validation');

const router = express.Router();

router.post(
    '/following', 
    jwtMiddleware,
    followValidation,
    validationMiddleware,
    UserController.follow
);   // 팔로우 API

module.exports = router;

// *          requestBody:
// *              - required: true
// *              - content:
// *                  application/json
// *                      schema:
// *                          properties:
// *                              followUserIdx:
// *                                  type: integer
// *                                  example: 1

/**
 * @swagger
 * paths:
 *  /api/users/following:
 *      post:
 *          security:
 *              - JWT: []
 *          summary: '팔로우 API'
 *          description: '팔로우 기능입니다.'
 *          tags: [User]
 *          parameters:
 *              - in: body
 *                name: body
 *                required: true
 *                schema:
 *                  properties:
 *                      followUserIdx:
 *                          type: integer
 *                          example: 1
 *          responses:
 *              '200':
 *                  description: '요청 성공'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
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
 *                                      properties:
 *                                          message:
 *                                              type: string
 *                                              example: '팔로우 요청 성공 / 팔로우 취소 성공'
 *              '401':
 *                  description: 'JWT 인증 에러 발생 / JWT 토근 만료'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  isSuccess:
 *                                      type: boolean
 *                                      example: false
 *                                  code:
 *                                      type: integer
 *                                      example: 401
 *                                  message:
 *                                      type: string
 *                                      example: 'JWT 인증 에러 발생 / JWT 토근 만료'
 *              '2017':
 *                  description: '팔로우를 신청할 유저의 고유값을 입력해주세요.'
 *                  schema:
 *                      type: object
 *                      properties:
 *                          isSuccess:
 *                              type: boolean
 *                              example: false
 *                          code:
 *                              type: integer
 *                              example: 2017
 *                          message:
 *                              type: string
 *                              example: '팔로우를 신청할 유저의 고유값을 입력해주세요.'
 *              '3011':
 *                  description: '존재하지 않는 유저입니다.'
 *                  schema:
 *                      type: object
 *                      properties:
 *                          isSuccess:
 *                              type: boolean
 *                              example: false
 *                          code:
 *                              type: integer
 *                              example: 3011
 *                          message:
 *                              type: string
 *                              example: '존재하지 않는 유저입니다.'
 */