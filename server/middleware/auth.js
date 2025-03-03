// server/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware to validate JWT token and set user in request
 */
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    
    // Set user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(`Token verification error: ${err.message}`);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;