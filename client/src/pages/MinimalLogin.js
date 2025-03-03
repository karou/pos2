// client/src/pages/MinimalLogin.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

// This login component uses the native fetch API instead of axios
// to minimize request headers and avoid the 431 error
const MinimalLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  // Clear browser storage to avoid header size issues
  const clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    console.log('All browser storage cleared');
    setSuccessMessage('Storage cleared. You can try logging in now.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(`Attempting login for ${email} with minimal headers`);

      // Using fetch instead of axios for minimal headers
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'omit', // Don't send cookies
      });

      // Parse the response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login successful');

      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token saved to localStorage');
      }

      // Add a delay before redirect to ensure token is stored
      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <div className="text-center mb-4">
              <h1 className="brand-text">MayuraPOS</h1>
              <p className="text-muted">Minimal Login (Header Fix)</p>
            </div>
            <Card className="login-card">
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
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
                      disabled={loading}
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading || !email || !password}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In (Minimal Headers)'
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline-secondary"
                    type="button"
                    className="w-100"
                    onClick={clearStorage}
                  >
                    Clear Storage & Reset
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <div className="text-center mt-3">
              <p className="text-muted">
                This is a minimal login page that avoids the 431 header size error.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MinimalLogin;