// client/src/actions/customerActions.js
import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_CUSTOMERS,
  GET_CUSTOMER,
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
  CUSTOMERS_ERROR,
  CUSTOMERS_LOADING
} from './types';
import { tokenConfig } from './authActions';

// Get all customers
export const getCustomers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CUSTOMERS_LOADING });

    const res = await axios.get('api/customers', tokenConfig(getState));

    dispatch({
      type: GET_CUSTOMERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CUSTOMERS_ERROR,
      payload: err.response?.data?.message || 'Error fetching customers'
    });
  }
};

// Get customer by ID
export const getCustomer = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CUSTOMERS_LOADING });

    const res = await axios.get(`api/customers/${id}`, tokenConfig(getState));

    dispatch({
      type: GET_CUSTOMER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CUSTOMERS_ERROR,
      payload: err.response?.data?.message || 'Error fetching customer'
    });
  }
};

// Add new customer
export const addCustomer = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CUSTOMERS_LOADING });

    const res = await axios.post('api/customers', formData, tokenConfig(getState));

    dispatch({
      type: ADD_CUSTOMER,
      payload: res.data
    });

    dispatch(setAlert('Customer added successfully', 'success'));
  } catch (err) {
    dispatch({
      type: CUSTOMERS_ERROR,
      payload: err.response?.data?.message || 'Error adding customer'
    });
    dispatch(setAlert('Error adding customer', 'danger'));
  }
};

// Update customer
export const updateCustomer = (id, formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CUSTOMERS_LOADING });

    const res = await axios.put(`api/customers/${id}`, formData, tokenConfig(getState));

    dispatch({
      type: UPDATE_CUSTOMER,
      payload: res.data
    });

    dispatch(setAlert('Customer updated successfully', 'success'));
  } catch (err) {
    dispatch({
      type: CUSTOMERS_ERROR,
      payload: err.response?.data?.message || 'Error updating customer'
    });
    dispatch(setAlert('Error updating customer', 'danger'));
  }
};

// Delete customer
export const deleteCustomer = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CUSTOMERS_LOADING });

    await axios.delete(`api/customers/${id}`, tokenConfig(getState));

    dispatch({
      type: DELETE_CUSTOMER,
      payload: id
    });

    dispatch(setAlert('Customer deleted successfully', 'success'));
  } catch (err) {
    dispatch({
      type: CUSTOMERS_ERROR,
      payload: err.response?.data?.message || 'Error deleting customer'
    });
    dispatch(setAlert('Error deleting customer', 'danger'));
  }
};

// Search customers
export const searchCustomers = (term) => async (dispatch, getState) => {
  try {
    dispatch({ type: CUSTOMERS_LOADING });

    const res = await axios.get(`api/customers/search?term=${term}`, tokenConfig(getState));

    dispatch({
      type: GET_CUSTOMERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CUSTOMERS_ERROR,
      payload: err.response?.data?.message || 'Error searching customers'
    });
  }
};