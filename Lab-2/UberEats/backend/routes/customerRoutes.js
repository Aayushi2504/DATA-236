const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const favoriteController = require('../controllers/favoriteController');
const cartController = require('../controllers/cartController');

// Auth
router.post('/signup', customerController.signup);
router.post('/login', customerController.login);
router.post('/logout', customerController.logout);

// Profile
router.get('/profile/:customer_id', customerController.getProfile);
router.put('/profile/:customer_id', customerController.updateProfile);

// Favorites
router.post('/favorites', favoriteController.addFavorite);
router.get('/favorites/:customer_id', favoriteController.getFavorites);
router.delete('/favorites/:customer_id/:restaurant_id', favoriteController.removeFavorite);

// Cart
router.get('/cart/:customer_id', cartController.getCart);
router.post('/cart', cartController.addToCart);
router.delete('/cart/:cart_id', cartController.removeFromCart);
router.delete('/cart/clear/:customer_id', cartController.clearCart);

module.exports = router;
