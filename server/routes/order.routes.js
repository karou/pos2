// server/routes/order.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('customer', 'name email')
      .populate('cashier', 'name');
    
    res.json(orders);
  } catch (err) {
    console.error(`Error getting orders: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('cashier', 'name')
      .populate('items.product', 'name price');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error(`Error getting order: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/orders
 * @desc    Create an order
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const { 
      customer, 
      items, 
      subtotal, 
      tax, 
      discount, 
      total, 
      paymentMethod, 
      paymentStatus,
      notes 
    } = req.body;
    
    // Create new order
    const newOrder = new Order({
      orderNumber: `ORD-${Date.now()}`,
      customer,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      paymentStatus,
      orderStatus: 'completed',
      cashier: req.user.id,
      notes
    });
    
    // Update product stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }
    
    const order = await newOrder.save();
    
    // Populate customer and cashier info
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('cashier', 'name');
    
    res.status(201).json(populatedOrder);
  } catch (err) {
    console.error(`Error creating order: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/orders/:id
 * @desc    Update an order
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order fields
    const { 
      paymentStatus, 
      orderStatus, 
      notes 
    } = req.body;
    
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus) order.orderStatus = orderStatus;
    if (notes) order.notes = notes;
    
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } catch (err) {
    console.error(`Error updating order: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an order
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete orders' });
    }
    
    await order.remove();
    
    res.json({ message: 'Order removed' });
  } catch (err) {
    console.error(`Error deleting order: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/orders/customer/:customerId
 * @desc    Get orders by customer ID
 * @access  Private
 */
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId })
      .sort({ createdAt: -1 })
      .populate('customer', 'name email')
      .populate('cashier', 'name');
    
    res.json(orders);
  } catch (err) {
    console.error(`Error getting customer orders: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/orders/stats/daily
 * @desc    Get daily order statistics
 * @access  Private
 */
router.get('/stats/daily', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const orders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    
    res.json({
      date: today,
      totalSales,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
    });
  } catch (err) {
    console.error(`Error getting daily stats: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;