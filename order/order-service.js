const Order = require('./order');
const statuses = require('./order-statuses');
const userService = require('../user/user-service');
const roles = require('../user/roles');
const numberService = require('../number-generator/number-generator-service');
const Restaurant = require('../restaurant/restaurant');
const notificationService = require('../notifications/notifications-service');
const RX = require('rxjs');

// exports.createOrder = (order) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             order.status = statuses.inprogress;
//             let number = await numberService.getNumber(order.restaurant);
//             order.number = number.number;

//             let newOrder = await Order.create(order);

//             resolve(newOrder);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

exports.createOrderStream = (order) => {
    return RX.Observable.from(numberService.getNumber(order.restaurant))
        .switchMap(number => {
            order.status = statuses.inprogress;
            order.number = number.number;
            return RX.Observable.from(Order.create(order));
        });
}

// exports.changeStatus = (id, newStatus) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let order = await Order.findById(id);
//             if (order) {
//                 order.status = newStatus;

//                 await order.save();

//                 if (newStatus == statuses.ready && order.user) {
//                     await notificationService.sendNotification(order.user, '', order);
//                 }
//             }
//             resolve(order);
//         } catch (err) {
//             reject(err);
//         }
//     });
// }

exports.changeStatusStream = (id, newStatus) => {
    return RX.Observable.from(Order.findById(id).exec())
        .mergeMap(async order => {
            order.status = newStatus;

            await order.save();

            if (newStatus == statuses.ready && order.user) {
                await notificationService.sendNotification(order.user, '', order);
            }

            return order;
        });
}

// exports.connectUser = (id, userId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let user = await userService.getUser(userId);

//             if (user == null) {
//                 reject({ code: 404, error: 'User not found!' });
//             }

//             if (user.role != roles.customer) {
//                 reject({ code: 400, error: 'Wrong role! Cannot assign user with role "restaurant" to order.' });
//             }

//             let order = await Order.findById(id);
//             if (order == null) {
//                 reject({ code: 404, error: 'Order not found!' });
//             }

//             order.user = user._id;
//             await order.save();

//             resolve();
//         } catch (error) {
//             reject({ code: 500, error: error });
//         }
//     });
// }

exports.connectUserStream = (id, userId) => {
    try {
        return RX.Observable.from(userService.getUser(userId))
            .switchMap(user => {
                if (user == null)
                    return RX.Observable.of({ code: 404, error: 'User not found' });

                if (user.role != roles.customer)
                    return RX.Observable.of({ code: 400, error: 'Wrong role! Cannot assign user with role "restaurant" to order.' });

                return RX.Observable.from(Order.findById(id).exec())
                    .switchMap(async order => {
                        if (order == null)
                            return { code: 404, error: 'Order not found' };

                        order.user = user._id;

                        await order.save();

                        return order;
                    });
            });
    } catch (error) {
        return RX.Observable.of({ code: 500, error: error });
    }
}

// exports.getOrdersForRestaurant = (userId) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let restaurant = await Restaurant.findOne({ user: userId });

//             if (restaurant != null) {
//                 let orders = await Order.find({ restaurant: userId, status: { "$in": [statuses.inprogress, statuses.ready] } });
//                 resolve(orders);
//             } else {
//                 reject({ error: 'Restaurant not found' });
//             }

//         } catch (error) {
//             reject(error);
//         }
//     });
// }

exports.getOrdersForRestaurantStream = (userId) => {
    return RX.Observable.from(Restaurant.findOne({ user: userId }).exec())
        .mergeMap(restaurant => {
            if (restaurant) {
                return RX.Observable.from(Order.find({ restaurant: userId }).exec())
                    .flatMap(order => RX.Observable.from(order))
                    .filter(order => order.status === statuses.inprogress || order.status === statuses.ready)
                    .toArray();
            } else {
                return RX.Observable.of({ code: 400, error: 'Restaurant not found' });
            }
        });
}

exports.getOrdersForRestaurantEagerly = (userId) => {
    return RX.Observable.from(Restaurant.findOne({ user: userId }).exec())
        .mergeMap(restaurant => {
            if (restaurant) {
                return RX.Observable.from(Order.find({ restaurant: userId, status: { "$in": [statuses.inprogress, statuses.ready] } }).exec())
                    .flatMap(order => RX.Observable.from(order))
                    .mergeMap(order => RX.Observable.forkJoin(RX.Observable.from(userService.getUser(order.user)),
                    user => {
                        if(user)
                            user.password = undefined;

                        order.user = user;

                        return order;
                    }))
                    .toArray();
            } else {
                return RX.Observable.of({ code: 400, error: 'Restaurant not found' });
            }
        });
}