const httpMocks = require('node-mocks-http');
const AuthController = require('../../src/api/controllers/auth.controller');
const UserModel = require('../../src/api/models/User/User');

UserModel.create = jest.fn();

let req;
let res;
let next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = null;
});

describe('****** AUTH 유닛 테스트 ******', () => {
    /**
     * @title 닉네임 확인 API 테스트
     */
    describe('[닉네임 확인 API 테스트]', () => {
        beforeEach(() => {
            req.query.nickname = '시발';
        });
        it('AuthController에 verifyNickname 함수가 있는지 확인', () => {
            expect(typeof AuthController.verifyNickname).toBe('function');
        });
        it('API TEST', async () => {
            AuthController.verifyNickname(req, res, next);
            expect(UserModel.create).toBeCalledWith();
        });
    });
});
