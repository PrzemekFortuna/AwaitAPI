const request = require('supertest');
const mongoose = require('mongoose');
let Order = require('./order');
let statuses = require('./order-statuses');

let server;

describe('/orders', () => {
    beforeEach(() => {
        server = require('../server');
    });

    afterEach(() => {
        Order.collection.deleteMany({});
        server.close();
    });

    describe('POST /order', () => {
        it('should return 201 when new order is created. It should contain property status with value "new"', () => {
            let order = { num}
        });
    });
});