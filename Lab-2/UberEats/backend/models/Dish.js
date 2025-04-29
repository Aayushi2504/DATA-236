const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [String],
  image: String,
  price: { type: Number, required: true },
  description: String,
  category: String,
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }
});

const Dish = mongoose.model('Dish', DishSchema);

module.exports = Dish;
