let Numb = require('./number');
let Restaurant = require('../restaurant/restaurant');
let numberService = require('./number-generator-service');
let request = require('supertest');
let server;

describe('Number generator', () => {
    beforeEach(() => {
        server = require('../server');
    });
    
    afterEach(() => {
        Restaurant.collection.deleteMany({});
        Numb.collection.deleteMany({});
        server.close();
    });

    describe('GET number', () => {
        it('should get the correct number for restaurant', async () => {            
            let rest = (await request(server).post('/restaurants/register').send({ email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip: '90057', address: 'al. Politechniki 112' })).body;
            //let num = await numberService.getNumber(rest._id);
            console.log(rest);
        });
    });
});