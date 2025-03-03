// client/src/reducers/productReducer.js
import {
  GET_PRODUCTS,
  GET_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  PRODUCTS_ERROR,
  PRODUCTS_LOADING
} from '../actions/types';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null
};

export default function productReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PRODUCTS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PRODUCTS:
      return {
        ...state,
        products: payload,
        loading: false,
        error: null
      };
    case GET_PRODUCT:
      return {
        ...state,
        product: payload,
        loading: false,
        error: null
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [payload, ...state.products],
        loading: false,
        error: null
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product._id === payload._id ? payload : product
        ),
        loading: false,
        error: null
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== payload),
        loading: false,
        error: null
      };
    case PRODUCTS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}