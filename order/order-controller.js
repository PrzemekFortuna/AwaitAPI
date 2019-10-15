const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const orderService = require('./order-service');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', async (req, res) => {
    try {
        let newOrder = await orderService.createOrder(req.body);

        if (req.body.restaurant === undefined)
            res.status(400).send({ error: 'No restaurant id provided' });
        res.status(201).send(newOrder);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;