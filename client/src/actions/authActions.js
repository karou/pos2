// client/src/actions/authActions.js
import axios from 'axios';
import { setAlert } from './alertActions';
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  AUTH_TIMEOUT,
  AUTH_CIRCUIT_BREAK
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Debug helper
const debug = (message) => {
  console.log(`[Auth] ${message}`);
};

// Check if circuit breaker is triggered
const isCircuitBroken = () => {
  return sessionStorage.getItem('auth_circuit_broken') === 'true';
};

// Load User with timeout and circuit breaker
export const loadUser = () => async dispatch => {
  // Circuit breaker - prevent excessive attempts
  if (isCircuitBroken()) {
    debug('Circuit breaker active - skipping auth check');
    dispatch({ type: AUTH_CIRCUIT_BREAK });
    return;
  }

  // If no token, don't even try
  if (!localStorage.token) {
    debug('No token found in localStorage');
    dispatch({ type: AUTH_ERROR });
    return;
  }

  try {
    debug('Loading user data...');
    dispatch({ type: USER_LOADING });
    
    // Set token to Auth header
    setAuthToken(localStorage.token);
    
    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 5000);
    });
    
    // Race between actual request and timeout
    const response = await Promise.race([
      axios.get('api/auth/me'),
      timeoutPromise
    ]);
    
    debug('User loaded successfully');
    dispatch({
      type: USER_LOADED,
      payload: response.data
    });
  } catch (err) {
    debug(`Auth error: ${err.message}`);
    
    // Handle timeout specifically
    if (err.message === 'Request timeout') {
      dispatch({ type: AUTH_TIMEOUT });
      return;
    }
    
    // Clear token on auth error
    localStorage.removeItem('token');
    setAuthToken(false);
    
    dispatch({
      type: AUTH_ERROR,
      payload: err.response ? err.response.data.message : 'Authentication failed'
    });
    
    // Check if we should circuit break after multiple failures
    const attempts = Number(sessionStorage.getItem('auth_attempts') || 0);
    if (attempts > 5) {
      debug('Too many failed attempts - breaking circuit');
      dispatch({ type: AUTH_CIRCUIT_BREAK });
    }
  }
};

// Login with safeguards
export const login = (email, password) => async dispatch => {
  // Clear previous errors
  dispatch({ type: CLEAR_ERRORS });
  
  // Circuit breaker check
  if (isCircuitBroken()) {
    debug('Circuit breaker active - login blocked');
    dispatch({ type: AUTH_CIRCUIT_BREAK });
    dispatch(setAlert('Too many failed attempts. Please try again later.', 'danger'));
    return;
  }
  
  try {
    debug(`Attempting login for ${email}`);
    dispatch({ type: USER_LOADING });
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = JSON.stringify({ email, password });

    const res = await axios.post('api/auth/login', body, config);
    debug('Login successful');

    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
    } else {
      debug('No token received!');
      throw new Error('No token received from server');
    }

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    // Reset circuit breaker
    sessionStorage.setItem('auth_attempts', '0');
    sessionStorage.removeItem('auth_circuit_broken');
    
    // Load user without causing a loop
    setTimeout(() => {
      dispatch(loadUser());
    }, 100);
  } catch (err) {
    debug(`Login failed: ${err.message}`);
    
    const errorMessage = err.response && err.response.data.message 
      ? err.response.data.message 
      : 'Login failed. Please check your credentials and try again.';
    
    dispatch(setAlert(errorMessage, 'danger'));

    dispatch({
      type: LOGIN_FAIL,
      payload: errorMessage
    });
  }
};

// Logout - clean and safe
export const logout = () => dispatch => {
  debug('Logging out user');
  localStorage.removeItem('token');
  sessionStorage.removeItem('auth_attempts');
  sessionStorage.removeItem('auth_circuit_broken');
  
  setAuthToken(false);
  
  dispatch({ type: LOGOUT });
};

// Clear Errors and reset attempts counter
export const clearErrors = () => dispatch => {
  debug('Clearing auth errors');
  sessionStorage.setItem('auth_attempts', '0');
  dispatch({ type: CLEAR_ERRORS });
};

// Manual circuit break reset
export const resetCircuitBreaker = () => dispatch => {
  debug('Manually resetting circuit breaker');
  sessionStorage.removeItem('auth_circuit_broken');
  sessionStorage.setItem('auth_attempts', '0');
  dispatch({ type: CLEAR_ERRORS });
};

// Utility to set token in headers for authenticated requests
export const tokenConfig = getState => {
  // Get token from Redux state
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};