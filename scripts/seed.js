require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../server/models/User');
const Product = require('../server/models/Product');
const Category = require('../server/models/Category');
const Customer = require('../server/models/Customer');
const Order = require('../server/models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@mayurapos.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Manager User',
    email: 'manager@mayurapos.com',
    password: 'password123',
    role: 'manager'
  },
  {
    name: 'Cashier User',
    email: 'cashier@mayurapos.com',
    password: 'password123',
    role: 'cashier'
  }
];

const categories = [
  { name: 'Electronics', description: 'Electronic devices and accessories' },
  { name: 'Clothing', description: 'Apparel and fashion items' },
  { name: 'Food & Beverages', description: 'Consumable food and drink items' },
  { name: 'Home & Kitchen', description: 'Household and kitchen items' },
  { name: 'Beauty & Personal Care', description: 'Beauty products and personal care items' }
];

const products = [
  {
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features',
    price: 699.99,
    stock: 50,
    barcode: '1234567890123',
    sku: 'PHONE-X-001',
    image: 'smartphone.jpg'
  },
  {
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    stock: 25,
    barcode: '1234567890124',
    sku: 'LAPTOP-P-001',
    image: 'laptop.jpg'
  },
  {
    name: 'Wireless Earbuds',
    description: 'Premium wireless earbuds with noise cancellation',
    price: 149.99,
    stock: 100,
    barcode: '1234567890125',
    sku: 'AUDIO-E-001',
    image: 'earbuds.jpg'
  },
  {
    name: 'T-Shirt Basic',
    description: 'Comfortable cotton t-shirt',
    price: 19.99,
    stock: 200,
    barcode: '1234567890126',
    sku: 'CLOTH-T-001',
    image: 'tshirt.jpg'
  },
  {
    name: 'Jeans Classic',
    description: 'Classic fit denim jeans',
    price: 49.99,
    stock: 150,
    barcode: '1234567890127',
    sku: 'CLOTH-J-001',
    image: 'jeans.jpg'
  },
  {
    name: 'Coffee Premium',
    description: 'Premium ground coffee, 250g',
    price: 12.99,
    stock: 100,
    barcode: '1234567890128',
    sku: 'FOOD-C-001',
    image: 'coffee.jpg'
  },
  {
    name: 'Chocolate Bar',
    description: 'Gourmet chocolate bar, 100g',
    price: 4.99,
    stock: 300,
    barcode: '1234567890129',
    sku: 'FOOD-CH-001',
    image: 'chocolate.jpg'
  },
  {
    name: 'Kitchen Knife Set',
    description: 'Professional kitchen knife set, 5 pieces',
    price: 89.99,
    stock: 50,
    barcode: '1234567890130',
    sku: 'HOME-K-001',
    image: 'knives.jpg'
  },
  {
    name: 'Non-stick Pan',
    description: '28cm non-stick frying pan',
    price: 29.99,
    stock: 75,
    barcode: '1234567890131',
    sku: 'HOME-P-001',
    image: 'pan.jpg'
  },
  {
    name: 'Face Cream',
    description: 'Moisturizing face cream, 50ml',
    price: 24.99,
    stock: 100,
    barcode: '1234567890132',
    sku: 'BEAUTY-F-001',
    image: 'facecream.jpg'
  },
  {
    name: 'Shampoo',
    description: 'Revitalizing shampoo, 250ml',
    price: 9.99,
    stock: 150,
    barcode: '1234567890133',
    sku: 'BEAUTY-S-001',
    image: 'shampoo.jpg'
  }
];

const customers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA'
    },
    loyaltyPoints: 250
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-987-6543',
    address: {
      street: '456 Oak Ave',
      city: 'Somewhere',
      state: 'NY',
      zipCode: '67890',
      country: 'USA'
    },
    loyaltyPoints: 120
  },
  {
    name: 'Robert Johnson',
    email: 'robert@example.com',
    phone: '555-456-7890',
    address: {
      street: '789 Pine Rd',
      city: 'Nowhere',
      state: 'TX',
      zipCode: '54321',
      country: 'USA'
    },
    loyaltyPoints: 75
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create users
    const createdUsers = [];
    for (const user of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      const newUser = await User.create({
        ...user,
        password: hashedPassword
      });
      
      createdUsers.push(newUser);
    }
    
    console.log(`Created ${createdUsers.length} users`);
    
    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);
    
    // Create products with categories
    const productsWithCategories = products.map((product, index) => ({
      ...product,
      category: createdCategories[index % createdCategories.length]._id
    }));
    
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`Created ${createdProducts.length} products`);
    
    // Create customers
    const createdCustomers = await Customer.insertMany(customers);
    console.log(`Created ${createdCustomers.length} customers`);
    
    // Create sample orders
    const orders = [];
    
    // Create 10 sample orders
    for (let i = 0; i < 10; i++) {
      // Randomly select 1-5 products for this order
      const numProducts = Math.floor(Math.random() * 5) + 1;
      const orderProducts = [];
      let subtotal = 0;
      
      for (let j = 0; j < numProducts; j++) {
        const randomProduct = createdProducts[Math.floor(Math.random() * createdProducts.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const price = randomProduct.price;
        
        orderProducts.push({
          product: randomProduct._id,
          name: randomProduct.name,
          quantity,
          price
        });
        
        subtotal += price * quantity;
      }
      
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;
      
      // Random customer
      const customer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      
      // Random cashier
      const cashier = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      // Random date in the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      orders.push({
        customer: customer._id,
        items: orderProducts,
        subtotal,
        tax,
        total,
        paymentMethod: ['cash', 'card', 'mobile_payment'][Math.floor(Math.random() * 3)],
        paymentStatus: 'completed',
        orderStatus: 'completed',
        cashier: cashier._id,
        createdAt: date
      });
    }
    
    const createdOrders = await Order.insertMany(orders);
    console.log(`Created ${createdOrders.length} orders`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
