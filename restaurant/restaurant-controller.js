const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const restaurantService = require('./restaurant-service');
const roles = require('../user/roles');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', async (req, res) => {
    try {
        let restaurantDTO = req.body;
        restaurantDTO.role = roles.restaurant;
        
        let createdRestaurant = await restaurantService.createRestaurant(restaurantDTO);
        res.status(201).send(createdRestaurant);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let restaurant = await restaurantService.getRestaurant(req.params.id);
        restaurant ? res.status(200).send(restaurant) : res.status(404).send({ error: 'Restaurant with given ID not found!' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/location/:id', async (req, res) => {
    try {
        let restaurants = await restaurantService.getAllRestaurantsFromLocation(req.params.id);
        if (restaurants.length == 0)
            res.status(404).send({ error: 'No restaurants in given location' });
        else
            res.status(200).send(restaurants);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let deletedRest = await restaurantService.deleteRestaurant(req.params.id);
        deletedRest ? res.status(404).send({error: 'Restaurant not found'}) : res.status(200).send(deletedRest);
    } catch(error) {
        res.status(500).send(error);
    }
});

module.exports = router;