const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const authService = require('../auth/auth-service');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/login', async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        let result = await authService.login(email, password);

        res.status(200).send(result);
    } catch (error) {
        res.status(error.code).send({ error: error });
    }
});

module.exports = router;