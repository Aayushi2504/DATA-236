const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Customer = require('../models/Customer');

// Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { customer_id, restaurant_id, status, items } = req.body;

    if (!customer_id || !restaurant_id || !status || !items || items.length === 0) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const newOrder = new Order({
      customer_id,
      restaurant_id,
      status,
      items,
      total
    });

    await newOrder.save();

    await Cart.deleteMany({ customer_id });

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: newOrder._id,
      total: total.toFixed(2)
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(order_id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Full Order
exports.updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Customer for Order
exports.getCustomerForOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id).populate('customer_id');
    if (!order || !order.customer_id) {
      return res.status(404).json({ error: 'Customer not found for this order' });
    }

    res.json(order.customer_id);
  } catch (error) {
    console.error('Error getting customer for order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
