const User = require('./user');

exports.addUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
            let newUser = await User.create(user);
            resolve(newUser);
        } catch (error) {
            reject(error);
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