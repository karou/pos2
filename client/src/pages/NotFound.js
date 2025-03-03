import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <Container fluid className="not-found-container">
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <div className="not-found-content">
            <h1 className="not-found-title">404</h1>
            <h2 className="not-found-subtitle">Page Not Found</h2>
            <p className="not-found-text">
              The page you are looking for might have been removed, had its name changed,
              or is temporarily unavailable.
            </p>
            <Link to="/">
              <Button variant="primary" className="not-found-button">
                <FaHome className="me-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
