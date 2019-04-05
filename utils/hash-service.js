const bcrypt = require('bcrypt');

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

exports.compare = (value, hashedValue) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await bcrypt.compare(value, hashedValue);
            resolve(result);
        } catch(error) {
            reject(error);
        }
    });
}