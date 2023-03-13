/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: 인증 관련 기능 리스트
 */

const express = require('express');
const passport = require('passport');
const AuthController = require('../controllers/auth.controller');
const validationMiddleware = require('../middlewares/validationMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const {
    verifyNickValidation,
    signUpValidation,
    tokenRefreshValidation
} = require('../middlewares/validations/auth.validation');
const { wrapAsync } = require('../utils/util');

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/auth/kakao-login:
 *      post:
 *          summary: '카카오 로그인 API'
 *          description: '카카오 로그인 기능입니다. 초기 회원가입시에는 회원가입 API를 추가로 거쳐야 합니다.'
 *          tags: [Auth]
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
 *                                          - jwt_token
 *                                          - userIdx
 *                                      properties:
 *                                          jwt_token:
 *                                              type: object
 *                                              required:
 *                                                  - accessToken
 *                                                  - refreshToken
 *                                              properties:
 *                                                  accessToken:
 *                                                      type: string
 *                                                      example: 'JWT Access Token'
 *                                                  refreshToken:
 *                                                      type: string
 *                                                      example: 'JWT Refresh Token'
 *                                          userIdx:
 *                                              type: integer
 *                                              example: 1
 *              '_200':
 *                  description: '환영합니다! 신규 회원의 경우 닉네임 및 프로필 사진 설정 후 서비스 이용이 가능합니다.'
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
 *                                      example: '환영합니다! 신규 회원의 경우 닉네임 및 프로필 사진 설정 후 서비스 이용이 가능합니다.'
 *                                  result:
 *                                      type: object
 *                                      required:
 *                                          - snsId
 *                                          - email
 *                                          - provider
 *                                      properties:
 *                                          snsId:
 *                                              type: string
 *                                              example: '소셜로그인 고유값'
 *                                          email:
 *                                              type: string
 *                                              example: 'rkddnrdl97@naver.com'
 *                                          age_group:
 *                                              type: string
 *                                              example: '20대'
 *                                          gender:
 *                                              type: string
 *                                              example: 'male'
 *                                          provider:
 *                                              type: string
 *                                              example: 'kakao'
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
 *                                              example: '에러 위치'
 */
router.get('/kakao-login', passport.authenticate('kakao'));
router.get('/kakao-login/callback', AuthController.kakaoLoginCallback);

/**
 * @swagger
 * paths:
 *  /api/auth/naver-login:
 *      post:
 *          summary: '네이버 로그인 API'
 *          description: '네이버 로그인 기능입니다. 초기 회원가입시에는 회원가입 API를 추가로 거쳐야 합니다.'
 *          tags: [Auth]
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
 *                                          - jwt_token
 *                                          - userIdx
 *                                      properties:
 *                                          jwt_token:
 *                                              type: object
 *                                              required:
 *                                                  - accessToken
 *                                                  - refreshToken
 *                                              properties:
 *                                                  accessToken:
 *                                                      type: string
 *                                                      example: 'JWT Access Token'
 *                                                  refreshToken:
 *                                                      type: string
 *                                                      example: 'JWT Refresh Token'
 *                                          userIdx:
 *                                              type: integer
 *                                              example: 1
 *              '_200':
 *                  description: '환영합니다! 신규 회원의 경우 닉네임 및 프로필 사진 설정 후 서비스 이용이 가능합니다.'
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
 *                                      example: '환영합니다! 신규 회원의 경우 닉네임 및 프로필 사진 설정 후 서비스 이용이 가능합니다.'
 *                                  result:
 *                                      type: object
 *                                      required:
 *                                          - snsId
 *                                          - email
 *                                          - provider
 *                                      properties:
 *                                          snsId:
 *                                              type: string
 *                                              example: '소셜로그인 고유값'
 *                                          email:
 *                                              type: string
 *                                              example: 'rkddnrdl97@naver.com'
 *                                          age_group:
 *                                              type: string
 *                                              example: '20대'
 *                                          gender:
 *                                              type: string
 *                                              example: 'male'
 *                                          provider:
 *                                              type: string
 *                                              example: 'naver'
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
 *                                              example: '에러 위치'
 */
