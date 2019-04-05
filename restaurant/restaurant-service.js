const Restaurant = require('./restaurant');

exports.createRestaurant = (restaurant) => {
    return new Promise(async (resolve, reject) => {
        try {
            var newRestarurant = await Restaurant.create(restaurant);
            resolve(newRestarurant);
        } catch(error) {
            reject(error);
        }
    });
}

exports.getRestaurant = (id) => {
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


