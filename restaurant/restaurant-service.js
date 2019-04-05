const Restaurant = require('./restaurant');
const hashService = require('../utils/hash-service');

exports.createRestaurant = (restaurant) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashedPassword = await hashService.hash(restaurant.password);
            restaurant.password = hashedPassword;
            var newRestarurant = await Restaurant.create(restaurant);
            resolve(newRestarurant);
        } catch(error) {
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
        } catch(error) {
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
        } catch(error) {
            reject(error);
        }
    });
}
 exports.deleteRestaurant = (id) => {
     return new Promise(async (resolve, reject) => {
        try {
            let deletedRestaurant = await Restaurant.findByIdAndDelete(id);
            resolve(deletedRestaurant);
        } catch(error) {
            reject(error);
        }
     });
 }


