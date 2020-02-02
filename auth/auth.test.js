const request = require('supertest');
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
            let newUser = await createNewUser();

            let reqBody = { email: newUser.email, password: newUser.password };
            let res = await request(server).post('/auth/login').send(reqBody);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('jwt');
        });

        it('should return 401 when provided wrong password', async () => {
            let newUser = await createNewUser();
            let reqBody = {email: newUser.email, password: 'wrongpassword'};
            let res = await request(server).post('/auth/login').send(reqBody);

            expect(res.status).toBe(401);
        });

        it('should return 401 when provided wrong email', async () => {
            let newUser = await createNewUser();
            let reqBody = { email: 'wrongemail@test.pl', password: 'password'};
            let res = await request(server).post('/auth/login').send(reqBody);
            
            expect(res.status).toBe(401);
        });
    });
});

let createNewUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let newUser = { email: 'test@test.pl', password: 'password', role: 'restaurant' };
            let res = await request(server).post('/users/register').send(newUser);

            expect(res.status).toBe(201);
            resolve(newUser);

        } catch (error) {
            reject(error);
        }
    });
}