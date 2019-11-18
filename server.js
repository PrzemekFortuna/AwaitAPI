var express = require('express');
const db = require('./db/db');
var app = express();
const hash = require('./utils/hash-service');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const http = require('http').Server(app);
const io = require('socket.io')(http, { path: '/orders/socket/connect/socket.io' });
const authService = require('./auth/auth-service');
const Order = require('./order/order');
const roles = require('./user/roles');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//socket

io.use((socket, next) => {
    let jwt = socket.handshake.headers['authorization'];

    authService.verifyJWT([roles.restaurant], jwt)
    .then(() => {
        next();
    })
    .catch( () => {
        next(new Error('Authorization failed!'))
    });
});

io.on('connection', socket => {
    let id = socket.handshake.query.id;
    let pipleline = {
        $match: {
            operationType: 'insert'
        }
    };

    Order.watch(pipleline).on('change', data => {        
        socket.emit(id, data.fullDocument);
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

let server = http.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports=server;