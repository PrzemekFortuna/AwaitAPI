const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const orderService = require('./order-service');
const statuses = require('./order-statuses');
const numberService = require('../number-generator/number-generator-service');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/', async (req, res) => {
    try {
        if (req.body.restaurant === undefined)
            return res.status(400).send({ error: 'No restaurant id provided' });

        let newOrder = await orderService.createOrder(req.body);

        res.status(201).send(newOrder);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/:id', async (req, res) => {
    try {
        if (Object.values(statuses).indexOf(req.body.status) == -1)
            return res.status(400).send({ error: 'ValidationError: Status out of allowed range' });

        let modifiedOrder = await orderService.changeStatus(req.params.id, req.body.status);
        res.status(200).send(modifiedOrder);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

router.get('/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        let orders = await orderService.getOrdersForRestaurant(req.params.id);

        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

router.patch('/connect/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let userID = req.body.user;

        await orderService.connectUser(id, userID);

        res.status(204).send({});
    } catch (err) {
        res.status(err.code).send(err);
    }
});

router.get('/number/:id', async (req, res) => {
    try {
        let id = req.params.id;

        let num = await numberService.getNumber(id);

        return res.status(200).send({ number: num });
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;