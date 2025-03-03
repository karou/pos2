// client/src/actions/orderActions.js
import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_ORDERS,
  GET_ORDER,
  ADD_ORDER,
  UPDATE_ORDER,
  DELETE_ORDER,
  ORDERS_ERROR,
  ORDERS_LOADING
} from './types';
import { tokenConfig } from './authActions';

// Get all orders
export const getOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDERS_LOADING });

    const res = await axios.get('/api/orders', tokenConfig(getState));

    dispatch({
      type: GET_ORDERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ORDERS_ERROR,
      payload: err.response?.data?.message || 'Error fetching orders'
    });
  }
};

// Get order by ID
export const getOrder = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDERS_LOADING });

    const res = await axios.get(`/api/orders/${id}`, tokenConfig(getState));

    dispatch({
      type: GET_ORDER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: ORDERS_ERROR,
      payload: err.response?.data?.message || 'Error fetching order'
    });
  }
};

// Create new order
export const createOrder = (orderData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDERS_LOADING });

    const res = await axios.post('/api/orders', orderData, tokenConfig(getState));

    dispatch({
      type: ADD_ORDER,
      payload: res.data
    });

    dispatch(setAlert('Order created successfully', 'success'));
    
    return res.data; // Return order data for receipt printing, etc.
  } catch (err) {
    dispatch({
      type: ORDERS_ERROR,
      payload: err.response?.data?.message || 'Error creating order'
    });
    
    dispatch(setAlert('Error creating order', 'danger'));
    throw err; // Re-throw to handle in components
  }
};

// Update order
export const updateOrder = (id, orderData) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDERS_LOADING });

    const res = await axios.put(`/api/orders/${id}`, orderData, tokenConfig(getState));

    dispatch({
      type: UPDATE_ORDER,
      payload: res.data
    });

    dispatch(setAlert('Order updated successfully', 'success'));
  } catch (err) {
    dispatch({
      type: ORDERS_ERROR,
      payload: err.response?.data?.message || 'Error updating order'
    });
    
    dispatch(setAlert('Error updating order', 'danger'));
  }
};

// Update order status only
export const updateOrderStatus = (id, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDERS_LOADING });

    const res = await axios.patch(
      `/api/orders/${id}/status`, 
      { status }, 
      tokenConfig(getState)
    );

    dispatch({
      type: UPDATE_ORDER,
      payload: res.data
    });

    dispatch(setAlert(`Order status updated to ${status}`, 'success'));
    return res.data;
  } catch (err) {
    dispatch({
      type: ORDERS_ERROR,
      payload: err.response?.data?.message || 'Error updating order status'
    });
    
    dispatch(setAlert('Error updating order status', 'danger'));
    throw err;
  }
};

// Delete order
export const deleteOrder = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDERS_LOADING });

    await axios.delete(`/api/orders/${id}`, tokenConfig(getState));

    dispatch({
      type: DELETE_ORDER,
      payload: id
    });

    dispatch(setAlert('Order deleted successfully', 'success'));
  } catch (err) {
    dispatch({
      type: ORDERS_ERROR,
      payload: err.response?.data?.message || 'Error deleting order'
    });
    
    dispatch(setAlert('Error deleting order', 'danger'));
  }
};