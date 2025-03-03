// client/src/utils/minimalRequest.js
/**
 * Utility for making HTTP requests with minimal headers
 * Useful for working around "431 Request Header Fields Too Large" errors
 */

// Make an API call with minimal headers using fetch API instead of axios
export const minimalRequest = async (url, method = 'GET', data = null) => {
    // Use native fetch API which gives us more control over headers
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    const fullUrl = `${baseUrl}/${url}`.replace(/\/\//g, '/');
    
    console.log(`[Minimal Request] ${method} to ${fullUrl}`);
    
    // Create minimal headers - only what's absolutely necessary
    const headers = {
      'Content-Type': 'application/json',
    };
  
    // Only add auth token for authenticated requests
    const token = localStorage.getItem('token');
    if (token) {
      headers['x-auth-token'] = token;
    }
    
    // Configure request options
    const options = {
      method,
      headers,
      credentials: 'omit', // Don't send cookies
      mode: 'cors',
      cache: 'no-cache',
    };
  
    // Add body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
  
    try {
      const response = await fetch(fullUrl, options);
      
      // Parse response body
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        
        // Handle error response
        if (!response.ok) {
          throw {
            status: response.status,
            message: result.message || 'Request failed',
            data: result
          };
        }
        
        return result;
      } else {
        // Handle non-JSON response
        const text = await response.text();
        if (!response.ok) {
          throw {
            status: response.status,
            message: text || 'Request failed'
          };
        }
        return text;
      }
    } catch (error) {
      console.error('[Minimal Request] Error:', error);
      throw error;
    }
  };