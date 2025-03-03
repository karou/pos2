import {
  GET_PRODUCTS,
  GET_PRODUCT,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  PRODUCTS_LOADING,
  PRODUCTS_ERROR
} from '../actions/types';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PRODUCTS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
        loading: false
      };
    case GET_PRODUCT:
      return {
        ...state,
        product: action.payload,
        loading: false
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: [action.payload, ...state.products],
        loading: false
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product._id === action.payload._id ? action.payload : product
        ),
        loading: false
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload),
        loading: false
      };
    case PRODUCTS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
