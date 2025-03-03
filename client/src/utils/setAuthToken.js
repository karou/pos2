// client/src/utils/setAuthToken.js
import axios from 'axios';

/**
 * Sets the authentication token in the Axios headers
 * @param {string|boolean} token - The token to set, or false to remove the token
 */
const setAuthToken = token => {
  if (token) {
    // Set the token in Axios default headers
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Remove the token from Axios default headers
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;