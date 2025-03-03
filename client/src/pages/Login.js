// client/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaRedo } from 'react-icons/fa';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, circuitBroken } = useSelector(state => state.auth);

  // Clear errors on mount/unmount
  useEffect(() => {
    dispatch(clearErrors());
    return () => dispatch(clearErrors());
  }, [dispatch]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    // If circuit broken, show error page
    if (circuitBroken) {
      navigate('/reset-auth');
    }
  }, [isAuthenticated, navigate, circuitBroken]);
  
  // Track login attempts in component state
  useEffect(() => {
    if (formSubmitted && !loading && error) {
      setLoginAttempts(prev => prev + 1);
      setFormSubmitted(false);
    }
  }, [formSubmitted, loading, error]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple rapid submissions
    if (loading) return;
    
    // Clear errors before attempting login
    dispatch(clearErrors());
    
    // If too many attempts, show warning
    if (loginAttempts >= 5) {
      setFormSubmitted(false);
      return;
    }
    
    console.log(`Attempting login for ${email}`);
    setFormSubmitted(true);
    dispatch(login(email, password));
  };
  
  // Reset the login form completely
  const handleReset = () => {
    setEmail('');
    setPassword('');
    setLoginAttempts(0);
    setFormSubmitted(false);
    dispatch(clearErrors());
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <div className="text-center mb-4">
              <h1 className="brand-text">MayuraPOS</h1>
              <p className="text-muted">Sign in to your account</p>
            </div>
            <Card className="login-card">
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                {loginAttempts >= 5 && (
                  <Alert variant="warning">
                    <h5>Too many login attempts</h5>
                    <p>Please wait a moment before trying again, or reset the form.</p>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={handleReset}
                      className="mt-2"
                    >
                      <FaRedo className="me-1" /> Reset Form
                    </Button>
                  </Alert>
                )}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading || loginAttempts >= 5}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading || loginAttempts >= 5}
                      required
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100" 
                    disabled={loading || !email || !password || loginAttempts >= 5}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" /> Sign In
                      </>
                    )}
                  </Button>
                  
                  {formSubmitted && !loading && !error && !isAuthenticated && (
                    <Alert variant="info" className="mt-3">
                      Checking credentials...
                    </Alert>
                  )}
                </Form>
                
                {/* Debug information */}
                <div className="mt-3 text-muted small">
                  <div className="d-flex justify-content-between">
                    <div>App Version: 1.0.2</div>
                    <div>Attempts: {loginAttempts}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <div className="text-center mt-3">
              <p className="text-muted">
                &copy; {new Date().getFullYear()} MayuraPOS. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;