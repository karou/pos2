// client/src/reducers/customerReducer.js
import {
  GET_CUSTOMERS,
  GET_CUSTOMER,
  ADD_CUSTOMER,
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
  CUSTOMERS_ERROR,
  CUSTOMERS_LOADING
} from '../actions/types';

const initialState = {
  customers: [],
  customer: null,
  loading: false,
  error: null
};

export default function customerReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CUSTOMERS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_CUSTOMERS:
      return {
        ...state,
        customers: payload,
        loading: false,
        error: null
      };
    case GET_CUSTOMER:
      return {
        ...state,
        customer: payload,
        loading: false,
        error: null
      };
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [payload, ...state.customers],
        loading: false,
        error: null
      };
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer._id === payload._id ? payload : customer
        ),
        loading: false,
        error: null
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer._id !== payload),
        loading: false,
        error: null
      };
    case CUSTOMERS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}