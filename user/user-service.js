const User = require('./user');
const hashService = require('../utils/hash-service');
const RX = require('rxjs');
const HttpError = require('../utils/http-error');

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

exports.addUserStream = (user) => {
    if (user.password) {
        return hashService.hashStream(user.password)
            .mergeMap(hashedPassword => {
                user.password = hashedPassword;

                return RX.Observable.fromPromise(User.create(user));
            })
            .catch(error => {
                if (error.message.includes('is required')) {
                    throw new HttpError(400, error);
                }

                throw new HttpError(500, error);
            });
    } else {
        return RX.Observable.throw(new HttpError(400, 'ValidationError: `password` is required'));
    }
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
            let user = await User.findOne({ email: email });
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}

exports.updateToken = (id, newToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOneAndUpdate({ _id: id }, { token: newToken });

            if (newToken === null)
                reject({ code: 400, error: 'New token cannot be null' });

            if (user === null)
                reject({ code: 404, error: 'User not found' });

            resolve();
        } catch (error) {
            reject({ code: 500, error: error });
        }
    });
}

exports.updateTokenStream = (id, newToken) => {
    if (newToken === null || newToken === undefined)
        return RX.Observable.throw(new HttpError(400, 'New token cannot be null'));

    return RX.Observable.fromPromise(User.findOneAndUpdate({ _id: id }, { token: newToken }).exec())
        .map(user => {
            if (user === null)
                throw new HttpError(404, 'User not found');

            return user;
        })
        .catch(error => {
            if (error instanceof HttpError)
                throw error;

            throw new HttpError(500, error)
        });
}