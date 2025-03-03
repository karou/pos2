// client/src/utils/axiosConfig.js
import axios from 'axios';

// Configure axios defaults
const configureAxios = () => {
  // Set base URL for API requests (without trailing slash)
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  
  // Set default headers
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  
  // Disable sending cookies with requests by default
  axios.defaults.withCredentials = false;
  
  // Set reasonable timeouts
  axios.defaults.timeout = 10000; // 10 seconds
  
  // Add request interceptor to keep headers small
  axios.interceptors.request.use(
    config => {
      // Only include essential headers
      const essentialHeaders = {
        'Content-Type': 'application/json'
      };
      
      // Add auth token if available
      if (localStorage.token) {
        essentialHeaders['x-auth-token'] = localStorage.token;
      }
      
      // Replace existing headers with only essential ones
      config.headers = essentialHeaders;
      
      // Log request URL for debugging
      console.log(`Making request to: ${config.baseURL}${config.url}`);
      
      return config;
    },
    error => Promise.reject(error)
  );
  
  // Add response interceptor for global error handling
  axios.interceptors.response.use(
    response => response,
    error => {
      // Handle 431 errors (Request Header Fields Too Large)
      if (error.response && error.response.status === 431) {
        console.error('Header too large error detected, clearing localStorage');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
        
        // Force redirect to login page
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );
};

export default configureAxios;