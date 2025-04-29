const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profile_picture: String,
  country: String,
  state: String
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
