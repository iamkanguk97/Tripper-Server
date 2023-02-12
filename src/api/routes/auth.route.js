/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: 인증 관련 기능 리스트
 */

'use strict';
const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/auth.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { verifyNickValidation, signUpValidation } = require('../middlewares/validations/auth.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

/** 카카오 로그인 관련 Router */
router.get('/kakao-login', passport.authenticate('kakao'));
router.get('/kakao-login/callback', AuthController.kakaoLoginCallback);

/** 네이버 로그인 관련 Router */
router.get('/naver-login', passport.authenticate('naver'));
router.get('/naver-login/callback', AuthController.naverLoginCallback);

router.get(
    '/verify-nickname',
    verifyNickValidation,
    validationMiddleware,
    AuthController.verifyNickname
);   // 닉네임 확인 API (OK)

router.post(
    '/sign-up',
    signUpValidation,
    validationMiddleware,
    wrapAsync(AuthController.signUp)
);   // 회원가입 API (진행중)

router.get(
    '/auto-login',
    AuthController.autoLogin
);   // 자동로그인 API

router.get(
    '/token-refresh',
    
    validationMiddleware,
    AuthController.tokenRefresh
);   // JWT Access Token 재발급을 위한 Router

module.exports = router;

/**
 * @swagger
 * paths:
 *  /api/auth/kakao-login:
 *      post:
 *          summary: '카카오 로그인 API'
 *          description: '카카오 로그인 기능입니다. 초기 회원가입시에는 회원가입 API를 추가로 거쳐야 합니다.'
 *          tags: [Auth]
 * 
 * @swagger
 * paths:
 *  /api/auth/naver-login:
 *      post:
 *          summary: '네이버 로그인 API'
 *          description: '네이버 로그인 기능입니다. 초기 회원가입시에는 회원가입 API를 추가로 거쳐야 합니다.'
 *          tags: [Auth]
 * 
 * @swagger
 * paths:
 *  /api/auth/verify-nickname?nickname={nickname}:
 *      get:
 *          summary: '닉네임 확인 API'
 *          description: '닉네임 형식 및 중복확인을 위한 기능입니다. 요청 경로에 값을 담아서 서버로 요청 보내주세요.'
 *          tags: [Auth]
 *          parameters:
 *              - in: query
 *                name: nickname
 *                required: true
 *                description: '확인받을 닉네임'
 *                schema:
 *                  type: string
 *          responses:
 *              '200':
 *                  description: '닉네임 확인에 성공'
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
 *              '500':
 *                  description: '서버 내부 에러 발생'
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
 *              '2010':
 *                  description: '닉네임을 입력해주세요.'
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
 *                                      example: 2010
 *                                  message:
 *                                      type: string
 *                                      example: '닉네임을 입력해주세요.'
 *              '2011':
 *                  description: '닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다.'
 *              '2012':
 *                  description: '닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요.'
 *              '3010':
 *                  description: '중복된 닉네임입니다.'
 * 
 * @swagger
 * paths: 
 *  /api/auth/sign-up:
 *      post:
 *          summary: '회원가입 API'
 *          description: '카카오 로그인 API를 먼저 사용해서 신규 유저일 경우에만 해당 API를 사용하시면 됩니다.'
 *          tags: [Auth]
 * 
 * @swagger
 * paths: 
 *  /api/auth/auto-login:
 *      get:
 *          summary: '자동 로그인 API'
 *          description: 'JWT Access Token 재발급을 위한 Router입니다. 클라이언트분은 access token과 refresh token을 둘 다 헤더에 담아서 요청해야합니다.'
 *          tags: [Auth]
 * 
 * @swagger
 * paths: 
 *  /api/auth/token-refresh:
 *      get:
 *          summary: 'JWT Access Token 재발급 API'
 *          description: 'JWT Access Token 재발급을 위한 Router입니다. 클라이언트분은 access token과 refresh token을 둘 다 헤더에 담아서 요청해야합니다.'
 *          tags: [Auth]
 */