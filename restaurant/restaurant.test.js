const request = require('supertest');
const Restaurant = require('./restaurant');
const Location = require('../location/location');

let server;

describe('/restaurants', () => {
    beforeEach(() => {
        server = require('../server');
    });
    afterEach(() => {
        Restaurant.collection.deleteMany({});
        Location.collection.deleteMany({});
        server.close();
    });

    describe('POST /', () => {
        it('should return 201 when restaurant is created properly', async () => {

        });
    });

});