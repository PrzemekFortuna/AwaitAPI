var express = require('express');
const db = require('./db/db');
var app = express();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const http = require('http').Server(app);
const io = require('socket.io')(http, { path: '/orders/socket/connect/socket.io' });
const authService = require('./auth/auth-service');
const roles = require('./user/roles');
const socketService = require('./order/socket');


io.on('connection', socket => {
    let id = socket.handshake.query.id;
    
    socket.join(id);

    socketService.connect(id, io);

    socket.on('disconnect', () => {
        socketService.disconnect(id);
    });    
});
//

let swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Await API',
            description: 'Await REST API documentation'
        },
        servers: ["http://await.herokuapp.com/"]
    },
    apis: ["docs/order.swagger.js", "docs/auth.swagger.js", "docs/user.swagger.js", "docs/restaurant.swagger.js"]
};


const port = process.env.PORT || 3000;

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

let server = http.listen(port, () => {
    console.log('Server is running on port ', port);
});

module.exports = server;