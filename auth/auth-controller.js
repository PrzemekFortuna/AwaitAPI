const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const authService = require('../auth/auth-service');
const HttpError = require('../utils/http-error');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    authService.loginStream(email, password)
        .subscribe(
            token => {
                return res.status(200).send(token);
            },
            error => {
                if (error instanceof HttpError)
                    return res.status(error.code).send(error.message);

                return res.status(500).send(error);
            });
});

module.exports = router;