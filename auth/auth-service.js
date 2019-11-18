const User = require("../user/user");
const jwt = require('jsonwebtoken');
const hashService = require("../utils/hash-service");
const userService = require("../user/user-service")
const config = require("../config/config");
const roles = require("../user/roles");

exports.login = (email, password) => {
    return new Promise(async (resolve, reject) => {
        let user = await userService.getUserByEmail(email);
        
        if (user != null) {
            let isLoginSuccessful = await hashService.compare(password, user.password);
            if (isLoginSuccessful) {
                let token = await jwt.sign({ email: user.email, role: user.role, id: user._id }, config.secret);
                resolve({ jwt: token });
            } else {
                reject({ code: 401, message: "Login failed!" });
            }
        } else {
            reject({ code: 401, message: "Login failed!" });
        }
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
    } catch(err) {
        res.status(401).send({ error: 'Authorization failed!' });
    }
}

function allow(req, allowedRoles) {
    return new Promise(async (resolve, reject) => {
        let env = process.env.NODE_ENV;
        if (env == 'test')
            resolve();

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