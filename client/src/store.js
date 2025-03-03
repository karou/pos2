import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Reducers
import authReducer from './reducers/authReducer';
import productReducer from './reducers/productReducer';
import orderReducer from './reducers/orderReducer';
import customerReducer from './reducers/customerReducer';
import cartReducer from './reducers/cartReducer';
import uiReducer from './reducers/uiReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  orders: orderReducer,
  customers: customerReducer,
  cart: cartReducer,
  ui: uiReducer
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;
