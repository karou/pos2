// client/src/pages/Orders.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders, updateOrderStatus, deleteOrder } from '../actions/orderActions';
import { FaSearch, FaEye, FaTrash, FaPrint, FaEdit } from 'react-icons/fa';
import Spinner from '../components/layouts/Spinner';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.orders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  useEffect(() => {
    if (orders) {
      setFilteredOrders(
        orders.filter(order => 
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.customer && order.customer.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
  }, [searchTerm, orders]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'processing':
        return <Badge bg="info">Processing</Badge>;
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (method) => {
    switch (method) {
      case 'cash':
        return <Badge bg="success">Cash</Badge>;
      case 'card':
        return <Badge bg="primary">Card</Badge>;
      case 'mobile_payment':
        return <Badge bg="info">Mobile</Badge>;
      default:
        return <Badge bg="secondary">{method}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const handleStatusChange = async () => {
    if (selectedOrder && newStatus) {
      await dispatch(updateOrderStatus(selectedOrder._id, newStatus));
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus('');
    }
  };

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setShowStatusModal(true);
  };

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      await dispatch(deleteOrder(selectedOrder._id));
      setShowDeleteModal(false);
      setSelectedOrder(null);
    }
  };

  const handleOpenDeleteModal = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleOpenDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handlePrintReceipt = (order) => {
    // Implement receipt printing logic
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: 'Courier New', monospace; font-size: 12px; margin: 0; padding: 20px; }
            .receipt { width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .store-name { font-size: 18px; font-weight: bold; }
            .store-info { margin-bottom: 10px; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .item-name { width: 60%; }
            .item-qty { width: 10%; text-align: center; }
            .item-price { width: 30%; text-align: right; }
            .totals { margin-top: 10px; }
            .total-line { display: flex; justify-content: space-between; }
            .grand-total { font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
            @media print {
              body { margin: 0; padding: 0; }
              .receipt { width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="store-name">YOUR STORE NAME</div>
              <div class="store-info">123 Main Street, City</div>
              <div class="store-info">Phone: (123) 456-7890</div>
              <div class="store-info">Date: ${formatDate(order.createdAt)}</div>
              ${order.customer ? `<div class="store-info">Customer: ${order.customer.name}</div>` : ''}
              <div class="store-info">Order #: ${order.orderNumber || order._id}</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="items">
              <div class="item" style="font-weight: bold;">
                <div class="item-name">Item</div>
                <div class="item-qty">Qty</div>
                <div class="item-price">Price</div>
              </div>
              ${order.items.map(item => `
                <div class="item">
                  <div class="item-name">${item.name}</div>
                  <div class="item-qty">${item.quantity}</div>
                  <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
            
            <div class="divider"></div>
            
            <div class="totals">
              <div class="total-line">
                <div>Subtotal:</div>
                <div>$${order.subtotal.toFixed(2)}</div>
              </div>
              <div class="total-line">
                <div>Discount:</div>
                <div>$${order.discount ? order.discount.toFixed(2) : '0.00'}</div>
              </div>
              <div class="total-line">
                <div>Tax (10%):</div>
                <div>$${order.tax.toFixed(2)}</div>
              </div>
              <div class="total-line grand-total">
                <div>TOTAL:</div>
                <div>$${order.total.toFixed(2)}</div>
              </div>
              <div class="total-line">
                <div>Payment Method:</div>
                <div>${order.paymentMethod === 'cash' ? 'Cash' : 
                      order.paymentMethod === 'card' ? 'Card' : 'Mobile Payment'}</div>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
              <p>Thank you for your purchase!</p>
              <p>Please come again</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container fluid className="py-3">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">Orders</h1>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <div className="d-flex">
            <Form.Control
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
            />
            <Button variant="primary">
              <FaSearch />
            </Button>
          </div>
        </Col>
        <Col md={6} className="text-md-end">
          <Form.Select className="d-inline-block w-auto">
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <tr key={order._id}>
                        <td>{order.orderNumber || order._id.substring(0, 8)}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{order.customer ? order.customer.name : 'Guest'}</td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>{getPaymentBadge(order.paymentMethod)}</td>
                        <td>{getStatusBadge(order.orderStatus)}</td>
                        <td>
                          <Button 
                            variant="info" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleOpenDetailsModal(order)}
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handleOpenStatusModal(order)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="success" 
                            size="sm" 
                            className="me-1"
                            onClick={() => handlePrintReceipt(order)}
                          >
                            <FaPrint />
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleOpenDeleteModal(order)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Status Update Modal */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Order #{selectedOrder?.orderNumber || (selectedOrder?._id?.substring(0, 8))}</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleStatusChange}>
            Update Status
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this order?</p>
          <p><strong>Order #{selectedOrder?.orderNumber || (selectedOrder?._id?.substring(0, 8))}</strong></p>
          <p>This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteOrder}>
            Delete Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Order Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Order Details #{selectedOrder?.orderNumber || (selectedOrder?._id?.substring(0, 8))}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h5>Order Information</h5>
                      <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedOrder.orderStatus)}</p>
                      <p><strong>Payment Method:</strong> {getPaymentBadge(selectedOrder.paymentMethod)}</p>
                      <p><strong>Cashier:</strong> {selectedOrder.cashier?.name || 'Unknown'}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h5>Customer Information</h5>
                      {selectedOrder.customer ? (
                        <>
                          <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                          <p><strong>Email:</strong> {selectedOrder.customer.email || 'N/A'}</p>
                          <p><strong>Phone:</strong> {selectedOrder.customer.phone || 'N/A'}</p>
                        </>
                      ) : (
                        <p>Guest Customer</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="mb-3">
                <Card.Body>
                  <h5>Order Items</h5>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td>{item.quantity}</td>
                          <td className="text-end">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <h5>Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Discount:</span>
                    <span>{formatCurrency(selectedOrder.discount || 0)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax (10%):</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 fw-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-3">
                      <h6>Notes</h6>
                      <p>{selectedOrder.notes}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={() => handlePrintReceipt(selectedOrder)}
          >
            <FaPrint className="me-1" /> Print Receipt
          </Button>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Orders;