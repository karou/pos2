// client/src/pages/CircuitBreakerError.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { resetCircuitBreaker } from '../actions/authActions';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaSignInAlt, FaRedo } from 'react-icons/fa';

const CircuitBreakerError = () => {
  const dispatch = useDispatch();
  
  const handleReset = () => {
    // Reset the circuit breaker
    dispatch(resetCircuitBreaker());
    
    // Redirect to login page
    window.location.href = '/login';
  };
  
  const clearAllStorage = () => {
    // Clear all auth-related storage
    localStorage.removeItem('token');
    sessionStorage.removeItem('auth_attempts');
    sessionStorage.removeItem('auth_circuit_broken');
    
    // Clear all other storage for fresh start
    localStorage.clear();
    sessionStorage.clear();
    
    // Hard refresh the page
    window.location.href = '/login';
  };
  
  return (
    <div className="auth-error-page">
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Header className="bg-danger text-white text-center">
                <FaExclamationTriangle className="me-2" size={24} />
                <h4 className="mb-0">Authentication Error</h4>
              </Card.Header>
              
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <FaExclamationTriangle size={48} className="text-danger mb-3" />
                  <h5>Authentication Circuit Breaker Triggered</h5>
                  <p className="text-muted">
                    We've detected multiple failed authentication attempts, which might 
                    indicate a problem with your account or browser.
                  </p>
                </div>
                
                <div className="alert alert-secondary">
                  <h6>What happened?</h6>
                  <p className="mb-0">
                    To protect your account and prevent infinite loops, we've temporarily 
                    disabled authentication attempts. This can happen due to:
                  </p>
                  <ul className="mt-2 mb-0">
                    <li>Invalid or expired authentication tokens</li>
                    <li>Network connectivity issues</li>
                    <li>Browser storage problems</li>
                    <li>Server-side authentication issues</li>
                  </ul>
                </div>
                
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleReset}
                    className="mb-3"
                  >
                    <FaRedo className="me-2" /> Try Authentication Again
                  </Button>
                  
                  <Button 
                    variant="outline-danger" 
                    onClick={clearAllStorage}
                  >
                    <FaSignInAlt className="me-2" /> Clear All Data & Start Fresh
                  </Button>
                </div>
              </Card.Body>
              
              <Card.Footer className="bg-light text-center">
                <small className="text-muted">
                  If problems persist, please contact support or try a different browser.
                </small>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CircuitBreakerError;