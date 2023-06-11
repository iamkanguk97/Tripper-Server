# 모두의 여행, 트리퍼 (2차 개발)

![image](https://github.com/iamkanguk97/Tripper-Server/assets/121025796/75e12152-6b44-4b61-8a3a-e0fa57f15e83)

## 💻 프로젝트 소개

모두의 여행, 트리퍼는 `모두를 위한 여행 기록 공유 플랫폼 앱 서비스`입니다. <br>
여행 일정을 공유할 수 있고 다른 여행자분들의 평가를 받을 수 있으며 다른 여행자들의 일정을 평가해줄 수 있습니다.

<br>

## 🗓️ 개발 기간

-   1차 기간: 2022.01 ~ 2022.06
-   2차 기간(리팩토링): 진행중

<br>

## 📕 Directory Structure

```
📦
├─ .eslintignore
├─ .eslintrc.js
├─ .github
│  └─ workflows
│     └─ deploy.yml
├─ .gitignore
├─ .prettierignore
├─ .prettierrc
├─ .vscode
│  ├─ launch.json
│  └─ settings.json
├─ README.md
├─ package-lock.json
├─ package.json
└─ src
   ├─ api
   │  ├─ controllers
   │  │  ├─ admin.controller.js
   │  │  ├─ auth.controller.js
   │  │  ├─ common.controller.js
   │  │  ├─ home.controller.js
   │  │  ├─ travel.controller.js
   │  │  └─ user.controller.js
   │  ├─ errors
   │  │  ├─ BadRequestError.js
   │  │  ├─ CustomServerError.js
   │  │  ├─ JwtError.js
   │  │  └─ index.js
   │  ├─ middlewares
   │  │  ├─ errorHandleMiddleware.js
   │  │  ├─ jwtMiddleware.js
   │  │  ├─ morganMiddleware.js
   │  │  ├─ validationMiddleware.js
   │  │  └─ validations
   │  │     ├─ admin.validation.js
   │  │     ├─ auth.validation.js
   │  │     ├─ common.validation.js
   │  │     ├─ page.validation.js
   │  │     ├─ travel.validation.js
   │  │     ├─ user.validation.js
   │  │     └─ utils
   │  │        ├─ admin.validation.func.js
   │  │        ├─ auth.validation.func.js
   │  │        ├─ travel.validation.func.js
   │  │        └─ user.validation.func.js
   │  ├─ models
   │  │  ├─ Admin
   │  │  │  ├─ Admin.js
   │  │  │  └─ AdminSalt.js
   │  │  ├─ Report
   │  │  │  ├─ Report.js
   │  │  │  ├─ ReportImage.js
   │  │  │  └─ ReportType.js
   │  │  ├─ Travel
   │  │  │  ├─ Travel.js
   │  │  │  ├─ TravelComment.js
   │  │  │  ├─ TravelCommentLike.js
   │  │  │  ├─ TravelCommentMention.js
   │  │  │  ├─ TravelDay.js
   │  │  │  ├─ TravelDayArea.js
   │  │  │  ├─ TravelDayAreaImage.js
   │  │  │  ├─ TravelLike.js
   │  │  │  ├─ TravelScore.js
   │  │  │  └─ TravelThumImage.js
   │  │  ├─ User
   │  │  │  ├─ User.js
   │  │  │  └─ UserFollow.js
   │  │  └─ index.js
   │  ├─ queries
   │  │  ├─ admin.query.js
   │  │  ├─ travel.query.js
   │  │  └─ user.query.js
   │  ├─ routes
   │  │  ├─ admin.route.js
   │  │  ├─ auth.route.js
   │  │  ├─ common.route.js
   │  │  ├─ home.route.js
   │  │  ├─ travel.route.js
   │  │  └─ user.route.js
   │  ├─ services
   │  │  ├─ admin.service.js
   │  │  ├─ auth.service.js
   │  │  ├─ common.service.js
   │  │  ├─ home.service.js
   │  │  ├─ travel.service.js
   │  │  └─ user.service.js
   │  └─ utils
   │     ├─ crypto-util.js
   │     ├─ jwt-util.js
   │     ├─ multer.js
   │     ├─ regex.js
   │     ├─ util.js
   │     └─ validation-util.js
   ├─ config
   │  ├─ database.js
   │  ├─ email.js
   │  ├─ express.js
   │  ├─ firebase
   │  │  └─ fcm.js
   │  ├─ logger.js
   │  ├─ passport
   │  │  ├─ index.js
   │  │  ├─ kakaoStrategy.js
   │  │  └─ naverStrategy.js
   │  ├─ redis.js
   │  ├─ response
   │  │  ├─ baseResponseStatus.js
   │  │  └─ response-template.js
   │  ├─ swagger.js
   │  └─ vars.js
   └─ index.js
```

<br>

## ENV Sample

```
NODE_ENV =
PORT =

RDS_ENDPOINT =
RDS_PORT =
RDS_ID =
RDS_PASSWORD =
RDS_DATABASE =

REDIS_HOST =
REDIS_PORT =
REDIS_USERNAME =
REDIS_PASSWORD =

SWAGGER_ID =
SWAGGER_PASSWORD =

KAKAO_REST_API_KEY =
KAKAO_CALLBACK_URL =

NAVER_CLIENT_ID =
NAVER_CLIENT_SECRET_KEY =
NAVER_CALLBACK_URL =

JWT_ACCESS_SECRET_KEY =
JWT_REFRESH_SECRET_KEY =

S3_ACCESS_KEY_ID =
S3_SECRET_ACCESS_KEY =
S3_BUCKET_NAME =
S3_REGION =

NODEMAILER_USER =
NODEMAILER_PASS =
NODEMAILER_PORT =
```

<br>

## 🛠️ Stacks

### Environment

<img src="https://img.shields.io/badge/Visual Studo Code-007ACC?style=for-the-badge&logo=Visual Studio Code&logoColor=white"><img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"><img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"><img src="https://img.shields.io/badge/github actions-2088FF?style=for-the-badge&logo=Github Actions&logoColor=white">

### Config

<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"><img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"><img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=pm2&logoColor=white"><img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=for-the-badge&logo=Amazon AWS&logoColor=white">

### Development

<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"><img src="https://img.shields.io/badge/sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white"><img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=Firebase&logoColor=white">

### Communication

<img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"><img src="https://img.shields.io/badge/discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"><img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">

<br>

## 🔍 ERD 설계도, Figma 등 상세 설명 문서

https://iamkanguk.notion.site/Tripper-0eeed21ef2274046ae345bd0f10350d5?pvs=4
