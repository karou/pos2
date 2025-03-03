// server/routes/product.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate('category', 'name');
    
    res.json(products);
  } catch (err) {
    console.error(`Error getting products: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(`Error getting product: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a product
 * @access  Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, stock, barcode, sku, category, image } = req.body;
    
    // Create new product
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      barcode,
      sku,
      category,
      image
    });
    
    const product = await newProduct.save();
    
    res.status(201).json(product);
  } catch (err) {
    console.error(`Error creating product: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update product fields
    const { name, description, price, stock, barcode, sku, category, image } = req.body;
    
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (barcode) product.barcode = barcode;
    if (sku) product.sku = sku;
    if (category) product.category = category;
    if (image) product.image = image;
    
    const updatedProduct = await product.save();
    
    res.json(updatedProduct);
  } catch (err) {
    console.error(`Error updating product: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.remove();
    
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(`Error deleting product: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/products/search/:term
 * @desc    Search products by name or description
 * @access  Public
 */
router.get('/search/:term', async (req, res) => {
  try {
    const term = req.params.term;
    const regex = new RegExp(term, 'i');
    
    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { barcode: term },
        { sku: regex }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(products);
  } catch (err) {
    console.error(`Error searching products: ${err.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   PUT /api/products/:id/stock
 * @desc    Update product stock
 * @access  Private
 */
router.put('/:id/stock', auth, async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined) {
      return res.status(400).json({ message: 'Stock value is required' });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    product.stock = stock;
    
    const updatedProduct = await product.save();
    
    res.json(updatedProduct);
  } catch (err) {
    console.error(`Error updating stock: ${err.message}`);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;