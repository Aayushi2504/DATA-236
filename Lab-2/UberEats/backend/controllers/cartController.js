const Cart = require('../models/Cart');

// Added to Cart
exports.addToCart = async (req, res) => {
  try {
    const { customer_id, dish_id, quantity } = req.body;

    if (!customer_id || !dish_id || !quantity) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const cartItem = new Cart({
      customer_id,
      dish_id,
      quantity
    });

    await cartItem.save();

    res.status(201).json({ message: 'Dish added to cart successfully' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// View Cart
exports.getCart = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const cartItems = await Cart.find({ customer_id }).populate('dish_id');

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove Dish from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { cart_id } = req.params;

    const deleted = await Cart.findByIdAndDelete(cart_id);

    if (!deleted) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Dish removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const { customer_id } = req.params;

    await Cart.deleteMany({ customer_id });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
