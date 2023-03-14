/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: 인증 관련 기능 리스트
 */

/* ************************************************************************************** */

/**
 * @swagger
 * paths:
 *  /api/auth/kakao-login:
 *      post:
 *          summary: '카카오 로그인 API'
 *          description: '카카오 로그인 기능입니다. 초기 회원가입시에는 회원가입 API를 추가로 거쳐야 합니다.'
 *          tags: [Auth]
 *          responses:
 *              '_200':
 *                  description: '환영합니다! 신규 회원의 경우 닉네임 및 프로필 사진 설정 후 서비스 이용이 가능합니다.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/SuccessWithResult'
 *                          example:
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
 *                              $ref: '#/definitions/InternalServerError'
 */

/* ************************************************************************************** */

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
 *                              $ref: '#/definitions/InternalServerError'
 */

/* ************************************************************************************** */

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
 *                              $ref: '#/definitions/InternalServerError'
 *              '2010':
 *                  description: '닉네임을 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2010
 *                              message: '닉네임을 입력해주세요.'
 *              '2011':
 *                  description: '닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2011
 *                              message: '닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다.'
 *              '2012':
 *                  description: '닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2012
 *                              message: '닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요.'
 *              '3010':
 *                  description: '중복된 닉네임입니다.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 3010
 *                              message: '중복된 닉네임입니다.'
 */

/* ************************************************************************************** */

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
 *                                  description: '사용자 프로필 이미지 파일'
 *                              snsId:
 *                                  type: string
 *                                  description: '사용자 소셜로그인 고유값'
 *                              email:
 *                                  type: string
 *                                  description: '사용자 이메일'
 *                              nickname:
 *                                  type: string
 *                                  description: '사용자 닉네임'
 *                              ageGroup:
 *                                  type: string
 *                                  description: '사용자 연령대'
 *                              gender:
 *                                  type: string
 *                                  description: '사용자 성별'
 *                              provider:
 *                                  type: string
 *                                  description: '사용자 로그인 방식 (카카오, 네이버)'
 *                          example:
 *                              snsId: '427GrSiUaxdwyLDyZLZ-U_8GYMiwPHIPmP1ZoP95EE01111'
 *                              email: 'rkddnrdl97@naver.com'
 *                              nickname: '욱이계정'
 *                              ageGroup: '20~29'
 *                              gender: 'male'
 *                              provider: 'kakao'
 *          responses:
 *              '200':
 *                  description: '요청 성공'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/SuccessWithResult'
 *                          example:
 *                              isSuccess: true
 *                              code: 200
 *                              message: '요청 성공'
 *                              result:
 *                                  newUserIdx: 1
 *                                  jwt_token:
 *                                      accessToken: 'JWT Access Token'
 *                                      refreshToken: 'JWT Refresh Token'
 *              '500':
 *                  description: '서버 내부 에러 발생'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/InternalServerError'
 *              '2010':
 *                  description: '닉네임을 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2010
 *                              message: '닉네임을 입력해주세요.'
 *              '2011':
 *                  description: '닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2011
 *                              message: '닉네임은 한글,영어,숫자만 가능하며 2자 이상 10자 이하로 설정 가능합니다.'
 *              '2012':
 *                  description: '닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2012
 *                              message: '닉네임에 부적절한 단어가 포함되어 있습니다. 다시 시도해주세요.'
 *              '2013':
 *                  description: '이메일을 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2013
 *                              message: '이메일을 입력해주세요.'
 *              '2014':
 *                  description: '이메일 형식이 잘못되었습니다. 다시 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2014
 *                              message: '이메일 형식이 잘못되었습니다. 다시 입력해주세요.'
 *              '2016':
 *                  description: '소셜로그인 고유값을 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2016
 *                              message: '소셜로그인 고유값을 입력해주세요.'
 *              '2021':
 *                  description: '사용자 로그인 타입을 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2021
 *                              message: '사용자 로그인 타입을 입력해주세요.'
 *              '2022':
 *                  description: '사용자 로그인 타입은 kakao 또는 naver로 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2022
 *                              message: '사용자 로그인 타입은 kakao 또는 naver로 입력해주세요.'
 *              '3010':
 *                  description: '중복된 닉네임입니다.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 3010
 *                              message: '중복된 닉네임입니다.'
 *              '3013':
 *                  description: '중복된 소셜로그인 고유값입니다.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 3013
 *                              message: '중복된 소셜로그인 고유값입니다.'
 */

/* ************************************************************************************** */

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
 *                              $ref: '#/definitions/SuccessWithResult'
 *                          example:
 *                              isSuccess: true
 *                              code: 200
 *                              message: '요청 성공'
 *                              result:
 *                                  userIdx: 1
 *              '400':
 *                  description: '자동 로그인 에러 발생 (payload null)'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 400
 *                              message: '자동 로그인 에러 발생 (payload null)'
 *              '401':
 *                  description: 'JWT 인증 에러 발생 (또는) JWT 토큰 만료'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          examples:
 *                              AuthError:
 *                                  summary: 'JWT 인증 에러 발생'
 *                                  value:
 *                                      isSuccess: false
 *                                      code: 401
 *                                      message: 'JWT 인증 에러 발생'
 *                              ExpiredError:
 *                                  summary: 'JWT 토큰 만료'
 *                                  value:
 *                                      isSuccess: false
 *                                      code: 401
 *                                      message: 'JWT 토큰 만료'
 */

/* ************************************************************************************** */

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
 *                  description: 'API 요청 정상 처리'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/SuccessWithResult'
 *                          examples:
 *                              LoginRequired:
 *                                  summary: '세션이 만료되었습니다. 로그인을 다시 진행해주세요.'
 *                                  value:
 *                                      isSuccess: true
 *                                      code: 200
 *                                      message: '요청 성공'
 *                                      result:
 *                                          message: '세션이 만료되었습니다. 로그인을 다시 진행해주세요.'
 *                              AccessTokenCreated:
 *                                  summary: '새로운 Access-Token이 발급되었습니다.'
 *                                  value:
 *                                      isSuccess: true
 *                                      code: 200
 *                                      message: '요청 성공'
 *                                      result:
 *                                          message: '새로운 Access-Token이 발급되었습니다.'
 *                                          info:
 *                                              userIdx: 1
 *                                              accessToken: 'accesstokenhelloworld'
 *                              RefreshTokenCreated:
 *                                  summary: '새로운 Refresh-Token이 발급되었습니다.'
 *                                  value:
 *                                      isSuccess: true
 *                                      code: 200
 *                                      message: '요청 성공'
 *                                      result:
 *                                          message: '새로운 Refresh-Token이 발급되었습니다.'
 *                                          info:
 *                                              userIdx: 1
 *                                              refreshToken: 'refreshtokenhelloworld'
 *                              safe:
 *                                  summary: 'Access-Token과 Refresh-Token이 모두 정상 상태입니다.'
 *                                  value:
 *                                      isSuccess: true
 *                                      code: 200
 *                                      message: '요청 성공'
 *                                      result:
 *                                          message: 'Access-Token과 Refresh-Token이 모두 정상 상태입니다.'
 *              '500':
 *                  description: '서버 내부 에러 발생'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/InternalServerError'
 *              '2023':
 *                  description: 'JWT Access-Token을 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2023
 *                              message: 'JWT Access-Token을 입력해주세요.'
 *              '2024':
 *                  description: 'JWT Refresh-Token을 입력해주세요.'
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/CommonResponse'
 *                          example:
 *                              isSuccess: false
 *                              code: 2024
 *                              message: 'JWT Refresh-Token을 입력해주세요.'
 */
