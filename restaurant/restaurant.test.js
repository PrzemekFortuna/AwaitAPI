const request = require('supertest');
const Restaurant = require('./restaurant');
const Location = require('../location/location');
const User = require('../user/user');

let server;

describe('/restaurants', () => {
    beforeEach(() => {
        server = require('../server');
    });
    afterEach(() => {
        Restaurant.collection.deleteMany({});
        Location.collection.deleteMany({});
        User.collection.deleteMany({});
        server.close();
    });

    describe('POST /', () => {
        it('should return 201 when restaurant is created properly', async () => {
            let reqBody = { email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip:'90057', address: 'al. Politechniki 112' };
            let res = await request(server).post('/restaurants/').send(reqBody);

            expect(res.status).toBe(201);
            
            let body = res.body;
            expect(body).toHaveProperty('user');
            expect(body).toHaveProperty('location');
            expect(body).toHaveProperty('name', reqBody.name);
        });
    });

});