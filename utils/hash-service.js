const bcrypt = require('bcrypt');
const RX = require('rxjs');

exports.hash = (value) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashedValue = await bcrypt.hash(value, 10);
            resolve(hashedValue);       
        } catch (error) {
            reject(error);
        }
    });
}

// exports.hashStream = (value) => {
//     return RX.Observable.fromPromise(bcrypt.hash(value, 10));
// }

// exports.compare = (value, hashedValue) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let result = await bcrypt.compare(value, hashedValue);
//             resolve(result);
//         } catch(error) {
//             reject(error);
//         }
//     });
// }

exports.compareStream = (value, hashedValue) => {
    return RX.Observable.fromPromise(bcrypt.compare(value, hashedValue));
}