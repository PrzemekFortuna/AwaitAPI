const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const orderService = require('./order-service');
const statuses = require('./order-statuses');
const authService = require('../auth/auth-service');
const Order = require('./order');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/', authService.allowRestaurant, async (req, res) => {
    try {
        if (req.body.restaurant === undefined)
            return res.status(400).send({ error: 'No restaurant id provided' });

        let newOrder = await orderService.createOrder(req.body);

        res.status(201).send(newOrder);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/:id', authService.allowRestaurant, async (req, res) => {
    try {
        if (Object.values(statuses).indexOf(req.body.status) == -1)
            return res.status(400).send({ error: 'ValidationError: Status out of allowed range' });

        let modifiedOrder = await orderService.changeStatus(req.params.id, req.body.status);
        res.status(200).send(modifiedOrder);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

router.get('/:id', authService.allowRestaurant, async (req, res) => {
    try {
        let orders = await orderService.getOrdersForRestaurant(req.params.id);

        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

router.patch('/connect/:id', authService.allowRestaurant, async (req, res) => {
    try {
        let id = req.params.id;
        let userID = req.body.user;

        await orderService.connectUser(id, userID);

        res.status(204).send({});
    } catch (err) {
        res.status(err.code).send(err);
    }
});

router.get('/stream/:id', async (req, res) => {
    let pipleline = {
        $match: {
            operationType: 'insert'
        }
    };

    Order.watch(pipleline).on('change', data => console.log(data));

    res.status(200).send();
});

module.exports = router;