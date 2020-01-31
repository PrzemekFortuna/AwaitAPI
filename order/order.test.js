const request = require('supertest');
const mongoose = require('mongoose');
const restaurantService = require('../restaurant/restaurant-service');
let Order = require('./order');
let orderService = require('./order-service');
let Restaurant = require('../restaurant/restaurant');
let statuses = require('./order-statuses');
let User = require('../user/user');
const roles = require('../user/roles');
let Numb = require('../number-generator/number');
const authTestService = require('../utils/authTestService');

jest.setTimeout(180000);

let server;
let restaurant;
let jwt;

describe('/orders', () => {
    beforeEach(async () => {
        server = require('../server');
        restaurant = await restaurantService.createRestaurant({ email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip: '90057', address: 'al. Politechniki 112' });
        jwt = await authTestService.getRestaurantJWT();
    });

    afterEach(() => {
        Order.collection.deleteMany({});
        Restaurant.collection.deleteMany({});
        User.collection.deleteMany({});
        Numb.collection.deleteMany({});
        server.close();
    });

    describe('POST /order', () => {
        it('should return 201 when new order is created. It should contain property status with value "new"', async () => {
            let order = { note: 'order note', restaurant: restaurant._id };

            let res = await request(server).post('/orders').set('authorization', jwt).send(order);

            expect(res.status).toBe(201);

            let newOrder = res.body;

            expect(newOrder).toHaveProperty('number', 1);
            expect(newOrder).toHaveProperty('note', order.note);
            expect(newOrder).toHaveProperty('restaurant', restaurant._id.toString());
            expect(newOrder).toHaveProperty('status', statuses.inprogress);
        });

        it('should return 400 when no restaurant id is provided', async () => {
            let order = { note: 'order note' };

            let res = await request(server).post('/orders').set('authorization', jwt).send(order);

            expect(res.status).toBe(400);
        });

        it('should generate correct order numbers', async () => {
            let order = { note: 'order note', restaurant: restaurant._id };

            let res = await request(server).post('/orders').set('authorization', jwt).send(order);

            expect(res.status).toBe(201);

            let newOrder = res.body;

            expect(newOrder).toHaveProperty('number', 1);

            res = await request(server).post('/orders').set('authorization', jwt).send(order);

            expect(res.status).toBe(201);

            newOrder = res.body;

            expect(newOrder).toHaveProperty('number', 2);
        });
    });

    describe('GET /orders/:id', () => {
        it('should return all orders for restaurant with id', async () => {
            let orderDTO = { number: 1, note: 'order note', restaurant: restaurant.user, status: 1 };
            var order = await Order.create(orderDTO);
            order = await Order.create(orderDTO);

            let res = await request(server).get('/orders/'+restaurant.user).set('authorization', jwt);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);

            res.body.forEach(element => {
                expect(element.restaurant).toEqual(restaurant.user.toString());
            });
        });

        it('should return 400 when wrong restaurant id provided', async () => {
            let res = await request(server).get('/orders/'+mongoose.Types.ObjectId()).set('authorization', jwt);

            expect(res.status).toBe(400);
        });
    });

    describe('GET /orders/eager/:id', () => {
        it('should return all orders with user object for restaurant with id', async () => {
            let userDTO = { name: 'username', lastname: 'userlastname', role: roles.customer, email: 'user@user.pl', password: 'password' };
            let user = await User.create(userDTO);
            let orderDTO = { number: 1, note: 'order note', restaurant: restaurant.user, status: 1, user: user._id };
            var order = await Order.create(orderDTO);
            order = await Order.create(orderDTO);

            let res = await request(server).get('/orders/eager/'+restaurant.user).set('authorization', jwt);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);

            res.body.forEach(element => {
                expect(element.restaurant).toEqual(restaurant.user.toString());
                expect(element.user).toHaveProperty('name', user.name);
                expect(element.user).toHaveProperty('lastname', user.lastname);
                expect(element.user).toHaveProperty('role', user.role);
                expect(element.user).toHaveProperty('email', user.email);                
                expect(element.user).not.toHaveProperty('password');
            });
        });

        it('should return 400 when wrong restaurant id provided', async () => {
            let res = await request(server).get('/orders/'+mongoose.Types.ObjectId()).set('authorization', jwt);

            expect(res.status).toBe(400);
        });

    });

    describe('PATCH /orders/id', () => {
        it('should change order status', async () => {
            let orderDTO = { number: 11, note: 'order note', restaurant: restaurant._id };
            var order = await Order.create(orderDTO);

            let newStatus = { status: statuses.inprogress };
            let res = await request(server).patch('/orders/' + order._id).set('authorization', jwt).send(newStatus);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe(statuses.inprogress);
        });

        it('should return 400 when new order status is not allowable', async () => {
            let orderDTO = { number: 11, note: 'order note', restaurant: restaurant._id };
            let order = await Order.create(orderDTO);

            let newStatus = { status: 9 };
            let res = await request(server).patch('/orders/' + order._id).set('authorization', jwt).send(newStatus);

            expect(res.status).toBe(400);
        });
    });

    describe('PATCH /orders/connect/:id', () => {
        it('should return 204 when user gets connected to order successfuly', async () => {
            let orderDTO = { number: 11, note: 'order note', restaurant: restaurant._id };
            let order = await Order.create(orderDTO);
            let userDTO = { name: 'username', lastname: 'userlastname', role: roles.customer, email: 'user@user.pl', password: 'password' };
            let user = await User.create(userDTO);

            let res = await request(server).patch('/orders/connect/' + order._id).set('authorization', jwt).send({ user: user._id });

            expect(res.status).toBe(204);
        });

        it('should return 404 when order not found', async () => {
            let userDTO = { name: 'username', lastname: 'userlastname', role: roles.customer, email: 'user@user.pl', password: 'password' };
            let user = await User.create(userDTO);
            let res = await request(server).patch('/orders/connect/' + mongoose.Types.ObjectId()).set('authorization', jwt).send({ user: user._id });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 404 when user not found', async () => {
            let orderDTO = { number: 11, note: 'order note', restaurant: restaurant._id };
            let order = await Order.create(orderDTO);

            let res = await request(server).patch('/orders/connect/' + order._id).set('authorization', jwt).send({ user: mongoose.Types.ObjectId() });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 when user is not a customer', async () => {
            let orderDTO = { number: 11, note: 'order note', restaurant: restaurant._id };
            let order = await Order.create(orderDTO);
            let userDTO = { name: 'username', lastname: 'userlastname', role: roles.restaurant, email: 'user@user.pl', password: 'password' };
            let user = await User.create(userDTO);

            let res = await request(server).patch('/orders/connect/' + order._id).set('authorization', jwt).send({ user: user._id });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });    
});