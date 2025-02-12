const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const userService = require('./user-service');
const authService = require('../auth/auth-service');
const roles = require('./roles');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', (req, res) => {
    let userDTO = req.body;
    userDTO.role = roles.customer;

    userService.addUserStream(userDTO)
        .subscribe(
            user => {
                user.password = undefined;

                res.status(201).send(user);
            },
            error => {
                res.status(error.code).send({ error: error.message });
            });
});

router.get('/:id', authService.allowAll, async (req, res) => {
    try {
        let id = req.params.id;
        let user = await userService.getUser(id);

        if (user == null)
            return res.status(404).send({ error: 'User not found' });

        user.password = undefined;
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ error: error });
    }
});

router.patch('/:id', authService.allowAll, (req, res) => {
    let id = req.params.id;
    let token = req.body.token;

    userService.updateTokenStream(id, token)
        .subscribe(
            user => {
                return res.status(204).send();
            },
            error => {
                return res.status(error.code).send({ error: error.message });
            });
});

module.exports = router;