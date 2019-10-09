const User = require("../user/user");
const hashService = require("../utils/hash-service");
const userService = require("../user/user-service")

exports.login = (email, password) => {
    return new Promise(async (resolve, reject) => {
        let user = await userService.getUserByEmail(email);

        if (user != null) {
            resolve(await hashService.compare(password, user.password));
        } else {
            reject();
        }
    });
}