const crypto = require('crypto');

// Salt값 생성하는 함수
const genSalt = length => {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

// SHA512 알고리즘을 통한 비밀번호 암호화
const sha512 = (password, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const hashedPassword = hash.digest('hex');

    return {
        salt,
        hashedPassword
    };
};

const saltHashPassword = password => {
    return sha512(password, genSalt(16));
};

module.exports = {
    genSalt,
    saltHashPassword,
    sha512
};
