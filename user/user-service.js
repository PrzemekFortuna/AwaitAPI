const User = require('./user');
const hashService = require('../utils/hash-service');

exports.addUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (user.password) {
                let hash = await hashService.hash(user.password);
                user.password = hash;
            }

            let newUser = await User.create(user);
            resolve(newUser);
        } catch (error) {
            reject(error.message);
        }
    })
}

exports.getUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findById(id);
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}

exports.getUserByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ email: email});
            resolve(user);
        } catch(error) {
            reject(error);
        }
    });
}

exports.updateToken = (id, newToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOneAndUpdate({ _id: id }, { token: newToken });

            if(newToken === null)
                reject({ code: 400, error: 'New token cannot be null'});

            if(user === null)
                reject({ code: 404, error: 'User not found' });

            resolve();
        } catch(error) {
            reject({ code: 500, error: error });
        }
    });
}