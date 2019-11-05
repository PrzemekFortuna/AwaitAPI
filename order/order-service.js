const Order = require('./order');
const statuses = require('./order-statuses');
const userService = require('../user/user-service');
const roles = require('../user/roles');
const numberService = require('../number-generator/number-generator-service');
const Restaurant = require('../restaurant/restaurant');

exports.createOrder = (order) => {
    return new Promise(async (resolve, reject) => {
        try {
            order.status = statuses.inprogress;
            let number = await numberService.getNumber(order.restaurant);
            order.number = number.number;

            let newOrder = await Order.create(order);

            resolve(newOrder);
        } catch (error) {
            reject(error);
        }
    });
}

exports.changeStatus = (id, newStatus) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = await Order.findById(id);
            order.status = newStatus;

            await order.save();
            resolve(order);
        } catch (err) {
            reject(err);
        }
    });
}

exports.connectUser = (id, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await userService.getUser(userId);

            if(user == null) {
                reject({ code: 404, error: 'User not found!' });
            }

            if (user.role != roles.customer) {
                reject({ code: 400, error: 'Wrong role! Cannot assign user with role "restaurant" to order.' });
            }

            let order = await Order.findById(id);
            if (order == null) {
                reject({ code: 404, error: 'Order not found!' });
            }

            order.user = user._id;
            await order.save();

            resolve();
        } catch (error) {
            reject({ code: 500, error: error });
        }
    });
}

exports.getOrdersForRestaurant = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let restaurant = await Restaurant.findOne({ user: userId });
            let orders = await Order.find({ restaurant: restaurant._id });            
            resolve(orders);
        } catch(error) {
            reject(error);
        }
    });
}