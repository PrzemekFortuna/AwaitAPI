const request = require('supertest');
const mongoose = require('mongoose');
const restaurantService = require('../restaurant/restaurant-service');
let Order = require('./order');
let Restaurant = require('../restaurant/restaurant');
let statuses = require('./order-statuses');

let server;
let restaurant;

describe('/orders', () => {    
    beforeEach(async () => {
        server = require('../server');
        restaurant = await restaurantService.createRestaurant({ email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip:'90057', address: 'al. Politechniki 112' });
    });

    afterEach(() => {
        Order.collection.deleteMany({});
        Restaurant.collection.deleteMany({});
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

    
});