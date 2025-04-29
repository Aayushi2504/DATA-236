const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }
});

const Favorite = mongoose.model('Favorite', FavoriteSchema);

module.exports = Favorite;
