const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be greater than 0']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'Please add a SKU']
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for search
ProductSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
