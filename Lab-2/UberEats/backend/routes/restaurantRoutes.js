const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

// Auth
router.post('/signup', restaurantController.signup);
router.post('/login', restaurantController.login);
router.post('/logout', restaurantController.logout);

// Profile
router.get('/profile/:restaurant_id', restaurantController.getProfile);
router.put('/profile/:restaurant_id', restaurantController.updateProfile);

// Dishes
router.post('/dishes', restaurantController.addDish);
router.get('/dishes/:restaurant_id', restaurantController.getDishes);
router.put('/dishes/:dish_id', restaurantController.updateDish);
router.delete('/dishes/:dish_id', restaurantController.deleteDish);

// Orders
router.get('/orders/:restaurant_id', restaurantController.getOrders);

module.exports = router;
