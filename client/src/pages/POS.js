import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  ListGroup,
  InputGroup,
  Modal
} from 'react-bootstrap';
import { FaSearch, FaPlus, FaMinus, FaTrash, FaCreditCard, FaMoneyBill, FaMobile } from 'react-icons/fa';
import { getProducts } from '../actions/productActions';
import { addToCart, removeFromCart, updateCartItem, clearCart } from '../actions/cartActions';
import { createOrder } from '../actions/orderActions';
import { getCustomers, searchCustomers } from '../actions/customerActions';
import '../styles/POS.css';

const POS = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading } = useSelector(state => state.products);
  const { items: cartItems, total } = useSelector(state => state.cart);
  const { customers } = useSelector(state => state.customers);
  const { user } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  
  // Load products and customers on component mount
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCustomers());
  }, [dispatch]);
  
  // Filter products based on search term
  useEffect(() => {
    if (products) {
      setFilteredProducts(
        products.filter(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.barcode && product.barcode.includes(searchTerm))
        )
      );
    }
  }, [searchTerm, products]);
  
  // Filter customers based on search term
  useEffect(() => {
    if (customers && customerSearchTerm) {
      setFilteredCustomers(
        customers.filter(customer => 
          customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
          (customer.phone && customer.phone.includes(customerSearchTerm)) ||
          (customer.email && customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()))
        )
      );
      setShowCustomerDropdown(true);
    } else {
      setShowCustomerDropdown(false);
    }
  }, [customerSearchTerm, customers]);
  
  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      dispatch(addToCart(product));
    }
  };
  
  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };
  
  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItem(productId, quantity));
    } else {
      dispatch(removeFromCart(productId));
    }
  };
  
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowPaymentModal(true);
  };
  
  const handlePaymentSubmit = () => {
    const subtotal = total - discount;
    const tax = subtotal * 0.1; // 10% tax
    const finalTotal = subtotal + tax;
    
    const orderData = {
      items: cartItems,
      subtotal,
      tax,
      discount,
      total: finalTotal,
      paymentMethod,
      paymentStatus: 'completed',
      orderStatus: 'completed',
      cashier: user._id,
      customer: selectedCustomer ? selectedCustomer._id : null,
      notes
    };
    
    dispatch(createOrder(orderData));
    dispatch(clearCart());
    setShowPaymentModal(false);
    setAmountReceived('');
    setSelectedCustomer(null);
    setCustomerSearchTerm('');
    setDiscount(0);
    setNotes('');
  };
  
  const calculateChange = () => {
    if (!amountReceived) return 0;
    const finalTotal = (total - discount) * 1.1; // Apply tax after discount
    return parseFloat(amountReceived) - finalTotal;
  };
  
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm(customer.name);
    setShowCustomerDropdown(false);
  };
  
  const handleCustomerSearch = (e) => {
    const value = e.target.value;
    setCustomerSearchTerm(value);
    
    if (value.length > 2) {
      dispatch(searchCustomers(value));
    }
  };
  
  return (
    <Container fluid className="pos-container">
      <Row>
        {/* Products Section */}
        <Col md={8} className="products-section">
          <Card className="mb-3">
            <Card.Body>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search products by name, SKU or barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Card.Body>
          </Card>
          
          <Row className="products-grid">
            {productsLoading ? (
              <div className="text-center py-5">Loading products...</div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <Col key={product._id} xs={6} md={4} lg={3} className="mb-3">
                  <Card 
                    className={`product-card ${product.stock <= 0 ? 'out-of-stock' : ''}`}
                    onClick={() => handleAddToCart(product)}
                  >
                    <div className="product-img-container">
                      <img 
                        src={product.image || '/placeholder.jpg'} 
                        alt={product.name} 
                        className="product-img"
                      />
                      {product.stock <= 0 && (
                        <div className="out-of-stock-overlay">
                          <span>Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <Card.Body className="p-2">
                      <h6 className="product-name">{product.name}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="product-price">${product.price.toFixed(2)}</span>
                        <span className={`product-stock ${product.stock <= 5 ? 'low-stock' : ''}`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <div className="text-center py-5">No products found</div>
            )}
          </Row>
        </Col>
        
        {/* Cart Section */}
        <Col md={4} className="cart-section">
          <Card className="cart-card">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Current Order</h5>
              {cartItems.length > 0 && (
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => dispatch(clearCart())}
                >
                  Clear Cart
                </Button>
              )}
            </Card.Header>
            
            <div className="customer-select-container">
              <InputGroup>
                <InputGroup.Text>Customer</InputGroup.Text>
                <Form.Control
                  placeholder="Search customer..."
                  value={customerSearchTerm}
                  onChange={handleCustomerSearch}
                />
                {selectedCustomer && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerSearchTerm('');
                    }}
                  >
                    <FaTrash />
                  </Button>
                )}
              </InputGroup>
              
              {showCustomerDropdown && filteredCustomers.length > 0 && (
                <div className="customer-dropdown">
                  {filteredCustomers.map(customer => (
                    <div 
                      key={customer._id} 
                      className="customer-dropdown-item"
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <div className="customer-name">{customer.name}</div>
                      <div className="customer-details">
                        {customer.phone && <span>{customer.phone}</span>}
                        {customer.email && <span>{customer.email}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Card.Body className="p-0">
              <ListGroup variant="flush" className="cart-items">
                {cartItems.length > 0 ? (
                  cartItems.map(item => (
                    <ListGroup.Item key={item._id} className="cart-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="cart-item-details">
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">${item.price.toFixed(2)} each</small>
                        </div>
                        <div className="cart-item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="quantity-control">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                          >
                            <FaMinus />
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleRemoveFromCart(item._id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <p className="mb-0">Cart is empty</p>
                    <small className="text-muted">Add products to begin</small>
                  </div>
                )}
              </ListGroup>
            </Card.Body>
            
            <Card.Footer>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax (10%):</span>
                <span>${((total - discount) * 0.1).toFixed(2)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-3 total-row">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold">${((total - discount) * 1.1).toFixed(2)}</span>
              </div>
              
              <Button 
                variant="success" 
                className="w-100"
                disabled={cartItems.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      
      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Complete Payment</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h5>Order Summary</h5>
              <ListGroup className="mb-3">
                {cartItems.map(item => (
                  <ListGroup.Item key={item._id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <span>{item.name}</span>
                      <small className="d-block text-muted">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </small>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </ListGroup.Item>
                ))}
                
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Discount</span>
                  <div>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      size="sm"
                      style={{ width: '80px' }}
                    />
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Tax (10%)</span>
                  <span>${((total - discount) * 0.1).toFixed(2)}</span>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex justify-content-between">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold">${((total - discount) * 1.1).toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>
              
              <h5>Customer Information</h5>
              {selectedCustomer ? (
                <Card className="mb-3">
                  <Card.Body>
                    <h6>{selectedCustomer.name}</h6>
                    {selectedCustomer.phone && <p className="mb-1">Phone: {selectedCustomer.phone}</p>}
                    {selectedCustomer.email && <p className="mb-1">Email: {selectedCustomer.email}</p>}
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setCustomerSearchTerm('');
                      }}
                    >
                      Change Customer
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <Form className="mb-3">
                  <Form.Group className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Search customer..."
                      value={customerSearchTerm}
                      onChange={handleCustomerSearch}
                    />
                    
                    {showCustomerDropdown && filteredCustomers.length > 0 && (
                      <div className="customer-dropdown">
                        {filteredCustomers.map(customer => (
                          <div 
                            key={customer._id} 
                            className="customer-dropdown-item"
                            onClick={() => handleSelectCustomer(customer)}
                          >
                            <div className="customer-name">{customer.name}</div>
                            <div className="customer-details">
                              {customer.phone && <span>{customer.phone}</span>}
                              {customer.email && <span>{customer.email}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Form.Group>
                </Form>
              )}
              
              <h5>Order Notes</h5>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Add notes to this order..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <h5>Payment Method</h5>
              <div className="payment-methods mb-4">
                <Button
                  variant={paymentMethod === 'cash' ? 'primary' : 'outline-primary'}
                  className="payment-method-btn"
                  onClick={() => setPaymentMethod('cash')}
                >
                  <FaMoneyBill className="mb-2" size={24} />
                  <span>Cash</span>
                </Button>
                
                <Button
                  variant={paymentMethod === 'card' ? 'primary' : 'outline-primary'}
                  className="payment-method-btn"
                  onClick={() => setPaymentMethod('card')}
                >
                  <FaCreditCard className="mb-2" size={24} />
                  <span>Card</span>
                </Button>
                
                <Button
                  variant={paymentMethod === 'mobile_payment' ? 'primary' : 'outline-primary'}
                  className="payment-method-btn"
                  onClick={() => setPaymentMethod('mobile_payment')}
                >
                  <FaMobile className="mb-2" size={24} />
                  <span>Mobile</span>
                </Button>
              </div>
              
              {paymentMethod === 'cash' && (
                <div className="cash-payment-details">
                  <Form.Group className="mb-3">
                    <Form.Label>Amount Received</Form.Label>
                    <Form.Control
                      type="number"
                      min={(total - discount) * 1.1}
                      step="0.01"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                    />
                  </Form.Group>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <span>Change:</span>
                    <span className="fw-bold">
                      ${calculateChange() > 0 ? calculateChange().toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'card' && (
                <div className="card-payment-message">
                  <p className="text-center">
                    Process card payment on your terminal.
                  </p>
                </div>
              )}
              
              {paymentMethod === 'mobile_payment' && (
                <div className="mobile-payment-message">
                  <p className="text-center">
                    Scan QR code or process mobile payment.
                  </p>
                </div>
              )}
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="success" 
            onClick={handlePaymentSubmit}
            disabled={
              paymentMethod === 'cash' && 
              (!amountReceived || parseFloat(amountReceived) < (total - discount) * 1.1)
            }
          >
            Complete Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default POS;
