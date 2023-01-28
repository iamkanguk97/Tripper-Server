const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: `[${process.env.NODE_ENV}] 모두의 여행, 트리퍼 API DOCS`,
            description: '모두의 여행, 트리퍼에서 사용하고 있는 REST API입니다. 확인하시다가 문의 사항이 있다면 연락 바랍니다.',
            contact: {
                name: 'KANGUK LEE',
                url: 'https://github.com/iamkanguk97',
                email: 'rkddnrdl97@naver.com'
            },
        },
        components: {
            securitySchemes: {
                JWT: {
                    type: 'http',
                    scheme: 'Bearer'
                }
            }
        },
        servers: [
            {
                url: 'http://localhost:3030'
            }
        ]
    },
    apis: [
        'src/api/routes/*.route.js',
        'src/api/models/User/*.js',
    ]
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs
};