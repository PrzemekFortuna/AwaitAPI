const Order = require('./order');
const statuses = require('./order-statuses');
const userService = require('../user/user-service');
const roles = require('../user/roles');

exports.createOrder = (order) => {
    return new Promise(async (resolve, reject) => {
        try {
            order.status = statuses.new;

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
            if (user.role != roles.customer) {
                reject({ code: 400, error: 'Wrong role!' });
            }

            let order = await Order.findById(id);
            if (order == null) {
                reject({ code: 404, error: 'Order not found!' });
            }

            order.user = user._id;

            resolve();
        } catch (error) {
            reject({ code: 500, error: error });
        }
    });
}