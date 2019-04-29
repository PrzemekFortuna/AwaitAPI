const Restaurant = require('./restaurant');
const hashService = require('../utils/hash-service');
const userService = require('../user/user-service');
const locationService = require('../location/location-service');

exports.createRestaurant = (restaurant) => {
    return new Promise(async (resolve, reject) => {
        try {
            let location = await locationService.addLocation(restaurant);
            restaurant.role = 'restaurant';
            let user = await userService.addUser(restaurant);

            var hashedPassword = await hashService.hash(restaurant.password);
            restaurant.password = hashedPassword;

            let restaurantDTO = { name: restaurant.name, user: user._id, location: location._id };
            var newRestarurant = await Restaurant.create(restaurantDTO);
            resolve(newRestarurant);
        } catch (error) {
            reject(error);
        }
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

exports.getAllRestaurantsFromLocation = (locId) => {
    //TODO: return DTOs
    return new Promise(async (resolve, reject) => {
        try {
            let restaurants = await Restaurant.find({ location: locId });
            resolve(restaurants);
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


