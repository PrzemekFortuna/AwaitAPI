const Restaurant = require('./restaurant');
const userService = require('../user/user-service');
const roles = require('../user/roles');
const RX = require('rxjs');

exports.createRestaurant = (restaurant) => {
    return new Promise(async (resolve, reject) => {
        try {            
            restaurant.role = roles.restaurant;
            let user = await userService.addUser(restaurant);

            let restaurantDTO = { name: restaurant.name, user: user._id, city: restaurant.city, zip: restaurant.zip, address: restaurant.address };
            var newRestarurant = await Restaurant.create(restaurantDTO);
            resolve(newRestarurant);
        } catch (error) {
            reject(error);
        }
    });
}

exports.createRestaurantStream = (restaurant) => {
    restaurant.role = roles.restaurant;

    return userService.addUserStream(restaurant)
    .switchMap(user => {
        let restaurantDTO = { name: restaurant.name, user: user._id, city: restaurant.city, zip: restaurant.zip, address: restaurant.address };

        return RX.Observable.fromPromise(Restaurant.create(restaurantDTO));
    });
}
exports.getRestaurant = (id) => {
    //TODO: return DTO
    return new Promise(async (resolve, reject) => {
        try {
            var restaurant = await Restaurant.findById(id);
            resolve(restaurant);
        } catch (error) {
            reject(error);
        }
    });
}

exports.deleteRestaurant = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let deletedRestaurant = await Restaurant.findByIdAndDelete(id);
            resolve(deletedRestaurant);
        } catch (error) {
            reject(error);
        }
    });
}