// client/src/reducers/index.js
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import alertReducer from './alertReducer';
import productReducer from './productReducer';
import customerReducer from './customerReducer';
import orderReducer from './orderReducer';
import cartReducer from './cartReducer';

export default combineReducers({
  auth: authReducer,
  alerts: alertReducer,
  products: productReducer,
  customers: customerReducer,
  orders: orderReducer,
  cart: cartReducer
});