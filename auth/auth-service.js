const User = require("../user/user");
const jwt = require('jsonwebtoken');
const hashService = require("../utils/hash-service");
const userService = require("../user/user-service")
const config = require("../config/config");

exports.login = (email, password) => {
    return new Promise(async (resolve, reject) => {
        let user = await userService.getUserByEmail(email);

        if (user != null) {
            let isLoginSuccessful = await hashService.compare(password, user.password);
            if (isLoginSuccessful) {
                let token = await jwt.sign({ email: user.email, role: user.role }, config.secret);
                resolve({ jwt: token });
            } else {
                reject({ code: 401, message: "Login failed!" });
            }
        } else {
            reject({ code: 401, message: "Login failed!" });
        }
    });
}