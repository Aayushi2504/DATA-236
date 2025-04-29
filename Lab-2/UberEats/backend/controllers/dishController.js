const Dish = require('../models/Dish');

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get dish by ID
exports.getDishById = async (req, res) => {
  try {
    const { dish_id } = req.params;
    const dish = await Dish.findById(dish_id);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }
    res.json(dish);
  } catch (error) {
    console.error('Error fetching dish:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search dishes by name
exports.searchDishesByName = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const dishes = await Dish.find({ name: { $regex: query, $options: 'i' } });
    res.json(dishes);
  } catch (error) {
    console.error('Error searching dishes:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search dishes by category
exports.searchDishesByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    const dishes = await Dish.find({ category });
    res.json(dishes);
  } catch (error) {
    console.error('Error searching dishes by category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
