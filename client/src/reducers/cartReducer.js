import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
  CLEAR_CART
} from '../actions/types';

const initialState = {
  items: [],
  total: 0
};

// Calculate total price of items in cart
const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        item => item._id === action.payload._id
      );

      let updatedItems;

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + 1
            };
          }
          return item;
        });
      } else {
        // Item doesn't exist, add to cart
        updatedItems = [
          ...state.items,
          {
            ...action.payload,
            quantity: 1
          }
        ];
      }

      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    case REMOVE_FROM_CART: {
      const updatedItems = state.items.filter(
        item => item._id !== action.payload
      );

      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    case UPDATE_CART_ITEM: {
      const updatedItems = state.items.map(item => {
        if (item._id === action.payload.id) {
          return {
            ...item,
            quantity: action.payload.quantity
          };
        }
        return item;
      });

      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    case CLEAR_CART:
      return {
        ...state,
        items: [],
        total: 0
      };
    default:
      return state;
  }
}
