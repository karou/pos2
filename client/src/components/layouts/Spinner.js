// client/src/components/layout/Spinner.js
import React from 'react';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const Spinner = () => {
  return (
    <div className="spinner-container">
      <BootstrapSpinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">Loading...</span>
      </BootstrapSpinner>
    </div>
  );
};

export default Spinner;