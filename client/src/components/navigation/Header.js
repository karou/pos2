import React from 'react';
import { Navbar, Button, Dropdown } from 'react-bootstrap';
import { FaBars, FaBell, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/authActions';
import '../../styles/Header.css';

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <Navbar className="header-navbar" expand={false}>
      <Button 
        variant="link" 
        className="sidebar-toggle"
        onClick={toggleSidebar}
      >
        <FaBars />
      </Button>
      
      <div className="ms-auto d-flex align-items-center">
        <Dropdown align="end" className="me-3">
          <Dropdown.Toggle variant="link" className="notification-toggle">
            <FaBell />
            <span className="notification-badge">3</span>
          </Dropdown.Toggle>
          
          <Dropdown.Menu className="notification-menu">
            <div className="notification-header">
              <h6 className="mb-0">Notifications</h6>
              <small className="text-muted">3 New</small>
            </div>
            
            <Dropdown.Item className="notification-item">
              <div className="notification-content">
                <p className="mb-0">New order received</p>
                <small className="text-muted">5 minutes ago</small>
              </div>
            </Dropdown.Item>
            
            <Dropdown.Item className="notification-item">
              <div className="notification-content">
                <p className="mb-0">Low stock alert: Product X</p>
                <small className="text-muted">1 hour ago</small>
              </div>
            </Dropdown.Item>
            
            <Dropdown.Item className="notification-item">
              <div className="notification-content">
                <p className="mb-0">Daily sales report available</p>
                <small className="text-muted">3 hours ago</small>
              </div>
            </Dropdown.Item>
            
            <Dropdown.Divider />
            
            <Dropdown.Item className="text-center">
              <small>View all notifications</small>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        
        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="user-dropdown-toggle">
            <div className="user-avatar-sm">
              {user?.name?.charAt(0) || <FaUser />}
            </div>
          </Dropdown.Toggle>
          
          <Dropdown.Menu>
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Header;
