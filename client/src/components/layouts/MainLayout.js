import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import '../../styles/MainLayout.css';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="main-layout">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        <Header toggleSidebar={toggleSidebar} />
        
        <Container fluid className="py-3">
          {children}
        </Container>
      </div>
    </div>
  );
};

export default MainLayout;
