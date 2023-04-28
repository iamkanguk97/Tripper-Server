const firebaseAdmin = require('firebase-admin');
const firebaseConfig = require('./fcm-config.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseConfig)
});

const sendFCM = async (messageTitle, messageBody, deviceToken) => {
    const message = {
        notification: {
            title: messageTitle,
            body: messageBody
        },
        token: deviceToken
    };

    // FCM 발송
    await firebaseAdmin.messaging().send(message);
};

module.exports = { sendFCM };
