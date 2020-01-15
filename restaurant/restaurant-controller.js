const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const restaurantService = require('./restaurant-service');
const roles = require('../user/roles');
const authService = require('../auth/auth-service');
const HttpError = require('../utils/http-error');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// router.post('/register', async (req, res) => {
//     try {
//         let restaurantDTO = req.body;
//         restaurantDTO.role = roles.restaurant;

//         let createdRestaurant = await restaurantService.createRestaurant(restaurantDTO);
//         res.status(201).send(createdRestaurant);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

router.post('/register', (req, res) => {
    let restaurantDTO = req.body;

    restaurantService.createRestaurantStream(restaurantDTO)
        .subscribe(
            createdRestaurant => {
                return res.status(201).send(createdRestaurant);
            },
            error => {
                if(error instanceof HttpError)
                    return res.status(error.code).send({ error: error.message });

                return res.status(500).send(error);
            });
});

module.exports = router;