import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
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
  Modal,
  Badge,
  Tabs,
  Tab,
  Dropdown,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaPlus, 
  FaMinus, 
  FaTrash, 
  FaCreditCard, 
  FaMoneyBill, 
  FaMobile, 
  FaPrint, 
  FaSave, 
  FaList,
  FaShoppingBag,
  FaBarcode,
  FaKeyboard,
  FaMoon,
  FaSun,
  FaHistory,
  FaWifi,
  FaPowerOff,
  FaCalculator
} from 'react-icons/fa';
import { getProducts } from '../actions/productActions';
import { addToCart, removeFromCart, updateCartItem, clearCart } from '../actions/cartActions';
import { createOrder } from '../actions/orderActions';
import { getCustomers, searchCustomers } from '../actions/customerActions';
import '../styles/POS.css';

// Add custom styles for login form
const formStyles = `
  .form-control-wide {
    width: 100%;
    min-width: 300px;
  }
  
  .auth-form {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
  }
  
  .auth-form .form-control {
    width: 100%;
    min-width: 300px;
  }
  
  .auth-form .form-group {
    width: 100%;
  }
  
  @media (max-width: 576px) {
    .auth-form {
      width: 90%;
    }
  }
`;

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
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [savedOrders, setSavedOrders] = useState([]);
  const [showSavedOrdersModal, setShowSavedOrdersModal] = useState(false);
  const [currentOrderName, setCurrentOrderName] = useState('');
  const [showSaveOrderModal, setShowSaveOrderModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showKeyboardShortcutsModal, setShowKeyboardShortcutsModal] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('pos-dark-mode') === 'true');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorExpression, setCalculatorExpression] = useState('');
  const [calculatorResult, setCalculatorResult] = useState('');
  const [quickActions, setQuickActions] = useState([]);
  const receiptRef = useRef(null);
  const barcodeInputRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Load products and customers on component mount
  useEffect(() => {
    dispatch(getProducts());
    dispatch(getCustomers());
  }, [dispatch]);
  
  // Extract unique categories from products
  useEffect(() => {
    if (products) {
      const uniqueCategories = [...new Set(products.map(product => product.category))];
      setCategories(uniqueCategories.filter(Boolean));
    }
  }, [products]);
  
  // Apply dark mode class to body and inject custom styles
  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('pos-dark-mode', darkMode);
    
    // Inject custom styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = formStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [darkMode]);
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Load transaction history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('pos-transaction-history');
    if (savedHistory) {
      try {
        setTransactionHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading transaction history:', error);
      }
    }
  }, []);
  
  // Load quick actions from localStorage
  useEffect(() => {
    const savedQuickActions = localStorage.getItem('pos-quick-actions');
    if (savedQuickActions) {
      try {
        setQuickActions(JSON.parse(savedQuickActions));
      } catch (error) {
        console.error('Error loading quick actions:', error);
      }
    } else {
      // Set default quick actions if none exist
      const defaultQuickActions = [
        { name: 'Discount 10%', action: 'discount', value: 10, type: 'percentage' },
        { name: 'Discount $5', action: 'discount', value: 5, type: 'fixed' },
        { name: 'Clear Cart', action: 'clearCart' },
        { name: 'Add Note', action: 'addNote' }
      ];
      setQuickActions(defaultQuickActions);
      localStorage.setItem('pos-quick-actions', JSON.stringify(defaultQuickActions));
    }
  }, []);
  
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
  
  const handleAddToCart = (product, quantity = 1) => {
    if (product.stock > 0) {
      // Find if product is already in cart
      const existingItem = cartItems.find(item => item._id === product._id);
      const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
      
      // Make sure we don't exceed stock
      if (newQuantity <= product.stock) {
        if (existingItem) {
          dispatch(updateCartItem(product._id, newQuantity));
        } else {
          const productWithQuantity = { ...product, quantity };
          dispatch(addToCart(productWithQuantity));
        }
      }
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
      notes,
      timestamp: new Date().toISOString()
    };
    
    // Save to transaction history
    const newHistory = [orderData, ...transactionHistory.slice(0, 99)]; // Keep last 100 transactions
    setTransactionHistory(newHistory);
    localStorage.setItem('pos-transaction-history', JSON.stringify(newHistory));
    
    // If online, send to server
    if (isOnline) {
      dispatch(createOrder(orderData));
    } else {
      // Store for later sync when back online
      const pendingOrders = JSON.parse(localStorage.getItem('pos-pending-orders') || '[]');
      pendingOrders.push(orderData);
      localStorage.setItem('pos-pending-orders', JSON.stringify(pendingOrders));
      
      // Show offline notification
      alert('You are currently offline. This order has been saved locally and will be synced when you reconnect.');
    }
    
    dispatch(clearCart());
    setShowPaymentModal(false);
    setAmountReceived('');
    setSelectedCustomer(null);
    setCustomerSearchTerm('');
    setDiscount(0);
    setNotes('');
    
    // Print receipt
    setTimeout(() => {
      handlePrintReceipt(orderData);
    }, 500);
  };
  
  const handlePrintReceipt = (orderData) => {
    if (receiptRef.current) {
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
                <div class="store-info">Date: ${new Date().toLocaleString()}</div>
                ${selectedCustomer ? `<div class="store-info">Customer: ${selectedCustomer.name}</div>` : ''}
              </div>
              
              <div class="divider"></div>
              
              <div class="items">
                <div class="item" style="font-weight: bold;">
                  <div class="item-name">Item</div>
                  <div class="item-qty">Qty</div>
                  <div class="item-price">Price</div>
                </div>
                ${orderData.items.map(item => `
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
                  <div>$${orderData.subtotal.toFixed(2)}</div>
                </div>
                <div class="total-line">
                  <div>Discount:</div>
                  <div>$${orderData.discount.toFixed(2)}</div>
                </div>
                <div class="total-line">
                  <div>Tax (10%):</div>
                  <div>$${orderData.tax.toFixed(2)}</div>
                </div>
                <div class="total-line grand-total">
                  <div>TOTAL:</div>
                  <div>$${orderData.total.toFixed(2)}</div>
                </div>
                <div class="total-line">
                  <div>Payment Method:</div>
                  <div>${orderData.paymentMethod === 'cash' ? 'Cash' : 
                         orderData.paymentMethod === 'card' ? 'Card' : 'Mobile Payment'}</div>
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
    }
  };
  
  const handleSaveOrder = () => {
    if (cartItems.length === 0) return;
    setShowSaveOrderModal(true);
  };
  
  const confirmSaveOrder = () => {
    const savedOrder = {
      id: Date.now(),
      name: currentOrderName || `Order #${savedOrders.length + 1}`,
      items: cartItems,
      customer: selectedCustomer,
      discount,
      notes,
      timestamp: new Date().toISOString()
    };
    
    setSavedOrders([...savedOrders, savedOrder]);
    dispatch(clearCart());
    setCurrentOrderName('');
    setShowSaveOrderModal(false);
    setSelectedCustomer(null);
    setCustomerSearchTerm('');
    setDiscount(0);
    setNotes('');
  };
  
  const handleLoadOrder = (order) => {
    // Clear current cart first
    dispatch(clearCart());
    
    // Add each item to cart
    order.items.forEach(item => {
      dispatch(addToCart(item));
    });
    
    // Set other order details
    if (order.customer) {
      setSelectedCustomer(order.customer);
      setCustomerSearchTerm(order.customer.name);
    }
    
    setDiscount(order.discount || 0);
    setNotes(order.notes || '');
    
    // Remove from saved orders
    setSavedOrders(savedOrders.filter(savedOrder => savedOrder.id !== order.id));
    setShowSavedOrdersModal(false);
  };
  
  const handleBarcodeSubmit = () => {
    if (!barcodeInput) return;
    
    // Find product by barcode
    const product = products.find(p => 
      p.barcode === barcodeInput || 
      p.sku === barcodeInput
    );
    
    if (product) {
      handleAddToCart(product);
      setBarcodeInput('');
    } else {
      alert('Product not found');
    }
    
    // Keep focus on input for continuous scanning
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleQuickAction = (action) => {
    switch (action.action) {
      case 'discount':
        if (action.type === 'percentage') {
          setDiscount(total * (action.value / 100));
        } else {
          setDiscount(action.value);
        }
        break;
      case 'clearCart':
        if (window.confirm('Are you sure you want to clear the cart?')) {
          dispatch(clearCart());
        }
        break;
      case 'addNote':
        const note = prompt('Enter note for this order:');
        if (note) {
          setNotes(notes ? `${notes}\n${note}` : note);
        }
        break;
      default:
        break;
    }
  };
  
  const handleCalculatorInput = (value) => {
    if (value === 'C') {
      setCalculatorExpression('');
      setCalculatorResult('');
    } else if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(calculatorExpression);
        setCalculatorResult(result);
        setCalculatorExpression(result.toString());
      } catch (error) {
        setCalculatorResult('Error');
      }
    } else if (value === 'backspace') {
      setCalculatorExpression(calculatorExpression.slice(0, -1));
    } else {
      setCalculatorExpression(calculatorExpression + value);
    }
  };
  
  // Function to sync pending orders when back online
  const syncPendingOrders = useCallback(() => {
    if (isOnline) {
      const pendingOrders = JSON.parse(localStorage.getItem('pos-pending-orders') || '[]');
      if (pendingOrders.length > 0) {
        pendingOrders.forEach(order => {
          dispatch(createOrder(order));
        });
        localStorage.setItem('pos-pending-orders', JSON.stringify([]));
        alert(`${pendingOrders.length} pending orders have been synced.`);
      }
    }
  }, [isOnline, dispatch]);
  
  // Check for pending orders when coming back online
  useEffect(() => {
    if (isOnline) {
      syncPendingOrders();
    }
  }, [isOnline, syncPendingOrders]);
  
  // Keyboard shortcuts handler
  const handleKeyDown = useCallback((e) => {
    // Only process if no modals are open and not typing in an input
    const isInputActive = document.activeElement.tagName === 'INPUT' || 
                          document.activeElement.tagName === 'TEXTAREA';
    
    if (showPaymentModal || showSaveOrderModal || showSavedOrdersModal || showBarcodeModal || isInputActive) {
      return;
    }
    
    switch (e.key) {
      case 'F1':
        e.preventDefault();
        setShowKeyboardShortcutsModal(true);
        break;
      case 'F2':
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
        break;
      case 'F3':
        e.preventDefault();
        setShowBarcodeModal(true);
        setTimeout(() => {
          if (barcodeInputRef.current) {
            barcodeInputRef.current.focus();
          }
        }, 100);
        break;
      case 'F4':
        e.preventDefault();
        if (cartItems.length > 0) {
          handleCheckout();
        }
        break;
      case 'F5':
        e.preventDefault();
        if (cartItems.length > 0) {
          handleSaveOrder();
        }
        break;
      case 'F6':
        e.preventDefault();
        setShowSavedOrdersModal(true);
        break;
      case 'Escape':
        e.preventDefault();
        if (cartItems.length > 0 && window.confirm('Clear current cart?')) {
          dispatch(clearCart());
        }
        break;
      default:
        break;
    }
  }, [
    showPaymentModal, showSaveOrderModal, showSavedOrdersModal, showBarcodeModal, 
    cartItems, dispatch, handleCheckout, handleSaveOrder
  ]);
  
  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
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
    <Container fluid className={`pos-container ${darkMode ? 'dark-mode' : ''}`}>
      <Row>
        {/* Products Section */}
        <Col md={8} className="products-section">
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col md={7}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      ref={searchInputRef}
                      placeholder="Search products by name, SKU or barcode... (F2)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>Scan Barcode (F3)</Tooltip>}
                    >
                      <Button 
                        variant="outline-secondary"
                        onClick={() => {
                          setShowBarcodeModal(true);
                          setTimeout(() => {
                            if (barcodeInputRef.current) {
                              barcodeInputRef.current.focus();
                            }
                          }, 100);
                        }}
                      >
                        <FaBarcode />
                      </Button>
                    </OverlayTrigger>
                  </InputGroup>
                </Col>
                <Col md={5} className="d-flex justify-content-end">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Keyboard Shortcuts (F1)</Tooltip>}
                  >
                    <Button 
                      variant="outline-secondary" 
                      className="me-2"
                      onClick={() => setShowKeyboardShortcutsModal(true)}
                    >
                      <FaKeyboard />
                    </Button>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>{isOnline ? 'Online' : 'Offline'}</Tooltip>}
                  >
                    <Button 
                      variant={isOnline ? "outline-success" : "outline-danger"}
                      className="me-2"
                      onClick={syncPendingOrders}
                      disabled={isOnline && !localStorage.getItem('pos-pending-orders')}
                    >
                      {isOnline ? <FaWifi /> : <FaPowerOff />}
                    </Button>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Calculator</Tooltip>}
                  >
                    <Button 
                      variant="outline-secondary" 
                      className="me-2"
                      onClick={() => setShowCalculator(!showCalculator)}
                    >
                      <FaCalculator />
                    </Button>
                  </OverlayTrigger>
                  
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip>Transaction History</Tooltip>}
                  >
                    <Button 
                      variant="outline-secondary" 
                      className="me-2"
                      onClick={() => setShowTransactionHistory(true)}
                    >
                      <FaHistory />
                    </Button>
                  </OverlayTrigger>
                  
                  <Button 
                    variant="outline-secondary" 
                    className="me-2"
                    onClick={toggleDarkMode}
                  >
                    {darkMode ? <FaSun /> : <FaMoon />}
                  </Button>
                  
                  <Button 
                    variant="outline-secondary" 
                    className="me-2"
                    onClick={() => setShowSavedOrdersModal(true)}
                  >
                    <FaList className="me-1" /> Saved Orders
                  </Button>
                  
                  <Button 
                    variant="outline-primary"
                    onClick={handleSaveOrder}
                    disabled={cartItems.length === 0}
                  >
                    <FaSave className="me-1" /> Hold
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {/* Category Tabs */}
          <Row className="mb-3">
            <Col md={8}>
              <div className="category-tabs">
                <Tabs
                  activeKey={activeCategory}
                  onSelect={(k) => setActiveCategory(k)}
                  className="mb-3"
                >
                  <Tab eventKey="all" title="All Products" />
                  {categories.map(category => (
                    <Tab key={category} eventKey={category} title={category} />
                  ))}
                </Tabs>
              </div>
            </Col>
            <Col md={4}>
              <div className="quick-actions d-flex flex-wrap justify-content-end">
                {quickActions.slice(0, 4).map((action, index) => (
                  <Button
                    key={index}
                    variant="outline-secondary"
                    size="sm"
                    className="me-1 mb-1"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action.name}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
          
          {/* Calculator Floating Panel */}
          {showCalculator && (
            <div className="calculator-panel">
              <div className="calculator-header">
                <span>Calculator</span>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 text-dark"
                  onClick={() => setShowCalculator(false)}
                >
                  ×
                </Button>
              </div>
              <div className="calculator-display">
                <div className="calculator-expression">{calculatorExpression || '0'}</div>
                <div className="calculator-result">{calculatorResult}</div>
              </div>
              <div className="calculator-buttons">
                <Button variant="light" onClick={() => handleCalculatorInput('7')}>7</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('8')}>8</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('9')}>9</Button>
                <Button variant="secondary" onClick={() => handleCalculatorInput('/')}>/</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('4')}>4</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('5')}>5</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('6')}>6</Button>
                <Button variant="secondary" onClick={() => handleCalculatorInput('*')}>×</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('1')}>1</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('2')}>2</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('3')}>3</Button>
                <Button variant="secondary" onClick={() => handleCalculatorInput('-')}>-</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('0')}>0</Button>
                <Button variant="light" onClick={() => handleCalculatorInput('.')}>.</Button>
                <Button variant="primary" onClick={() => handleCalculatorInput('=')}>=</Button>
                <Button variant="secondary" onClick={() => handleCalculatorInput('+')}>+</Button>
                <Button variant="danger" className="col-span-2" onClick={() => handleCalculatorInput('C')}>C</Button>
                <Button variant="secondary" className="col-span-2" onClick={() => handleCalculatorInput('backspace')}>⌫</Button>
              </div>
            </div>
          )}
          
          <Row className="products-grid">
            {productsLoading ? (
              <div className="text-center py-5">Loading products...</div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts
                .filter(product => activeCategory === 'all' || product.category === activeCategory)
                .map(product => (
                <Col key={product._id} xs={6} md={4} lg={3} className="mb-3">
                  <Card 
                    className={`product-card ${product.stock <= 0 ? 'out-of-stock' : ''}`}
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
                    <div className="product-card-content" onClick={() => handleAddToCart(product)}>
                      <Card.Body className="p-2">
                        <h6 className="product-name">{product.name}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="product-price">${product.price.toFixed(2)}</span>
                          <span className={`product-stock ${product.stock <= 5 ? 'low-stock' : ''}`}>
                            Stock: {product.stock}
                          </span>
                        </div>
                      </Card.Body>
                    </div>
                    <div className="quantity-selector">
                      <Dropdown>
                        <Dropdown.Toggle variant="light" size="sm" className="quantity-dropdown">
                          <FaPlus size={12} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {[1, 2, 3, 5, 10].map(qty => (
                            <Dropdown.Item 
                              key={qty} 
                              onClick={() => handleAddToCart(product, qty)}
                              disabled={qty > product.stock}
                            >
                              Add {qty}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
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
              <div>
                {cartItems.length > 0 && (
                  <>
                    <Button 
                      variant="outline-light" 
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`
                          <html>
                            <head>
                              <title>Receipt Preview</title>
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
                                  <div class="store-info">Date: ${new Date().toLocaleString()}</div>
                                  ${selectedCustomer ? `<div class="store-info">Customer: ${selectedCustomer.name}</div>` : ''}
                                </div>
                                
                                <div class="divider"></div>
                                
                                <div class="items">
                                  <div class="item" style="font-weight: bold;">
                                    <div class="item-name">Item</div>
                                    <div class="item-qty">Qty</div>
                                    <div class="item-price">Price</div>
                                  </div>
                                  ${cartItems.map(item => `
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
                                    <div>$${total.toFixed(2)}</div>
                                  </div>
                                  <div class="total-line">
                                    <div>Discount:</div>
                                    <div>$${discount.toFixed(2)}</div>
                                  </div>
                                  <div class="total-line">
                                    <div>Tax (10%):</div>
                                    <div>$${((total - discount) * 0.1).toFixed(2)}</div>
                                  </div>
                                  <div class="total-line grand-total">
                                    <div>TOTAL:</div>
                                    <div>$${((total - discount) * 1.1).toFixed(2)}</div>
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
                      }}
                    >
                      <FaPrint />
                    </Button>
                    <Button 
                      variant="outline-light" 
                      size="sm"
                      onClick={() => dispatch(clearCart())}
                    >
                      Clear Cart
                    </Button>
                  </>
                )}
              </div>
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
                      className="form-control-wide"
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
                  className="form-control-wide"
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
                      className="form-control-wide"
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
      
      {/* Save Order Modal */}
      <Modal show={showSaveOrderModal} onHide={() => setShowSaveOrderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hold Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Order Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a name for this order"
              value={currentOrderName}
              onChange={(e) => setCurrentOrderName(e.target.value)}
              className="form-control-wide"
            />
            <Form.Text className="text-muted">
              Give this order a name to easily identify it later.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveOrderModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmSaveOrder}>
            Save Order
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Saved Orders Modal */}
      <Modal show={showSavedOrdersModal} onHide={() => setShowSavedOrdersModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Saved Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {savedOrders.length > 0 ? (
            <ListGroup>
              {savedOrders.map(order => (
                <ListGroup.Item key={order.id} className="saved-order-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5>{order.name}</h5>
                      <div className="text-muted">
                        {new Date(order.timestamp).toLocaleString()} • 
                        {order.customer ? ` ${order.customer.name} • ` : ' '}
                        {order.items.length} items
                      </div>
                      <div className="mt-2">
                        {order.items.slice(0, 3).map(item => (
                          <Badge bg="secondary" className="me-1" key={item._id}>
                            {item.name} x{item.quantity}
                          </Badge>
                        ))}
                        {order.items.length > 3 && (
                          <Badge bg="secondary">+{order.items.length - 3} more</Badge>
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-column">
                      <div className="mb-2 text-end">
                        <strong>${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</strong>
                      </div>
                      <Button variant="primary" size="sm" onClick={() => handleLoadOrder(order)}>
                        <FaShoppingBag className="me-1" /> Load Order
                      </Button>
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center py-5">
              <p>No saved orders</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
      
      {/* Barcode Scanner Modal */}
      <Modal show={showBarcodeModal} onHide={() => setShowBarcodeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Scan Barcode</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            e.preventDefault();
            handleBarcodeSubmit();
          }}>
            <Form.Group className="mb-3">
              <Form.Label>Enter or scan barcode</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaBarcode />
                </InputGroup.Text>
                <Form.Control
                  ref={barcodeInputRef}
                  type="text"
                  placeholder="Scan or enter barcode/SKU..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  autoFocus
                />
                <Button type="submit" variant="primary">
                  Add
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>
          <div className="text-center mt-4">
            <p className="text-muted">
              <small>
                Position your barcode scanner over the product's barcode and scan.
                <br />
                The product will be automatically added to the cart.
              </small>
            </p>
          </div>
        </Modal.Body>
      </Modal>
      
      {/* Keyboard Shortcuts Modal */}
      <Modal show={showKeyboardShortcutsModal} onHide={() => setShowKeyboardShortcutsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Keyboard Shortcuts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span><strong>F1</strong></span>
              <span>Show keyboard shortcuts</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span><strong>F2</strong></span>
              <span>Focus search box</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span><strong>F3</strong></span>
              <span>Open barcode scanner</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span><strong>F4</strong></span>
              <span>Checkout</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span><strong>F5</strong></span>
              <span>Hold order</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span><strong>F6</strong></span>
              <span>View saved orders</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center">
              <span><strong>ESC</strong></span>
              <span>Clear cart</span>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowKeyboardShortcutsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Transaction History Modal */}
      <Modal show={showTransactionHistory} onHide={() => setShowTransactionHistory(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transaction History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {transactionHistory.length > 0 ? (
            <div className="transaction-history">
              <div className="transaction-filters mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search transactions..."
                  className="mb-2"
                />
                <div className="d-flex">
                  <Form.Group className="me-2">
                    <Form.Label>From</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>To</Form.Label>
                    <Form.Control type="date" />
                  </Form.Group>
                </div>
              </div>
              
              <ListGroup>
                {transactionHistory.map((transaction, index) => (
                  <ListGroup.Item key={index} className="transaction-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6>Order #{index + 1}</h6>
                        <div className="text-muted">
                          {new Date(transaction.timestamp).toLocaleString()} • 
                          {transaction.items.length} items
                        </div>
                        <div className="mt-2">
                          <Badge bg="primary" className="me-1">
                            {transaction.paymentMethod === 'cash' ? 'Cash' : 
                             transaction.paymentMethod === 'card' ? 'Card' : 'Mobile Payment'}
                          </Badge>
                          <Badge bg="success">
                            ${transaction.total.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                      <div className="d-flex">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            handlePrintReceipt(transaction);
                          }}
                        >
                          <FaPrint />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="transaction-details mt-2">
                      <small>
                        {transaction.items.slice(0, 3).map((item, idx) => (
                          <span key={idx} className="me-2">
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                        {transaction.items.length > 3 && (
                          <span>+{transaction.items.length - 3} more</span>
                        )}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          ) : (
            <div className="text-center py-5">
              <p>No transaction history</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
      
      {/* Hidden receipt template for printing */}
      <div style={{ display: 'none' }}>
        <div ref={receiptRef} id="receipt-template"></div>
      </div>
    </Container>
  );
};

export default POS;
