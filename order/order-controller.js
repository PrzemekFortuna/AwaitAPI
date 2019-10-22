const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const orderService = require('./order-service');
const statuses = require('./order-statuses');

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

/**
 * @swagger
 * 
 * /orders/:id:
 *  patch:
 *      description: Updates order status
 *      produces:
 *          - application/json
 *      tags:
 *          - Orders
 *      parameters:
 *          - name: id
 *            description: Id of order to update
 *            in: path
 *            required: true
 *            type: string
 *          - name: status
 *            description: New status
 *            in: body
 *            required: true
 *            schema:
 *              type: object
 *              properties:
 *                  status:
 *                      type: integer
 *                      format: int32
 *                      example: 2
 *                      minimum: 2
 *                      maximum: 4
 *      responses:
 *          200:
 *              description: Updated successfuly
 *          400:
 *              description: Status out of allowed range
 *            
 *      
 */
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

module.exports = router;