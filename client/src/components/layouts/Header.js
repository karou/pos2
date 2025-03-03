// client/src/components/Layout/Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/authActions';
import { 
  FaHome, 
  FaShoppingCart, 
  FaBoxes, 
  FaUsers, 
  FaClipboardList, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaUser
} from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Active link check
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="main-header">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          <span className="brand-text">MayuraPOS</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={isActive('/')}>
              <FaHome className="nav-icon" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/pos" className={isActive('/pos')}>
              <FaShoppingCart className="nav-icon" /> POS
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className={isActive('/products')}>
              <FaBoxes className="nav-icon" /> Products
            </Nav.Link>
            <Nav.Link as={Link} to="/customers" className={isActive('/customers')}>
              <FaUsers className="nav-icon" /> Customers
            </Nav.Link>
            <Nav.Link as={Link} to="/orders" className={isActive('/orders')}>
              <FaClipboardList className="nav-icon" /> Orders
            </Nav.Link>
            <Nav.Link as={Link} to="/reports" className={isActive('/reports')}>
              <FaChartBar className="nav-icon" /> Reports
            </Nav.Link>
            <Nav.Link as={Link} to="/settings" className={isActive('/settings')}>
              <FaCog className="nav-icon" /> Settings
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="dark" id="dropdown-user">
                <FaUser className="nav-icon" /> {user ? user.name : 'User'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;