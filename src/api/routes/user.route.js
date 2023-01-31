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

const router = express.Router();

router.post(
    '/following', 
    jwtMiddleware,
    followValidation,
    validationMiddleware,
    UserController.follow
);   // 팔로우 API

router.get(
    '/follow-list',
    jwtMiddleware,
    followListValidation,
    validationMiddleware,
    UserController.followList
);   // 팔로잉 또는 팔로워 조회 API

router.delete(
    '/follower',
    jwtMiddleware,
    deleteFollowerValidation,
    validationMiddleware,
    UserController.deleteFollower
);   // 본인 팔로워 삭제 API

module.exports = router;

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
 *                  application/json:
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

/**
 * @swagger
 * paths:
 *  /api/users/follow-list?userIdx=&option=:
 *      get:
 *          summary: '팔로잉 또는 팔로워 조회 API'
 *          tags: [User]
 */

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
 *              '2020':
 *                  description: '삭제할 팔로워의 고유값을 입력해주세요.'
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
 *                                      example: 2020
 *                                  message:
 *                                      type: string
 *                                      example: '삭제할 팔로워의 고유값을 입력해주세요.'
 *              '3011':
 *                  description: '존재하지 않는 유저입니다.'
 *              '3012':
 *                  description: '삭제할 팔로워가 회원님을 팔로우하고 있지 않습니다.'
 */