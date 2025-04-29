const Favorite = require('../models/Favorite');

// Add Restaurant to Favorites
exports.addFavorite = async (req, res) => {
  try {
    const { customer_id, restaurant_id } = req.body;

    if (!customer_id || !restaurant_id) {
      return res.status(400).json({ error: 'Customer ID and Restaurant ID are required' });
    }

    const favorite = new Favorite({
      customer_id,
      restaurant_id
    });

    await favorite.save();

    res.status(201).json({ message: 'Restaurant added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// View Favorites
exports.getFavorites = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const favorites = await Favorite.find({ customer_id }).populate('restaurant_id');

    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove Favorite
exports.removeFavorite = async (req, res) => {
  try {
    const { customer_id, restaurant_id } = req.params;

    const deleted = await Favorite.findOneAndDelete({ customer_id, restaurant_id });

    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Restaurant removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
