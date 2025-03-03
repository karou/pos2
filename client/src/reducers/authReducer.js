// client/src/reducers/authReducer.js
import {
  USER_LOADED,
  USER_LOADING,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false, // Start with false until user is verified
  loading: false, // Start with false to prevent immediate spinner
  loadingInitial: true, // Separate flag for initial load
  user: null,
  error: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        loadingInitial: false,
        user: payload,
        error: null
      };
    case LOGIN_SUCCESS:
      // Store token in localStorage directly from action creator
      // Don't set it here to avoid race conditions
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        loadingInitial: false,
        error: null
      };
    case AUTH_ERROR:
    case LOGIN_FAIL:
      // Clear token in localStorage from action creator
      // Don't clear it here to avoid race conditions
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        loadingInitial: false,
        user: null,
        error: payload
      };
    case LOGOUT:
      // Clear token in localStorage from action creator
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        loadingInitial: false,
        user: null
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      // After 5 seconds, set loadingInitial to false to prevent permanent spinner
      if (state.loadingInitial) {
        setTimeout(() => {
          if (state.loadingInitial) {
            return {
              ...state,
              loadingInitial: false
            };
          }
        }, 5000);
      }
      return state;
  }
}