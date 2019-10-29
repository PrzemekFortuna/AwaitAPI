const request = require('supertest');
const mongoose = require('mongoose');
let User = require('./user');
let roles = require('./roles');
let userService = require('./user-service');

let server;

describe('/users', () => {
    beforeEach(() => {
        server = require('../server');
    });
    afterEach(() => {
        User.collection.deleteMany({});
        server.close();
    });

    describe('POST /users/register', () => {
        it('should return 201 when user is created successfully', async () => {
            let user = { name: 'username', lastname: 'userlastname', email: 'user@user.pl', password: 'password' };

            let res = await request(server).post('/users/register').send(user);

            expect(res.status).toEqual(201);
            let body = res.body;

            expect(body).toHaveProperty('name', user.name);
            expect(body).toHaveProperty('lastname', user.lastname);
            expect(body).toHaveProperty('role', roles.customer);
            expect(body).toHaveProperty('email', user.email);
            expect(body).not.toHaveProperty('password');
        });

        it('should change token', async () => {
            let user = { token: 'abcd', name: 'username', lastname: 'userlastname', email: 'user@user.pl', password: 'password' };

            let res = await request(server).post('/users/register').send(user);

            expect(res.status).toEqual(201);
            let body = res.body;

            expect(body).toHaveProperty('name', user.name);
            expect(body).toHaveProperty('lastname', user.lastname);
            expect(body).toHaveProperty('role', roles.customer);
            expect(body).toHaveProperty('email', user.email);
            expect(body).toHaveProperty('token', user.token);
            expect(body).not.toHaveProperty('password');

            await userService.updateToken(body._id, 'dcba');
            let usr = await userService.getUser(body._id);            
            expect(usr).toHaveProperty('token', 'dcba');
        });

        it('should return 400 when email/password is empty or not present', async () => {
            let user = { name: 'username', lastname: 'userlastname', email: 'user@user.pl', password: 'password' };

            user.email = undefined;

            res = await request(server).post('/users/register').send(user);

            expect(res.status).toEqual(400);
            expect(res.body.error.includes('`email` is required')).toBeTruthy();

            user.email = 'user@user.com';
            user.password = undefined;

            res = await request(server).post('/users/register').send(user);

            expect(res.status).toEqual(400);
            expect(res.body.error.includes('`password` is required')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return 404 when database empty', async () => {
            let res = await request(server).post('/users/' + mongoose.Types.ObjectId());

            expect(res.status).toEqual(404);
        });

        it('it should return 404 when invalid id provided', async () => {
            let user = { name: 'username', lastname: 'userlastname', role: roles.restaurant, email: 'user@user.pl', password: 'password' };

            let usr = await User.create(user);

            let res = await request(server).get('/users/' + mongoose.Types.ObjectId());

            expect(res.status).toEqual(404);
        });

        it('should return the user when valid id provided', async () => {
            let user = { name: 'username', lastname: 'userlastname', role: roles.customer, email: 'user@user.pl', password: 'password' };
            let usr = await User.create(user);

            let res = await request(server).get('/users/' + usr._id);

            expect(res.status).toEqual(200);
            let body = res.body;
            
            expect(body).toHaveProperty('name', user.name);
            expect(body).toHaveProperty('lastname', user.lastname);
            expect(body).toHaveProperty('role', user.role);
            expect(body).toHaveProperty('email', user.email);
            expect(body).not.toHaveProperty('password');
        });
    });

});