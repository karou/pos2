import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPrint } from 'react-icons/fa';

const Receipt = ({ order, customer, printReceipt }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'cash': return 'Cash';
      case 'card': return 'Card';
      case 'mobile_payment': return 'Mobile Payment';
      default: return method;
    }
  };

  return (
    <div className="receipt-container">
      <div className="receipt-actions mb-3">
        <Button variant="primary" onClick={printReceipt}>
          <FaPrint className="me-2" /> Print Receipt
        </Button>
      </div>

      <div className="receipt-preview">
        <div className="receipt-header text-center">
          <h4>YOUR STORE NAME</h4>
          <p>123 Main Street, City</p>
          <p>Phone: (123) 456-7890</p>
          <p>{formatDate(order.createdAt || new Date())}</p>
          {customer && <p>Customer: {customer.name}</p>}
          <p>Order #: {order.orderNumber || order._id}</p>
          <p>Cashier: {order.cashierName}</p>
        </div>

        <div className="receipt-divider my-3"></div>

        <div className="receipt-items">
          <div className="receipt-item-header d-flex justify-content-between">
            <span className="fw-bold">Item</span>
            <span className="fw-bold">Qty</span>
            <span className="fw-bold">Price</span>
          </div>

          {order.items.map((item, index) => (
            <div key={index} className="receipt-item d-flex justify-content-between">
              <span className="receipt-item-name">{item.name}</span>
              <span className="receipt-item-qty">{item.quantity}</span>
              <span className="receipt-item-price">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="receipt-divider my-3"></div>

        <div className="receipt-totals">
          <div className="d-flex justify-content-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Discount:</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>Tax (10%):</span>
            <span>{formatCurrency(order.tax)}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold">
            <span>TOTAL:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <span>Payment Method:</span>
            <span>{getPaymentMethodName(order.paymentMethod)}</span>
          </div>
        </div>

        <div className="receipt-divider my-3"></div>

        <div className="receipt-footer text-center">
          <p>Thank you for your purchase!</p>
          <p>Please come again</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
