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
        it('should create new number', async () => {            
            let rest = (await request(server).post('/restaurants/register').send({ email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip: '90057', address: 'al. Politechniki 112' })).body;
            let num = await numberService.getNumber(rest._id);
            
            expect(num.number).toBe(1);            
        });

        it('should increase the number', async () => {            
            let rest = (await request(server).post('/restaurants/register').send({ email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip: '90057', address: 'al. Politechniki 112' })).body;
            let num = await numberService.getNumber(rest._id);
            
            expect(num.number).toBe(1);

            num = await numberService.getNumber(rest._id);
            
            expect(num.number).toBe(2);
        });

        it('should reset the number', async () => {
            let rest = (await request(server).post('/restaurants/register').send({ email: 'user@gmail.com', password: 'password1', name: 'RestaurantName', city: 'Lodz', zip: '90057', address: 'al. Politechniki 112' })).body;
            let yesterday = new Date();
            yesterday.setTime(yesterday.getTime() - 1 * 86400000);
            let num = await Numb.create({ number: 4, date: yesterday, restaurant: rest._id });

            num = await numberService.getNumber(rest._id);

            expect(num.number).not.toBe(4);
            expect(num.number).toBe(1);

            num = await numberService.getNumber(rest._id);
        });
    });
});