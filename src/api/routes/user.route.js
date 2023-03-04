/**
 * @swagger
 * tags:
 *  name: User
 *  description: 회원 관련 기능 리스트
 */

'use strict';
const express = require('express');
const UserController = require('../controllers/user.controller');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { followValidation, followListValidation, deleteFollowerValidation } = require('../middlewares/validations/user.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

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
 *          requestBody: 
 *              description: '팔로우 요청을 할 유저의 고유값을 입력해주세요.'
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              followUserIdx:
 *                                  type: integer
 *                                  example: 1
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
 *                                          - message
 *                                      properties:
 *                                          message:
 *                                              type: string
 *                                              example: '팔로우 요청 성공 (또는) 팔로우 취소 성공'
 *              '401':
 *                  description: 'JWT 인증 에러 발생 (또는) JWT 토근 만료'
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
 *                                      example: 'JWT 인증 에러 발생 (또는) JWT 토근 만료'
 *              '2017':
 *                  description: '팔로우를 신청할 유저의 고유값을 입력해주세요.'
 *              '3011':
 *                  description: '존재하지 않는 유저입니다.'
 */
router.post(
    '/following',
    jwtMiddleware,
    followValidation,
    validationMiddleware,
    wrapAsync(UserController.follow)
);   // 팔로우 API (OK)

/**
 * @swagger
 * paths:
 *  /api/users/follow-list?userIdx=&option=:
 *      get:
 *          summary: '팔로잉 또는 팔로워 조회 API'
 *          tags: [User]
 */
router.get(
    '/follow-list',
    jwtMiddleware,
    followListValidation,
    validationMiddleware,
    UserController.followList
);   // 팔로잉 또는 팔로워 조회 API

/**
 * @swagger
 * paths:
 *  /api/users/follower:
 *      delete:
 *          security:
 *              - JWT: []
 *          summary: '본인 팔로워 삭제 API'
 *          description: '본인 팔로워를 삭제할 수 있는 기능입니다.'
 *          tags: [User]
 *          parameters:
 *              - in: header
 *                name: useridx
 *                schema:
 *                  type: integer
 *                  example: 5
 *                required: true
 *                description: '삭제할 팔로워의 고유값'
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
 *                              properties:
 *                                  isSuccess:
 *                                      type: boolean
 *                                      description: '요청 성공 여부'
 *                                      example: true
 *                                  code:
 *                                      type: integer
 *                                      description: '응답 코드'
 *                                      example: 200
 *                                  message:
 *                                      type: string
 *                                      description: '응답 메세지'
 *                                      example: '요청 성공.'
 *              '401':
 *                  description: 'JWT 인증 에러 발생 (또는) JWT 토근 만료'
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
 *                                      example: 'JWT 인증 에러 발생 (또는) JWT 토근 만료'
 *              '2020':
 *                  description: '삭제할 팔로워의 고유값을 입력해주세요.'
 *              '3011':
 *                  description: '존재하지 않는 유저입니다.'
 *              '3012':
 *                  description: '삭제할 팔로워가 회원님을 팔로우하고 있지 않습니다.'
 */
router.delete(
    '/follower',
    jwtMiddleware,
    deleteFollowerValidation,
    validationMiddleware,
    wrapAsync(UserController.deleteFollower)
);   // 본인 팔로워 삭제 API (OK)

module.exports = router;