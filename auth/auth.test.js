const request = require('supertest');
const mongoose = require('mongoose');
let User = require('../user/user');

let server;

describe('/auth', () => {
    beforeEach(() => {
        server = require('../server');
    });
    afterEach(() => {
        User.collection.deleteMany({});
        server.close();
    });

    describe('POST /auth/login', () => {
        it('should return 200 and jwt when correct credentials provided', async () => {
            let newUser = { email: 'test@test.pl', password: 'password', role: 'restaurant' };
            let res = await request(server).post('/users/register').send(newUser);

            expect(res.status).toBe(201);

            let reqBody = { email: newUser.email, password: newUser.password };
            res = await request(server).post('/auth/login').query(reqBody);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('jwt');
        });
    });
});