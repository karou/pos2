const headerSizeMiddleware = (req, res, next) => {
  // Check if headers are too large
  const headerSize = JSON.stringify(req.headers).length;
  if (headerSize > 8192) { // Default limit is often 8KB
    console.warn(`Large header detected: ${headerSize} bytes`);
  }
  next();
};

module.exports = headerSizeMiddleware;
