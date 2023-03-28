const fs = require('fs');
const util = require('util');
const AWS = require('aws-sdk');

const readFile = util.promisify(fs.readFile);
const { S3 } = require('../../config/vars');
const User = require('../models/User/User');

/**
 * 에러 핸들링을 위한 헬퍼 함수
 */
const wrapAsync =
    fn =>
    // 모든 오류를 .catch()로 처리하고 체인의 next() 미들웨어에 전달.
    (req, res, next) => {
        fn(req, res, next).catch(next);
    };
/**
 * 부적절한 단어가 포함되어 있는지 확인 (욕설, 성적 단어 등)
 * @param nickname (추후 게시글 내용에도 포함되어 있는지 확인을 위해 파라미터 수정)
 * @returns true / false
 */
const checkBadWord = async nickname => {
    let badWordArray = await readFile('src/docs/fword_list.txt', 'utf-8');
    badWordArray = badWordArray.toString().replace(/\r/gi, '').split('\n');

    let check = 0;
    badWordArray.forEach(word => {
        if (nickname.includes(word)) {
            check = 1;
        }
    });

    return check;
};

/**
 * 첫 문자열을 받아오는 함수 (성별, 유저 로그인 타입 등)
 * @param gender
 * @returns M / F
 */
const getFirstLetter = gender => gender.charAt(0).toUpperCase();

/**
 * 카카오에서 받은 연령대 정보를 새로운 문자열로 변경하는 함수
 * @param ageGroup
 * @returns ex) 20대
 */
const ageGroupToString = ageGroup => {
    const age = parseInt(ageGroup.split('~')[0]);
    return age < 10 ? '10대 미만' : `${age}대`;
};

/**
 * AWS S3 객체를 생성해주는 함수
 * @returns new AWS.S3() (S3 Module)
 */
const returnS3Module = () => {
    AWS.config.update({
        accessKeyId: S3.ACCESS_KEY_ID,
        secretAccessKey: S3.SECRET_ACCESS_KEY,
        region: S3.REGION
    });

    return new AWS.S3();
};

/**
 * 프로필 이미지 업로드 함수
 * @param profileImage, kakaoId
 * @returns Profile Image S3 Location
 */
const uploadProfileImage = async (profileImage, snsId) => {
    const s3 = returnS3Module();
    const fileContent = Buffer.from(profileImage.data, 'binary');
    const params = {
        // S3 Upload Parameters
        Bucket: S3.BUCKET_NAME,
        Key: `profile/profile_snsId_${snsId}`,
        Body: fileContent
    };

    const uploadProfileImageResult = await s3.upload(params).promise();
    return uploadProfileImageResult.Location;
};

// const uploadThumImage = async () => {
//     const s3 = returnS3Module();
//     const fileContent =
// };

/**
 * 소셜로그인 고유값을 가지고 회원 존재하는지 확인
 * @param provider, snsId
 * @returns userIdx / false
 */
const checkUserExistWithSnsId = async (provider, snsId) => {
    const userExistResult = await User.findOne({
        where: {
            USER_SNS_ID: snsId,
            USER_PROVIDER: provider,
            USER_STATUS: 'A'
        }
    });

    return userExistResult ? userExistResult.dataValues.IDX : -1;
};

/**
 * 객체에 특정 value가 존재하는지 확인하는 함수
 * @param object, value
 * @returns Redis-Key or false
 */
const getKeyByValue = (obj, value) => {
    const result = Object.keys(obj).find(key => obj[key] === value);
    return result || false;
};

/**
 * 여행 이동수단 문자로 변환해주는 함수
 * @param method (여행 이동수단)
 * @return C, T, B, W, ''
 */
const getTravelTrans = method => {
    switch (method) {
        case '자차로 여행':
            return 'C';
        case '대중교통 여행':
            return 'T';
        case '자전거 여행':
            return 'B';
        case '도보 여행':
            return 'W';
        default:
            return '';
    }
};

module.exports = {
    checkBadWord,
    getFirstLetter,
    ageGroupToString,
    wrapAsync,
    returnS3Module,
    uploadProfileImage,
    checkUserExistWithSnsId,
    getKeyByValue,
    getTravelTrans
    // uploadThumImage
};
