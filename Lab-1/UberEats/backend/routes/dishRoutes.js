const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// Restaurants
router.get('/restaurants', dishController.getAllRestaurants);
router.get('/restaurants/search', dishController.searchRestaurantsByName);
router.get('/restaurants/location', dishController.searchRestaurantsByLocation);

// Dishes
router.get('/', dishController.getAllDishes);
router.get('/search', dishController.searchDishes);
router.get('/category', dishController.searchDishesByCategory);
router.get('/:dish_id', dishController.getDishById);

module.exports = router;
