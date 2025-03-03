import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Form, 
  InputGroup,
  Modal
} from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { getCustomers, getCustomer, addCustomer, updateCustomer } from '../actions/customerActions';
import '../styles/Customers.css';

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, customer, loading } = useSelector(state => state.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    notes: ''
  });
  
  // Load customers on component mount
  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);
  
  // Filter customers based on search term
  useEffect(() => {
    if (customers) {
      setFilteredCustomers(
        customers.filter(customer => 
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (customer.phone && customer.phone.includes(searchTerm))
        )
      );
    }
  }, [searchTerm, customers]);
  
  const handleOpenModal = (customer = null) => {
    if (customer) {
      setCurrentCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        address: {
          street: customer.address?.street || '',
          city: customer.address?.city || '',
          state: customer.address?.state || '',
          zipCode: customer.address?.zipCode || '',
          country: customer.address?.country || ''
        },
        notes: customer.notes || ''
      });
    } else {
      setCurrentCustomer(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        notes: ''
      });
    }
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCustomer(null);
  };
  
  const handleViewCustomer = (id) => {
    dispatch(getCustomer(id));
    setShowViewModal(true);
  };
  
  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentCustomer) {
      dispatch(updateCustomer(currentCustomer._id, formData));
    } else {
      dispatch(addCustomer(formData));
    }
    
    handleCloseModal();
  };
  
  return (
    <Container fluid className="customers-container">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">Customers</h1>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => handleOpenModal()}
          >
            <FaPlus className="me-2" />
            Add Customer
          </Button>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">Loading customers...</div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Loyalty Points</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map(customer => (
                      <tr key={customer._id}>
                        <td>{customer.name}</td>
                        <td>{customer.email || '-'}</td>
                        <td>{customer.phone || '-'}</td>
                        <td>{customer.loyaltyPoints || 0}</td>
                        <td>
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleViewCustomer(customer._id)}
                          >
                            <FaEye />
                          </Button>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleOpenModal(customer)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">No customers found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Customer Form Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentCustomer ? 'Edit Customer' : 'Add New Customer'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <h6 className="mt-4 mb-3">Address</h6>
            
            <Form.Group className="mb-3">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State/Province</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zip/Postal Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentCustomer ? 'Update' : 'Add'} Customer
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Customer View Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {customer ? (
            <div className="customer-details">
              <h5>{customer.name}</h5>
              
              <div className="detail-section">
                <h6>Contact Information</h6>
                <p><strong>Email:</strong> {customer.email || 'Not provided'}</p>
                <p><strong>Phone:</strong> {customer.phone || 'Not provided'}</p>
              </div>
              
              <div className="detail-section">
                <h6>Address</h6>
                {customer.address && (
                  customer.address.street || 
                  customer.address.city || 
                  customer.address.state || 
                  customer.address.zipCode || 
                  customer.address.country
                ) ? (
                  <address>
                    {customer.address.street && <p>{customer.address.street}</p>}
                    {(customer.address.city || customer.address.state || customer.address.zipCode) && (
                      <p>
                        {customer.address.city && `${customer.address.city}, `}
                        {customer.address.state && `${customer.address.state} `}
                        {customer.address.zipCode && customer.address.zipCode}
                      </p>
                    )}
                    {customer.address.country && <p>{customer.address.country}</p>}
                  </address>
                ) : (
                  <p>No address provided</p>
                )}
              </div>
              
              <div className="detail-section">
                <h6>Loyalty Program</h6>
                <p><strong>Points:</strong> {customer.loyaltyPoints || 0}</p>
              </div>
              
              {customer.notes && (
                <div className="detail-section">
                  <h6>Notes</h6>
                  <p>{customer.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-3">Loading customer details...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
          {customer && (
            <Button 
              variant="primary"
              onClick={() => {
                handleCloseViewModal();
                handleOpenModal(customer);
              }}
            >
              Edit
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Customers;
