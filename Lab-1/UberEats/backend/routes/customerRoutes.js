const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Auth
router.post('/signup', customerController.signup);
router.post('/login', customerController.login);
router.post('/logout', customerController.logout);

// Profile
router.get('/profile/:customer_id', customerController.getProfile);
router.put('/profile/:customer_id', customerController.updateProfile);

// Orders
router.get('/orders/:customer_id', customerController.getOrderHistory);

// Favorites
router.post('/favorites', customerController.addFavorite);
router.get('/favorites/:customer_id', customerController.getFavorites);
router.delete('/favorites/:customer_id/:restaurant_id', customerController.removeFavorite);

// Cart
router.get('/cart/:customer_id', customerController.getCart);
router.post('/cart', customerController.addToCart);
router.delete('/cart/:cart_id', customerController.removeFromCart);
router.delete('/cart/clear/:customer_id', customerController.clearCart);

module.exports = router;
