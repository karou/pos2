import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { 
  FaHome, 
  FaShoppingCart, 
  FaBoxes, 
  FaClipboardList, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt 
} from 'react-icons/fa';
import { logout } from '../../actions/authActions';
import '../../styles/Sidebar.css';

const Sidebar = ({ isOpen }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3 className="brand">MayuraPOS</h3>
      </div>
      
      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="user-info">
          <h6>{user?.name || 'User'}</h6>
          <span className="user-role">{user?.role || 'Staff'}</span>
        </div>
      </div>
      
      <Nav className="flex-column sidebar-nav">
        <Nav.Item>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </NavLink>
        </Nav.Item>
        
        <Nav.Item>
          <NavLink to="/pos" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaShoppingCart className="nav-icon" />
            <span className="nav-text">POS</span>
          </NavLink>
        </Nav.Item>
        
        <Nav.Item>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaBoxes className="nav-icon" />
            <span className="nav-text">Products</span>
          </NavLink>
        </Nav.Item>
        
        <Nav.Item>
          <NavLink to="/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaClipboardList className="nav-icon" />
            <span className="nav-text">Orders</span>
          </NavLink>
        </Nav.Item>
        
        <Nav.Item>
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaUsers className="nav-icon" />
            <span className="nav-text">Customers</span>
          </NavLink>
        </Nav.Item>
        
        <Nav.Item>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaChartBar className="nav-icon" />
            <span className="nav-text">Reports</span>
          </NavLink>
        </Nav.Item>
        
        <Nav.Item>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <FaCog className="nav-icon" />
            <span className="nav-text">Settings</span>
          </NavLink>
        </Nav.Item>
      </Nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="nav-icon" />
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
