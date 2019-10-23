var express = require('express');
const db = require('./db/db');
var app = express();
const hash = require('./utils/hash-service');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

let swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Await API',
            description: 'Await REST API documentation'
        },
        servers: ["http://localhost:3000"]
    },
    apis: ["server.js", "docs/order.swagger.js", "docs/auth.swagger.js"]
};


const port = process.env.port || 3000;

// SWAGGER
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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