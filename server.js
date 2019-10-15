var express = require('express');
const db = require('./db/db');
var app = express();
const hash = require('./utils/hash-service');


const port = process.env.port || 3000;

const restaurantsController = require('./restaurant/restaurant-controller');
app.use('/restaurants', restaurantsController);

const userController = require('./user/user-controller');
app.use('/users', userController);

const authController = require('./auth/auth-controller');
app.use('/auth', authController);

const orderController = require('./order/order-controller');
app.use('/orders', orderController);

var server = app.listen(port, () => {
    console.log('Server is running on port ', port);
});

module.exports=server;