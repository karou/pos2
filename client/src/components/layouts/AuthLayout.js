import React from 'react';
import '../../styles/AuthLayout.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-background"></div>
      <div className="auth-content">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
