import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Tab } from 'react-bootstrap';
import { FaSave, FaUser, FaStore, FaReceipt, FaTags, FaUsers } from 'react-icons/fa';
import '../styles/Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'MayuraPOS Store',
    storeAddress: '123 Main Street, Anytown, USA',
    storePhone: '(555) 123-4567',
    storeEmail: 'info@mayurapos.com',
    storeCurrency: 'USD',
    taxRate: '10'
  });
  const [receiptSettings, setReceiptSettings] = useState({
    showLogo: true,
    showStoreInfo: true,
    showTaxDetails: true,
    footerText: 'Thank you for your business!',
    printAutomatically: false
  });
  const [productSettings, setProductSettings] = useState({
    lowStockThreshold: '10',
    enableBarcode: true,
    defaultCategory: 'Uncategorized',
    showOutOfStock: true
  });
  const [userSettings, setUserSettings] = useState({
    name: 'Admin User',
    email: 'admin@mayurapos.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [customerSettings, setCustomerSettings] = useState({
    enableLoyaltyProgram: true,
    pointsPerDollar: '1',
    minimumRedeemPoints: '100',
    pointsValue: '0.01'
  });
  
  const handleStoreChange = (e) => {
    setStoreSettings({
      ...storeSettings,
      [e.target.name]: e.target.value
    });
  };
  
  const handleReceiptChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setReceiptSettings({
      ...receiptSettings,
      [e.target.name]: value
    });
  };
  
  const handleProductChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProductSettings({
      ...productSettings,
      [e.target.name]: value
    });
  };
  
  const handleUserChange = (e) => {
    setUserSettings({
      ...userSettings,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCustomerChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCustomerSettings({
      ...customerSettings,
      [e.target.name]: value
    });
  };
  
  const handleSaveSettings = () => {
    // Here you would dispatch actions to save the settings
    alert('Settings saved successfully!');
  };
  
  return (
    <Container fluid className="settings-container">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">Settings</h1>
        </Col>
      </Row>
      
      <Tab.Container id="settings-tabs" activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={3}>
            <Card className="mb-4 mb-md-0">
              <Card.Body className="p-0">
                <Nav variant="pills" className="flex-column settings-nav">
                  <Nav.Item>
                    <Nav.Link eventKey="general" className="d-flex align-items-center">
                      <FaStore className="me-2" />
                      <span>General</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="receipt" className="d-flex align-items-center">
                      <FaReceipt className="me-2" />
                      <span>Receipt</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="products" className="d-flex align-items-center">
                      <FaTags className="me-2" />
                      <span>Products</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="customers" className="d-flex align-items-center">
                      <FaUsers className="me-2" />
                      <span>Customers</span>
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="account" className="d-flex align-items-center">
                      <FaUser className="me-2" />
                      <span>Account</span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={9}>
            <Card>
              <Card.Body>
                <Tab.Content>
                  {/* General Settings */}
                  <Tab.Pane eventKey="general">
                    <h4 className="mb-4">General Settings</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Store Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="storeName"
                          value={storeSettings.storeName}
                          onChange={handleStoreChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Store Address</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="storeAddress"
                          value={storeSettings.storeAddress}
                          onChange={handleStoreChange}
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="storePhone"
                              value={storeSettings.storePhone}
                              onChange={handleStoreChange}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="storeEmail"
                              value={storeSettings.storeEmail}
                              onChange={handleStoreChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Currency</Form.Label>
                            <Form.Select
                              name="storeCurrency"
                              value={storeSettings.storeCurrency}
                              onChange={handleStoreChange}
                            >
                              <option value="USD">USD - US Dollar</option>
                              <option value="EUR">EUR - Euro</option>
                              <option value="GBP">GBP - British Pound</option>
                              <option value="JPY">JPY - Japanese Yen</option>
                              <option value="CAD">CAD - Canadian Dollar</option>
                              <option value="AUD">AUD - Australian Dollar</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Tax Rate (%)</Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              name="taxRate"
                              value={storeSettings.taxRate}
                              onChange={handleStoreChange}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <div className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleSaveSettings}>
                          <FaSave className="me-2" />
                          Save Settings
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                  
                  {/* Receipt Settings */}
                  <Tab.Pane eventKey="receipt">
                    <h4 className="mb-4">Receipt Settings</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Show Store Logo on Receipt"
                          name="showLogo"
                          checked={receiptSettings.showLogo}
                          onChange={handleReceiptChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Show Store Information on Receipt"
                          name="showStoreInfo"
                          checked={receiptSettings.showStoreInfo}
                          onChange={handleReceiptChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Show Tax Details on Receipt"
                          name="showTaxDetails"
                          checked={receiptSettings.showTaxDetails}
                          onChange={handleReceiptChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Receipt Footer Text</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          name="footerText"
                          value={receiptSettings.footerText}
                          onChange={handleReceiptChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Print Receipt Automatically After Sale"
                          name="printAutomatically"
                          checked={receiptSettings.printAutomatically}
                          onChange={handleReceiptChange}
                        />
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleSaveSettings}>
                          <FaSave className="me-2" />
                          Save Settings
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                  
                  {/* Product Settings */}
                  <Tab.Pane eventKey="products">
                    <h4 className="mb-4">Product Settings</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Low Stock Threshold</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          name="lowStockThreshold"
                          value={productSettings.lowStockThreshold}
                          onChange={handleProductChange}
                        />
                        <Form.Text className="text-muted">
                          Products with stock below this number will be marked as low stock.
                        </Form.Text>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Enable Barcode Scanning"
                          name="enableBarcode"
                          checked={productSettings.enableBarcode}
                          onChange={handleProductChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Default Category</Form.Label>
                        <Form.Control
                          type="text"
                          name="defaultCategory"
                          value={productSettings.defaultCategory}
                          onChange={handleProductChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Show Out of Stock Products"
                          name="showOutOfStock"
                          checked={productSettings.showOutOfStock}
                          onChange={handleProductChange}
                        />
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleSaveSettings}>
                          <FaSave className="me-2" />
                          Save Settings
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                  
                  {/* Customer Settings */}
                  <Tab.Pane eventKey="customers">
                    <h4 className="mb-4">Customer Settings</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Enable Loyalty Program"
                          name="enableLoyaltyProgram"
                          checked={customerSettings.enableLoyaltyProgram}
                          onChange={handleCustomerChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Points Per Dollar Spent</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          step="0.1"
                          name="pointsPerDollar"
                          value={customerSettings.pointsPerDollar}
                          onChange={handleCustomerChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Minimum Points for Redemption</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          name="minimumRedeemPoints"
                          value={customerSettings.minimumRedeemPoints}
                          onChange={handleCustomerChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Point Value (in dollars)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          step="0.01"
                          name="pointsValue"
                          value={customerSettings.pointsValue}
                          onChange={handleCustomerChange}
                        />
                        <Form.Text className="text-muted">
                          The dollar value of each loyalty point.
                        </Form.Text>
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleSaveSettings}>
                          <FaSave className="me-2" />
                          Save Settings
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                  
                  {/* Account Settings */}
                  <Tab.Pane eventKey="account">
                    <h4 className="mb-4">Account Settings</h4>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={userSettings.name}
                          onChange={handleUserChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={userSettings.email}
                          onChange={handleUserChange}
                        />
                      </Form.Group>
                      
                      <hr className="my-4" />
                      <h5 className="mb-3">Change Password</h5>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="currentPassword"
                          value={userSettings.currentPassword}
                          onChange={handleUserChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="newPassword"
                          value={userSettings.newPassword}
                          onChange={handleUserChange}
                        />
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={userSettings.confirmPassword}
                          onChange={handleUserChange}
                        />
                      </Form.Group>
                      
                      <div className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleSaveSettings}>
                          <FaSave className="me-2" />
                          Save Settings
                        </Button>
                      </div>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Settings;
