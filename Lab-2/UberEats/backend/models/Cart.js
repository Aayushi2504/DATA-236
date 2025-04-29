const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  dish_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: true },
  quantity: { type: Number, required: true }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
