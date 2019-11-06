let userService = require('../user/user-service');
let FCM = require('fcm-node');
let key = require('./fcm-key.json');
let fcm = new FCM(key.apiKey);

exports.sendNotification = (userId, title, body) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await userService.getUser(userId);
            let token = user.token;

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
                    resolve();
                }
            });
        } catch (error) {
            reject({ error: error });
        }
    });
}