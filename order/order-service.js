const Order = require('./order');
const statuses = require('./order-statuses');

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