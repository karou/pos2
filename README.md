# MayuraPOS

A modern Point of Sale system built with microservices architecture.

## Technologies Used

- **Frontend**: React, Redux, Bootstrap
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Caching**: Redis
- **Message Queue**: RabbitMQ
- **PWA Support**: Service Workers

## Features

- Real-time inventory management
- Order processing
- Customer management
- Sales reporting and analytics
- Multi-payment method support
- Responsive design for all devices
- Offline capability with PWA

## Architecture

MayuraPOS is built using a microservices architecture:

- **API Gateway**: Main entry point for client requests
- **Order Service**: Handles order processing and management
- **Inventory Service**: Manages product inventory and stock levels
- **Notification Service**: Handles system notifications and alerts

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Redis
- RabbitMQ

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mayura-pos.git
   cd mayura-pos
   ```

2. Install dependencies:
   ```
   npm run install:all
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/mayurapos
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   REDIS_HOST=localhost
   REDIS_PORT=6379
   RABBITMQ_URL=amqp://localhost
   ```

4. Seed the database with sample data:
   ```
   npm run seed
   ```

5. Start the development server:
   ```
   npm run dev:all
   ```

### Docker Setup

Alternatively, you can use Docker to run the application:

```
docker-compose up
```

## Microservices

### Order Service
Handles order processing, payment processing, and order management.

### Inventory Service
Manages product inventory, stock levels, and inventory updates.

### Notification Service
Handles system notifications, alerts, and communication with users.

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - Logout a user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/products/search/:term` - Search products

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get an order by ID
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order status
- `GET /api/orders/stats/daily` - Get daily sales stats

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a customer by ID
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer
- `GET /api/customers/search/:term` - Search customers

## License

This project is licensed under the MIT License - see the LICENSE file for details.
