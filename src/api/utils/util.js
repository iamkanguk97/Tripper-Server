const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

/**
 * 부적절한 단어가 포함되어 있는지 확인 (욕설, 성적 단어 등)
 * @param nickname (추후 게시글 내용에도 포함되어 있는지 확인을 위해 파라미터 수정)
 * @returns true / false
 */
const checkBadWord = async (nickname) => {
    let badWordArray = await readFile('src/fword_list.txt', 'utf-8');
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

module.exports = {
    checkBadWord
};