const AuthController = require('../../src/api/controllers/auth.controller');

describe('****** AUTH 유닛 테스트 ******', () => {
    /**
     * @title 닉네임 확인 API 테스트
     */
    it('[닉네임 확인 API 테스트]', async () => {
        const data = await AuthController.verifyNickname();
        console.log(data);
    });
});

// /**
//  * @title 닉네임 확인 API Test
//  */
// // test('[닉네임 확인 API 테스트] 닉네임 입력', async () => {});

// describe('test', () => {
//     test('1+2는 3인지 확인', () => {
//         expect(1 + 2).toBe(3);
//     });
// });
