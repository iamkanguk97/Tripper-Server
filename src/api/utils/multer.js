const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const { S3 } = require('../../config/vars');

const s3 = new aws.S3({
    accessKeyId: S3.ACCESS_KEY_ID,
    secretAccessKey: S3.SECRET_ACCESS_KEY,
    region: S3.REGION
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: S3.BUCKET_NAME,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
    })
});

module.exports = upload;