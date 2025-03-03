// client/src/actions/productActions.js
import axios from 'axios';
import { setAlert } from './alertActions';
import {
  GET_PRODUCTS,
  GET_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  PRODUCTS_ERROR,
  PRODUCTS_LOADING
} from './types';
import { tokenConfig } from './authActions';

// Get all products
export const getProducts = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCTS_LOADING });

    const res = await axios.get('/api/products', tokenConfig(getState));

    dispatch({
      type: GET_PRODUCTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response?.data?.message || 'Error fetching products'
    });
  }
};

// Get product by ID
export const getProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCTS_LOADING });

    const res = await axios.get(`/api/products/${id}`, tokenConfig(getState));

    dispatch({
      type: GET_PRODUCT,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response?.data?.message || 'Error fetching product'
    });
  }
};

// Add new product
export const addProduct = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCTS_LOADING });

    // Check if formData is form-data or JSON
    const config = tokenConfig(getState);
    if (formData instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    const res = await axios.post('/api/products', formData, config);

    dispatch({
      type: ADD_PRODUCT,
      payload: res.data
    });

    dispatch(setAlert('Product added successfully', 'success'));
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response?.data?.message || 'Error adding product'
    });
    
    dispatch(setAlert('Error adding product', 'danger'));
  }
};

// Update product
export const updateProduct = (id, formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCTS_LOADING });

    // Check if formData is form-data or JSON
    const config = tokenConfig(getState);
    if (formData instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    const res = await axios.put(`/api/products/${id}`, formData, config);

    dispatch({
      type: UPDATE_PRODUCT,
      payload: res.data
    });

    dispatch(setAlert('Product updated successfully', 'success'));
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response?.data?.message || 'Error updating product'
    });
    
    dispatch(setAlert('Error updating product', 'danger'));
  }
};

// Delete product
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCTS_LOADING });

    await axios.delete(`/api/products/${id}`, tokenConfig(getState));

    dispatch({
      type: DELETE_PRODUCT,
      payload: id
    });

    dispatch(setAlert('Product deleted successfully', 'success'));
  } catch (err) {
    dispatch({
      type: PRODUCTS_ERROR,
      payload: err.response?.data?.message || 'Error deleting product'
    });
    
    dispatch(setAlert('Error deleting product', 'danger'));
  }
};