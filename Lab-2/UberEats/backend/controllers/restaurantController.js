const Restaurant = require('../models/Restaurant');
const Dish = require('../models/Dish');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');

// Restaurant Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, location, description, contact_info, images, timings } = req.body;

    if (!name || !email || !password || !location) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRestaurant = new Restaurant({
      name,
      email,
      password: hashedPassword,
      location,
      description,
      contact_info,
      images,
      timings
    });

    await newRestaurant.save();

    res.status(201).json({ message: 'Restaurant registered successfully', restaurant: { id: newRestaurant._id, name, email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Restaurant Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.restaurantId = restaurant._id;

    res.json({ message: 'Login successful', restaurant: { id: restaurant._id, name: restaurant.name, email: restaurant.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Restaurant Logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};

// Restaurant View Profile
exports.getProfile = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const restaurant = await Restaurant.findById(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('View profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Restaurant Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const { name, location, description, contact_info, images, timings } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (location) updateFields.location = location;
    if (description) updateFields.description = description;
    if (contact_info) updateFields.contact_info = contact_info;
    if (images) updateFields.images = images;
    if (timings) updateFields.timings = timings;

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurant_id,
      { $set: updateFields },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json({ message: 'Profile updated successfully', restaurant });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add Dish
exports.addDish = async (req, res) => {
  try {
    const { restaurant_id, name, ingredients, image, price, description, category } = req.body;

    if (!restaurant_id || !name || !price || !category) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const newDish = new Dish({
      restaurant_id,
      name,
      ingredients,
      image,
      price,
      description,
      category
    });

    await newDish.save();

    res.status(201).json({ message: 'Dish added successfully' });
  } catch (error) {
    console.error('Add dish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Dishes by Restaurant
exports.getDishes = async (req, res) => {
  try {
    const { restaurant_id } = req.params;
    const dishes = await Dish.find({ restaurant_id });

    res.json(dishes);
  } catch (error) {
    console.error('Get dishes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Dish
exports.updateDish = async (req, res) => {
  try {
    const { dish_id } = req.params;
    const { name, ingredients, image, price, description, category } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (ingredients) updateFields.ingredients = ingredients;
    if (image) updateFields.image = image;
    if (price) updateFields.price = price;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;

    const dish = await Dish.findByIdAndUpdate(
      dish_id,
      { $set: updateFields },
      { new: true }
    );

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json({ message: 'Dish updated successfully', dish });
  } catch (error) {
    console.error('Update dish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete Dish
exports.deleteDish = async (req, res) => {
  try {
    const { dish_id } = req.params;

    const dish = await Dish.findByIdAndDelete(dish_id);

    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error('Delete dish error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Restaurant Orders
exports.getOrders = async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    const orders = await Order.find({ restaurant_id }).populate('customer_id items.dish_id');

    res.json(orders);
  } catch (error) {
    console.error('Get restaurant orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