router.get('/naver-login', passport.authenticate('naver'));
router.get('/naver-login/callback', AuthController.naverLoginCallback);

/**
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
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
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
 *              '2010':
 *                  description: '닉네임을 입력해주세요.'
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
 */
router.get(
    '/verify-nickname',
    verifyNickValidation,
    validationMiddleware,
    AuthController.verifyNickname
); // 닉네임 확인 API

/**
 * @swagger
 * paths:
 *  /api/auth/sign-up:
 *      post:
 *          summary: '회원가입 API'
 *          description: '카카오 로그인 API를 먼저 사용해서 신규 유저일 경우에만 해당 API를 사용하시면 됩니다.'
 *          tags: [Auth]
 *          requestBody:
 *              description: '회원 정보들을 Body로 보내주세요. (pimage, ageGroup, gender는 nullable입니다.)'
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          required:
 *                              - snsId
 *                              - email
 *                              - nickname
 *                              - provider
 *                          properties:
 *                              pimage:
 *                                  type: string
 *                                  format: binary
 *                              snsId:
 *                                  type: string
 *                                  example: '427GrSiUaxdwyLDyZLZ-U_8GYMiwPHIPmP1ZoP95EE01111'
 *                              email:
 *                                  type: string
 *                                  example: 'rkddnrdl97@naver.com'
 *                              nickname:
 *                                  type: string
 *                                  example: '욱이계정'
 *                              ageGroup:
 *                                  type: string
 *                                  example: '20~29'
 *                              gender:
 *                                  type: string
 *                                  example: 'male'
 *                              provider:
 *                                  type: string
 *                                  example: 'kakao'
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
 *                                          - newUserIdx
 *                                          - jwt_token
 *                                      properties:
 *                                          newUserIdx:
 *                                              type: integer
 *                                              example: 1
 *                                          jwt_token:
 *                                              type: object
 *                                              required:
 *                                                  - accessToken
 *                                                  - refreshToken
 *                                              properties:
 *                                                  accessToken:
 *                                                      type: string
 *                                                      example: 'JWT Access Token'
 *                                                  refreshToken:
 *                                                      type: string
 *                                                      example: 'JWT Refresh Token'
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
 *              '2010':
 *                  description: '닉네임을 입력해주세요.'
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
 *                                      example: 2010
 *                                  message:
 *                                      type: string
 *                                      example: '닉네임을 입력해주세요.'
 *              '2011':
 *                  description: '닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다.'
 *              '2012':
 *                  description: '닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요.'
 *              '2013':
 *                  description: '이메일을 입력해주세요.'
 *              '2014':
 *                  description: '이메일 형식이 잘못되었습니다. 다시 입력해주세요.'
 *              '2016':
 *                  description: '소셜로그인 고유값을 입력해주세요.'
 *              '2021':
 *                  description: '사용자 로그인 타입을 입력해주세요.'
 *              '2022':
 *                  description: '사용자 로그인 타입은 kakao 또는 naver로 입력해주세요.'
 *              '3010':
 *                  description: '중복된 닉네임입니다.'
 *              '3013':
 *                  description: '중복된 소셜로그인 고유값입니다.'
 */
router.post('/sign-up', signUpValidation, validationMiddleware, wrapAsync(AuthController.signUp)); // 회원가입 API

/**
 * @swagger
 * paths:
 *  /api/auth/auto-login:
 *      get:
 *          security:
 *              - JWT: []
 *          summary: '자동 로그인 API'
 *          description: '자동 로그인 기능입니다. Access-Token 검증만 진행하게 됩니다. 토큰 만료 에러가 발생하게 되면 token-refresh API를 사용해주셔야 합니다.'
 *          tags: [Auth]
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                schema:
 *                  type: string
 *                  example: 'Bearer <여기에 JWT Access-Token 입력해주세요>'
 *                required: true
 *                description: 'JWT Access-Token (Bearer)'
 *          responses:
 *              '200':
 *                  description: '요청 성공.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
 *                                  - result
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
 *                                          userIdx:
 *                                              type: integer
 *                                              example: 1
 *              '400':
 *                  description: '자동 로그인 에러 발생 (payload null)'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
 *                              type: object
 *                              properties:
 *                                  isSuccess:
 *                                      type: boolean
 *                                      example: false
 *                                  code:
 *                                      type: integer
 *                                      example: 400
 *                                  message:
 *                                      type: string
 *                                      example: '자동 로그인 에러 발생 (payload null)'
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
 */
