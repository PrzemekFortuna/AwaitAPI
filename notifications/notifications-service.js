let FCM = require('fcm-node');
let key = require('./fcm-key.json');
let fcm = new FCM(key.apiKey);

exports.sendNotification = (token, title, body) => {
    return new Promise(async (resolve, reject) => {
        try {

            let message = {
                to: token,
                notification: {
                    title: title,
                    body: body
                }
            }

            fcm.send(message, (err, response) => {
                if(err) {
                    console.log(err);
                    reject();
                } else {
                    console.log('Success!');
                    resolve();
                }
            });
        } catch (error) {
            reject({ error: error });
        }
    });
}