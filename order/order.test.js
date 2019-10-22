const request = require('supertest');
const mongoose = require('mongoose');
const restaurantService = require('../restaurant/restaurant-service');
let Order = require('./order');
let Restaurant = require('../restaurant/restaurant');
let statuses = require('./order-statuses');
let User = require('../user/user');
const roles = require('../user/roles');

let server;
let restaurant;

describe('/orders', () => {
    beforeEach(async () => {
        server = require('../server');
        restaurant = await restaurantService.createRestaurant({ email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip: '90057', address: 'al. Politechniki 112' });
    });

    afterEach(() => {
        Order.collection.deleteMany({});
        Restaurant.collection.deleteMany({});
        User.collection.deleteMany({});
        server.close();
    });

    describe('POST /order', () => {
        it('should return 201 when new order is created. It should contain property status with value "new"', async () => {
            let order = { number: 11, note: 'order note', restaurant: restaurant._id };

            let res = await request(server).post('/orders').send(order);

            expect(res.status).toBe(201);

            let newOrder = res.body;

            expect(newOrder).toHaveProperty('number', order.number);
            expect(newOrder).toHaveProperty('note', order.note);
            expect(newOrder).toHaveProperty('restaurant', restaurant._id.toString());
            expect(newOrder).toHaveProperty('status', statuses.new);
        });

        it('should return 400 when no restaurant id is provided', async () => {
            //TODO
        });
    });

    describe('PATCH /orders/id', () => {
        it('should change order status', async () => {
            let orderDTO = { number: 11, note: 'order note', restaurant: restaurant._id };
            var order = await Order.create(orderDTO);

            let newStatus = { status: statuses.inprogress };
            let res = await request(server).patch('/orders/' + order._id).send(newStatus);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe(statuses.inprogress);
        });

        it('should return 400 when new order status is not allowable', async () => {
            let orderDTO = { number: 11, note: 'order note', restaurant: restaurant._id };
            let order = await Order.create(orderDTO);

            let newStatus = { status: 9 };
            let res = await request(server).patch('/orders/' + order._id).send(newStatus);

            expect(res.status).toBe(400);
        });
    });

    describe('PATCH /orders/connect/:id', () => {
        it('should return 204 when user gets connected to order successfuly', async () => {
            let orderDTO = { number: 11, note: 'order note', restaurant: restaurant._id };
            let order = await Order.create(orderDTO);
            let userDTO = { name: 'username', lastname: 'userlastname', role: roles.customer, email: 'user@user.pl', password: 'password' };
            let user = await User.create(userDTO);

            let res = await request(server).patch('/orders/connect/' + order._id).send({ user: user._id });

            expect(res.status).toBe(204);
        });

        it('should return 404 when order not found', async () => {
            let userDTO = { name: 'username', lastname: 'userlastname', role: roles.customer, email: 'user@user.pl', password: 'password' };
            let user = await User.create(userDTO);
            let res = await request(server).patch('/orders/connect/' + mongoose.Types.ObjectId()).send({ user: user._id });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error');
        });

        it('should return 400 when user is not a customer', async () => {
            let orderDTO = { number: 11, note: 'order note', restaurant: restaurant._id };
            let order = await Order.create(orderDTO);
            let userDTO = { name: 'username', lastname: 'userlastname', role: roles.restaurant, email: 'user@user.pl', password: 'password' };
            let user = await User.create(userDTO);

            let res = await request(server).patch('/orders/connect/' + order._id).send({ user: user._id });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });
});