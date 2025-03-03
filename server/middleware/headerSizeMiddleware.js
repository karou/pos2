// server/middleware/headerSizeMiddleware.js
const logger = require('../utils/logger');

/**
 * Middleware to handle large request headers
 * For auth routes, will try to salvage requests by removing non-essential headers
 */
const headerSizeMiddleware = (req, res, next) => {
  // Check current header size
  const headerSize = JSON.stringify(req.headers).length;
  const path = req.originalUrl || '';
  
  // Log large headers for auth routes to debug
  if (path.includes('/auth/')) {
    logger.info(`Auth request to ${req.method} ${path} - Header size: ${headerSize} bytes`);
  }
  
  // Warning threshold is 8KB
  if (headerSize > 8192) {
    logger.warn(`Large header detected: ${headerSize} bytes for ${path}`);
    
    // For auth routes, try to fix headers
    if (path.includes('/auth/')) {
      logger.info('Auth route - attempting to clean headers');
      
      // List of headers that are okay to keep
      const essentialHeaders = [
        'host',
        'content-type',
        'content-length',
        'accept',
        'x-auth-token'
      ];
      
      // Only keep essential headers
      const cleanedHeaders = {};
      for (const header of essentialHeaders) {
        if (req.headers[header]) {
          cleanedHeaders[header] = req.headers[header];
        }
      }
      
      // Replace headers with cleaned version
      req.headers = cleanedHeaders;
      
      // Log new size
      const newHeaderSize = JSON.stringify(req.headers).length;
      logger.info(`Headers cleaned: ${headerSize} -> ${newHeaderSize} bytes`);
      
      // If still too large, reject
      if (newHeaderSize > 16384) { // 16KB hard limit
        logger.error(`Headers still too large after cleaning: ${newHeaderSize} bytes`);
        return res.status(431).json({
          error: 'Request Header Fields Too Large',
          message: 'Headers still too large after cleaning. Please use minimal-login.'
        });
      }
    }
    // For non-auth routes, reject large headers immediately
    else if (headerSize > 16384) { // 16KB hard limit
      logger.error(`Headers too large: ${headerSize} bytes`);
      return res.status(431).json({
        error: 'Request Header Fields Too Large',
        message: 'The request headers are too large'
      });
    }
  }
  
  next();
};

module.exports = headerSizeMiddleware;