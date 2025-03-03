// client/src/actions/types.js

// Auth Types
export const USER_LOADED = 'USER_LOADED';
export const USER_LOADING = 'USER_LOADING';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

// Alert Types
export const SET_ALERT = 'SET_ALERT';
export const REMOVE_ALERT = 'REMOVE_ALERT';

// Product Types
export const GET_PRODUCTS = 'GET_PRODUCTS';
export const GET_PRODUCT = 'GET_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const PRODUCTS_ERROR = 'PRODUCTS_ERROR';
export const PRODUCTS_LOADING = 'PRODUCTS_LOADING';

// Customer Types
export const GET_CUSTOMERS = 'GET_CUSTOMERS';
export const GET_CUSTOMER = 'GET_CUSTOMER';
export const ADD_CUSTOMER = 'ADD_CUSTOMER';
export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER';
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER';
export const CUSTOMERS_ERROR = 'CUSTOMERS_ERROR';
export const CUSTOMERS_LOADING = 'CUSTOMERS_LOADING';

// Order Types
export const GET_ORDERS = 'GET_ORDERS';
export const GET_ORDER = 'GET_ORDER';
export const ADD_ORDER = 'ADD_ORDER';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const DELETE_ORDER = 'DELETE_ORDER';
export const ORDERS_ERROR = 'ORDERS_ERROR';
export const ORDERS_LOADING = 'ORDERS_LOADING';

// Cart Types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';
export const CLEAR_CART = 'CLEAR_CART';

// UI Types
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const TOGGLE_DARKMODE = 'TOGGLE_DARKMODE';

// Auth circuit breaker types
export const AUTH_TIMEOUT = 'AUTH_TIMEOUT';
export const AUTH_CIRCUIT_BREAK = 'AUTH_CIRCUIT_BREAK';