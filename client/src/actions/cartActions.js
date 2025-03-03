import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART
} from './types';

// Add item to cart
export const addToCart = (product) => (dispatch) => {
  dispatch({
    type: ADD_TO_CART,
    payload: product
  });
};

// Remove item from cart
export const removeFromCart = (id) => (dispatch) => {
  dispatch({
    type: REMOVE_FROM_CART,
    payload: id
  });
};

// Update cart item quantity
export const updateCartItem = (id, quantity) => (dispatch) => {
  dispatch({
    type: UPDATE_CART_ITEM,
    payload: { id, quantity }
  });
};

// Clear cart
export const clearCart = () => (dispatch) => {
  dispatch({
    type: CLEAR_CART
  });
};
