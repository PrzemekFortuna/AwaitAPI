const request = require('supertest');
const Restaurant = require('./restaurant');
const User = require('../user/user');

let server;

describe('/restaurants', () => {
    beforeEach(() => {
        server = require('../server');
    });
    afterEach(() => {
        Restaurant.collection.deleteMany({});
        User.collection.deleteMany({});
        server.close();
    });

    describe('POST /register', () => {
        it('should return 201 when restaurant is created properly', async () => {
            let reqBody = { email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip:'90057', address: 'al. Politechniki 112' };
            let res = await request(server).post('/restaurants/register').send(reqBody);

            expect(res.status).toBe(201);
            
            let body = res.body;
            expect(body).toHaveProperty('user');
            expect(body).toHaveProperty('city', reqBody.city);
            expect(body).toHaveProperty('zip', reqBody.zip);
            expect(body).toHaveProperty('address', reqBody.address);
            expect(body).toHaveProperty('name', reqBody.name);
        });

        it('should return 400 when email/password is empty or not present', async () => {
            let reqBody = { email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip:'90057', address: 'al. Politechniki 112' };

            reqBody.email = undefined;

            res = await request(server).post('/restaurants/register').send(reqBody);

            expect(res.status).toEqual(400);
            expect(res.body.error.includes('`email` is required')).toBeTruthy();

            reqBody.email = 'user@user.com';
            reqBody.password = undefined;

            res = await request(server).post('/restaurants/register').send(reqBody);

            expect(res.status).toEqual(400);
            expect(res.body.error.includes('`password` is required')).toBeTruthy();
        });
    });

});