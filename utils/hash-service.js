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

exports.compareStream = (value, hashedValue) => {
    return RX.Observable.from(bcrypt.compare(value, hashedValue));
}