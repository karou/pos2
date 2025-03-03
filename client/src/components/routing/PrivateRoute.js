// client/src/components/routing/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../layouts/Spinner';

// React Router v6 compatible PrivateRoute component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return <Spinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;