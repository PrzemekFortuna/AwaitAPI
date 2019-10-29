let firebase = require('firebase-admin');
let key = require('./fcm-key.json');

let admin = firebase.initializeApp({
    apiKey: key.apiKey
});

exports.sendNotification = (token, title, body) => {
    return new Promise(async (resolve, reject) => {
        try {

            let payload = {
                notification: {
                    title: title,
                    body: body
                }
            }

            let response = await admin.messaging().sendToDevice(token, payload);

            resolve(response);
        } catch (error) {
            reject({ error: error });
        }
    });
}