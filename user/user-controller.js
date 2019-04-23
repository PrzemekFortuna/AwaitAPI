const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const userService = require('./user-service');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', async (req, res) => {
    try {
        let user = req.body;
        
        let newUser = await userService.addUser(user);
        newUser.password = undefined;
        res.status(201).send(newUser);

    } catch (error) {
        res.status(500).send({ error: error });
    }
});

router.get('/:id', async (req, res) => {
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

module.exports = router;