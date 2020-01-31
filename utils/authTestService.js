const restaurantService = require('../restaurant/restaurant-service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../user/user');
const config = require('../config/config');

exports.getRestaurantJWT = async () => {
    let restaurantDTO = { email: 'restaurant@test.pl', password: 'password' };
    await restaurantService.createRestaurant(restaurantDTO);
    
    let JWT = await login(restaurantDTO.email, 'password');

    return JWT;
}

function login(email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await User.findOne({ email: email });
            if (user != null) {
                let isLoginSuccessful = await bcrypt.compare(password, user.password);
                if (isLoginSuccessful) {
                    let token = await jwt.sign({ email: user.email, role: user.role, id: user._id }, config.secret);
                    
                    resolve(token);
                } else {
                    reject();
                }
            } else {
                reject();
            }
        } catch (error) {
            reject();
        }
    });
}