// client/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadUser, resetCircuitBreaker } from './actions/authActions';

// Import components
import Header from './components/layouts/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MinimalLogin from './pages/MinimalLogin';
import POS from './pages/POS';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import CircuitBreakerError from './pages/CircuitBreakerError';
import Spinner from './components/layouts/Spinner';

// Import bootstrap and custom styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

// Protected route component (with circuit breaker awareness)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, circuitBroken } = useSelector(state => state.auth);
  
  // If circuit breaker is triggered, show special error page
  if (circuitBroken) {
    return <CircuitBreakerError />;
  }
  
  // During authentication check, show loading spinner
  if (loading) {
    return <Spinner />;
  }
  
  // Once we have a definitive answer, either show content or redirect
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, circuitBroken } = useSelector(state => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  // Run once on component mount
  useEffect(() => {
    console.log('App mounted - checking auth status');
    
    // Start auth check if we have a token
    if (localStorage.token && !authChecked && !circuitBroken) {
      const authTimer = setTimeout(() => {
        dispatch(loadUser());
        setAuthChecked(true);
      }, 100);
      
      // Cleanup timer on unmount
      return () => clearTimeout(authTimer);
    } else {
      // Mark as checked if we don't have a token
      setAuthChecked(true);
    }
  }, [dispatch, authChecked, circuitBroken]);

  // Add a timeout to force completion of loading state
  useEffect(() => {
    const forceTimeout = setTimeout(() => {
      if (loading) {
        console.log('Forcing auth state completion after timeout');
        setAuthChecked(true);
      }
    }, 5000);
    
    return () => clearTimeout(forceTimeout);
  }, [loading]);

  // If circuit breaker was manually reset, try auth again
  useEffect(() => {
    if (!circuitBroken && localStorage.token && authChecked) {
      console.log('Circuit breaker was reset - retrying auth');
      const retryTimer = setTimeout(() => {
        dispatch(loadUser());
      }, 100);
      
      return () => clearTimeout(retryTimer);
    }
  }, [circuitBroken, dispatch, authChecked]);

  // Wait until initial auth check is complete
  if (!authChecked && loading) {
    return <div className="container mt-5"><Spinner /></div>;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        {isAuthenticated && <Header />}
        <main className={isAuthenticated ? 'main-content' : ''}>
          <Routes>
            <Route path="/login" element={
              circuitBroken ? 
                <CircuitBreakerError /> : 
                isAuthenticated ? 
                  <Navigate to="/" /> : 
                  <Login />
            } />
            <Route path="/reset-auth" element={
              <div className="container mt-5 text-center">
                <h2>Auth Reset Page</h2>
                <p>Click the button below to reset the authentication system</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    dispatch(resetCircuitBreaker());
                    window.location.href = '/login';
                  }}
                >
                  Reset Authentication
                </button>
              </div>
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/pos" element={
              <ProtectedRoute>
                <POS />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;