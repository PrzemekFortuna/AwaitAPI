const request = require('supertest');
const mongoose = require('mongoose');
let User = require('./user');
let roles = require('./roles');

let server;

describe('/users', () => {
    beforeEach(() => {
        server = require('../server');
    });
    afterEach(() => {
        //User.collection.deleteMany({});
        server.close();
    });

    describe('POST /users/register', () => {
        it('should return 201 when user is created successfully', async () => {
            let user = { name: 'username', lastname: 'userlastname', role: roles.restaurant, email: 'user@user.pl', password: 'password' };

            let res = await request(server).post('/users/register').send(user);

            expect(res.status).toEqual(201);
            let body = res.body;

            expect(body).toHaveProperty('name', user.name);
            expect(body).toHaveProperty('lastname', user.lastname);
            expect(body).toHaveProperty('role', user.role);
            expect(body).toHaveProperty('email', user.email);
            expect(body).not.toHaveProperty('password');
        });

        it('should return 400 when role/email/password is empty or not present', async () => {
            let user = { name: 'username', lastname: 'userlastname', role: roles.restaurant, email: 'user@user.pl', password: 'password' };
            user.role = undefined;

            let res = await request(server).post('/users/register').send(user);

            expect(res.status).toEqual(500);
            expect(res.body.error.includes('`role` is required')).toBeTruthy();

            user.role = roles.restaurant;
            user.email = undefined;

            res = await request(server).post('/users/register').send(user);

            expect(res.status).toEqual(500);
            expect(res.body.error.includes('`email` is required')).toBeTruthy();

            user.email = 'user@user.com';
            user.password = undefined;

            res = await request(server).post('/users/register').send(user);

            expect(res.status).toEqual(500);
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
            let user = { name: 'username', lastname: 'userlastname', role: roles.restaurant, email: 'user@user.pl', password: 'password' };
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