router.get('/auto-login', jwtMiddleware, AuthController.autoLogin); // 자동로그인 API

/**
 * @swagger
 * paths:
 *  /api/auth/token-refresh:
 *      post:
 *          summary: 'JWT 재발급을 위한 Router'
 *          description: 'JWT 재발급을 위한 Router입니다. 클라이언트분은 access token과 refresh token을 둘 다 헤더에 담아서 요청해야합니다.'
 *          tags: [Auth]
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                schema:
 *                  type: string
 *                  example: 'Bearer <여기에 JWT Access-Token 입력해주세요>'
 *                required: true
 *                description: 'JWT Access-Token (Bearer)'
 *              - in: header
 *                name: refresh_token
 *                schema:
 *                  type: string
 *                  example: 'JWT REFRESH TOKEN'
 *                required: true
 *                description: 'JWT Refresh-Token'
 *          responses:
 *              '200':
 *                  description: '요청 성공.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
 *                                  - result
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
 *                                      required:
 *                                          - message
 *                                      properties:
 *                                          message:
 *                                              type: string
 *                                              example: '세션이 만료되었습니다. 로그인을 다시 진행해주세요.'
 *              '_200':
 *                  content:
 *                      application/json:
 *                          schema:
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
 *                                  - result
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
 *                                      required:
 *                                          - message
 *                                          - info
 *                                      properties:
 *                                          message:
 *                                              type: string
 *                                              example: '새로운 Access-Token이 발급되었습니다.'
 *                                          info:
 *                                              type: object
 *                                              required:
 *                                                  - userIdx
 *                                                  - accessToken
 *                                              properties:
 *                                                  userIdx:
 *                                                      type: integer
 *                                                      example: 1
 *                                                  accessToken:
 *                                                      type: string
 *                                                      example: 'accesstokenhelloworld'
 *              '__200':
 *                  content:
 *                      application/json:
 *                          schema:
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
 *                                  - result
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
 *                                      required:
 *                                          - message
 *                                          - info
 *                                      properties:
 *                                          message:
 *                                              type: string
 *                                              example: '새로운 Refresh-Token이 발급되었습니다.'
 *                                          info:
 *                                              type: object
 *                                              required:
 *                                                  - userIdx
 *                                                  - refreshToken
 *                                              properties:
 *                                                  userIdx:
 *                                                      type: integer
 *                                                      example: 1
 *                                                  refreshToken:
 *                                                      type: string
 *                                                      example: 'refreshtokenhelloworld'
 *              '___200':
 *                  content:
 *                      application/json:
 *                          schema:
 *                              required:
 *                                  - isSuccess
 *                                  - code
 *                                  - message
 *                                  - result
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
 *                                      required:
 *                                          - message
 *                                      properties:
 *                                          message:
 *                                              type: string
 *                                              example: 'Access-Token과 Refresh-Token이 모두 정상 상태입니다.'
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
 *              '2023':
 *                  description: 'JWT Access-Token을 입력해주세요.'
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
 *                                      example: 2023
 *                                  message:
 *                                      type: string
 *                                      example: 'JWT Access-Token을 입력해주세요.'
 *              '2024':
 *                  description: 'JWT Refresh-Token을 입력해주세요.'
 */
router.post(
    '/token-refresh',
    tokenRefreshValidation,
    validationMiddleware,
    wrapAsync(AuthController.tokenRefresh)
); // JWT 재발급을 위한 Router

module.exports = router;
