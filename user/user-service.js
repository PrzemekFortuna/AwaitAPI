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