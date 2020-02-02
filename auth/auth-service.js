const jwt = require('jsonwebtoken');
const hashService = require("../utils/hash-service");
const userService = require("../user/user-service")
const config = require("../config/config");
const roles = require("../user/roles");
const RX = require('rxjs');
const HttpError = require('../utils/http-error');

exports.loginStream = (email, password) => {
    return userService.getUserByEmailStream(email)
        .switchMap(user => {
            return hashService.compareStream(password, user.password)
                .switchMap(isLoginSuccessful => {
                    if (isLoginSuccessful) {
                        return RX.Observable.of(jwt.sign({ email: user.email, role: user.role, id: user._id }, config.secret))
                            .map(token => { return { jwt: token } });
                    }

                    throw new HttpError(401, 'Login failed!');
                });
        })
        .catch(error => {
            if (error instanceof HttpError)
                throw new HttpError(401, 'Login failed!');

            throw new HttpError(500, error);
        });
}

exports.allowAll = async (req, res, next) => {
    try {
        await allow(req, [roles.customer, roles.restaurant]);
        next();
    } catch (err) {
        res.status(401).send({ error: 'Authorization failed!' });
    }
}

exports.allowCustomer = async (req, res, next) => {
    try {
        await allow(req, [roles.customer]);
        next();
    } catch (err) {
        res.status(401).send({ error: 'Authorization failed!' });
    }
}

exports.allowRestaurant = async (req, res, next) => {
    try {
        await allow(req, [roles.restaurant]);
        next();
    } catch (err) {
        res.status(401).send({ error: 'Authorization failed!' });
    }
}

function allow(req, allowedRoles) {
    return new Promise(async (resolve, reject) => {
        let token = req.headers['authorization'];

        try {
            await verifyJWT(allowedRoles, token);
            resolve();
        } catch (err) {
            reject();
        }
    });
}

function verifyJWT(allowedRoles, token) {
    return new Promise(async (resolve, reject) => {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (!err) {
                allowedRoles.includes(decoded.role) ? resolve() : reject();
            } else {
                reject();
            }
        });
    });
}

exports.verifyJWT = verifyJWT;