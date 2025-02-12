const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const orderService = require('./order-service');
const statuses = require('./order-statuses');
const authService = require('../auth/auth-service');
const Order = require('./order');
const HttpError = require('../utils/http-error');


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', authService.allowRestaurant, (req, res) => {
    try {
        if (req.body.restaurant === undefined) {
            return res.status(400).send({ error: 'No restaurant id provided' });
        }

        orderService.createOrderStream(req.body)
            .subscribe(newOrder => {
                return res.status(201).send(newOrder);
            });
    }
    catch (error) {
        return res.status(500).send({ error: error });
    }
});

router.patch('/:id', authService.allowRestaurant, (req, res) => {
    try {
        if (Object.values(statuses).indexOf(req.body.status) == -1)
            return res.status(400).send({ error: 'ValidationError: Status out of allowed range' });

        orderService.changeStatusStream(req.params.id, req.body.status)
            .subscribe(modifiedOrder => {
                return res.status(200).send(modifiedOrder);
            });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
});

router.get('/:id', authService.allowRestaurant, (req, res) => {
    let resp = orderService.getOrdersForRestaurantStream(req.params.id);
    resp.subscribe(
        data => {
            return res.status(200).send(data);
        },
        error => {
            if (error instanceof HttpError)
                return res.status(error.code).send({ error: error.message });

            return res.status(500).send(error);
        });
});

router.patch('/connect/:id', authService.allowRestaurant, (req, res) => {
    try {
        let id = req.params.id;
        let userID = req.body.user;

        orderService.connectUserStream(id, userID)
            .subscribe(order => {
                if (order.error) {
                    return res.status(order.code).send(order);
                } else {
                    return res.status(204).send({});
                }
            });
    } catch (error) {
        res.status(500).send({ error: err });
    }
});

router.get('/eager/:id', async (req, res) => {
    let resp = orderService.getOrdersForRestaurantEagerly(req.params.id);
    resp.subscribe(
        data => {
            if (!data.error) {
                res.status(200).send(data);
            } else {
                res.status(data.code).send(data);
            }
        });
});

module.exports = router;