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
            }
        },
        schemes: ['http', 'https'],
        components: {
            securitySchemes: {
                JWT: {
                    type: 'http',
                    scheme: 'Bearer'
                }
            }
        },
        definitions: {
            CommonResponse: {
                type: 'object',
                required: ['isSuccess', 'code', 'message'],
                properties: {
                    isSuccess: {
                        type: 'boolean',
                        description: 'Request 성공 여부'
                    },
                    code: {
                        type: 'integer',
                        description: 'Response Code'
                    },
                    message: {
                        type: 'string',
                        description: 'Response Message'
                    }
                }
            },
            InternalServerError: {
                type: 'object',
                required: ['isSuccess', 'code', 'message', 'error'],
                properties: {
                    isSuccess: {
                        type: 'boolean',
                        description: 'Request 성공 여부'
                    },
                    code: {
                        type: 'integer',
                        description: 'Response Code'
                    },
                    message: {
                        type: 'string',
                        description: 'Response Message'
                    },
                    error: {
                        type: 'object',
                        required: ['message', 'stack'],
                        properties: {
                            message: {
                                type: 'string',
                                description: '에러 메세지 내용'
                            },
                            stack: {
                                type: 'string',
                                description: '에러 위치'
                            }
                        }
                    }
                },
                example: {
                    isSuccess: false,
                    code: 500,
                    message: '서버 내부 에러 발생.',
                    error: {
                        message: '에러 메세지 내용',
                        stack: '에러 위치'
                    }
                }
            },
            SuccessWithResult: {
                type: 'object',
                required: ['isSuccess', 'code', 'message', 'result'],
                properties: {
                    isSuccess: {
                        type: 'boolean',
                        description: 'Request 성공 여부'
                    },
                    code: {
                        type: 'integer',
                        description: 'Response Code'
                    },
                    message: {
                        type: 'string',
                        description: 'Response Message'
                    },
                    result: {
                        type: 'object',
                        description: 'Response optional elements'
                    }
                }
            }
        },
        servers: [
            {
                url: 'http://localhost:3030',
                description: 'Local Server'
            },
            {
                url: 'https://dev.ourtravel-tripper.shop',
                description: 'Development Server'
            }
        ]
    },
    apis: ['src/api/models/User/*.js', 'src/api/swaggers/*.swagger.js']
};

const specs = swaggerJsDoc(options);

module.exports = {
    swaggerUi,
    specs
};
