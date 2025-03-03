const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: false
  },
  items: [
    {
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'card', 'mobile_payment']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  cashier: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order number before saving
OrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    
    // Get the count of orders today and increment
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });
    
    // Format: YY-MM-DD-XXXX (where XXXX is the incremented count)
    this.orderNumber = `${year}${month}${day}-${('0000' + (count + 1)).slice(-4)}`;
  }
  
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
