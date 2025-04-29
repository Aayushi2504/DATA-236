const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');

// Customer Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword
    });

    await newCustomer.save();

    res.status(201).json({
      message: 'Customer registered successfully',
      customer: { id: newCustomer._id, name, email }
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Customer Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.customerId = customer._id;

    res.json({ message: 'Login successful', customer });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Customer Logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};

// View Customer Profile
exports.getProfile = async (req, res) => {
  try {
    const { customer_id } = req.params;

    const customer = await Customer.findById(customer_id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Customer Profile
exports.updateProfile = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const { name, profile_picture, country, state } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (profile_picture) updateFields.profile_picture = profile_picture;
    if (country) updateFields.country = country;
    if (state) updateFields.state = state;

    const customer = await Customer.findByIdAndUpdate(
      customer_id,
      { $set: updateFields },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ message: 'Profile updated successfully', customer });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
