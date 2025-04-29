const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dishController');

// Dishes
router.get('/', dishController.getAllDishes);
router.get('/search', dishController.searchDishesByName);
router.get('/category', dishController.searchDishesByCategory);
router.get('/:dish_id', dishController.getDishById);

module.exports = router;
