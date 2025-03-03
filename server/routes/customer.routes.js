// server/routes/customer.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Customer = require('../models/Customer');

/**
 * @route   GET /api/customers
 * @desc    Get all customers
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.json(customers);
  } catch (err) {
    console.error(`Error getting customers: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/customers/:id
 * @desc    Get customer by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (err) {
    console.error(`Error getting customer: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/customers
 * @desc    Create a customer
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, address, loyaltyPoints } = req.body;
    
    // Check if customer with the same email already exists
    if (email) {
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Customer with this email already exists' });
      }
    }
    
    // Create new customer
    const newCustomer = new Customer({
      name,
      email,
      phone,
      address,
      loyaltyPoints: loyaltyPoints || 0
    });
    
    const customer = await newCustomer.save();
    
    res.status(201).json(customer);
  } catch (err) {
    console.error(`Error creating customer: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/customers/:id
 * @desc    Update a customer
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Update customer fields
    const { name, email, phone, address, loyaltyPoints } = req.body;
    
    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;
    if (loyaltyPoints !== undefined) customer.loyaltyPoints = loyaltyPoints;
    
    const updatedCustomer = await customer.save();
    
    res.json(updatedCustomer);
  } catch (err) {
    console.error(`Error updating customer: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/customers/:id
 * @desc    Delete a customer
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    await customer.remove();
    
    res.json({ message: 'Customer removed' });
  } catch (err) {
    console.error(`Error deleting customer: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/customers/search/:term
 * @desc    Search customers by name, email, or phone
 * @access  Private
 */
router.get('/search/:term', auth, async (req, res) => {
  try {
    const term = req.params.term;
    const regex = new RegExp(term, 'i');
    
    const customers = await Customer.find({
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex }
      ]
    }).sort({ name: 1 });
    
    res.json(customers);
  } catch (err) {
    console.error(`Error searching customers: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/customers/loyalty/top
 * @desc    Get top customers by loyalty points
 * @access  Private
 */
router.get('/loyalty/top', auth, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    
    const customers = await Customer.find()
      .sort({ loyaltyPoints: -1 })
      .limit(limit);
    
    res.json(customers);
  } catch (err) {
    console.error(`Error getting top customers: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/customers/:id/loyalty
 * @desc    Update customer loyalty points
 * @access  Private
 */
router.put('/:id/loyalty', auth, async (req, res) => {
  try {
    const { points } = req.body;
    
    if (points === undefined) {
      return res.status(400).json({ message: 'Points value is required' });
    }
    
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    customer.loyaltyPoints = points;
    
    const updatedCustomer = await customer.save();
    
    res.json(updatedCustomer);
  } catch (err) {
    console.error(`Error updating loyalty points: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;