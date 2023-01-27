const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

/**
 * 부적절한 단어가 포함되어 있는지 확인 (욕설, 성적 단어 등)
 * @param nickname (추후 게시글 내용에도 포함되어 있는지 확인을 위해 파라미터 수정)
 * @returns true / false
 */
const checkBadWord = async (nickname) => {
    let badWordArray = await readFile('src/docs/fword_list.txt', 'utf-8');
    badWordArray = badWordArray.toString().replace(/\r/gi, "").split("\n");

    let check = 0;
    badWordArray.forEach((word) => {
        if (nickname.includes(word)) {
            check = 1;
            return;
        }
    });

    return check;
};

/**
 * 첫 문자열을 받아오는 함수 (성별, 유저 로그인 타입 등)
 * @param gender
 * @returns M / F
 */
const getFirstLetter = (gender) => {
    return gender.charAt(0).toUpperCase();
};

/**
 * 카카오에서 받은 연령대 정보를 새로운 문자열로 변경하는 함수
 * @param ageGroup
 * @returns ex) 20대
 */
const ageGroupToString = (ageGroup) => {
    const age = parseInt(ageGroup.split('~')[0]);
    return age < 10 ? '10대 미만' : `${age}대`;
};

module.exports = {
    checkBadWord,
    getFirstLetter,
    ageGroupToString
};