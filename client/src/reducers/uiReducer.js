import {
  SET_ALERT,
  REMOVE_ALERT,
  TOGGLE_SIDEBAR
} from '../actions/types';

const initialState = {
  alerts: [],
  sidebarOpen: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload]
      };
    case REMOVE_ALERT:
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      };
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
    default:
      return state;
  }
}
