const path = require('path');
require('dotenv').config({ path: path.join(__dirname, `/envs/.env.${process.env.NODE_ENV}`) });

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_REFRESH_TOKEN_EXPIRE_TIME: (60 * 60 * 24 * 14),
    RDS: {
        END_POINT: process.env.RDS_ENDPOINT,
        PORT: process.env.RDS_PORT,
        ID: process.env.RDS_ID,
        PASSWORD: process.env.RDS_PASSWORD,
        DATABASE: process.env.RDS_DATABASE
    },
    SWAGGER: {
        ID: process.env.SWAGGER_ID,
        PASSWORD: process.env.SWAGGER_PASSWORD
    },
    KAKAO: {
        REST_API_KEY: process.env.KAKAO_REST_API_KEY,
        CALLBACK_URL: process.env.KAKAO_CALLBACK_URL,
        SEARCH: {
            SORT_METHOD: 'distance',
            DATA_COUNT_PER_PAGE: 15
        }
    },
    S3: {
        ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
        BUCKET_NAME: process.env.S3_BUCKET_NAME,
        REGION: process.env.S3_REGION
    },
    REDIS: {
        HOST: process.env.REDIS_HOST,
        PORT: process.env.REDIS_PORT,
        USERNAME: process.env.REDIS_USERNAME,
        PASSWORD: process.env.REDIS_PASSWORD
    },
    NAVER: {
        CLIENT_ID: process.env.NAVER_CLIENT_ID,
        CLIENT_SECRET_KEY: process.env.NAVER_CLIENT_SECRET_KEY,
        CALLBACK_URL: process.env.NAVER_CALLBACK_URL
    }
};