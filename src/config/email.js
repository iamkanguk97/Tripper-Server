const nodemailer = require('nodemailer');
const { NODEMAILER } = require('./vars');

const sendVerifyEmail = async (email, verifyNumber) => {
    const transporter = nodemailer.createTransport({
        service: 'Naver',
        port: NODEMAILER.PORT,
        host: 'smtp.naver.com',
        auth: {
            user: NODEMAILER.USER,
            pass: NODEMAILER.PASS
        }
    });

    const mailOptions = {
        from: NODEMAILER.USER,
        to: email,
        subject: '[모두의 여행, 트리퍼] 관리자 회원가입 이메일 인증번호 보내드립니다.',
        text: `인증번호: ${verifyNumber}`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerifyEmail };
