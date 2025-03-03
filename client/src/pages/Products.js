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
  Modal,
  Badge
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../actions/productActions';
import '../styles/Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sku: '',
    barcode: '',
    image: ''
  });
  
  // Load products on component mount
  useEffect(() => {
    dispatch(getProducts());
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
  
  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        sku: product.sku,
        barcode: product.barcode || '',
        image: product.image
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        sku: '',
        barcode: '',
        image: ''
      });
    }
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert string values to appropriate types
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };
    
    if (currentProduct) {
      dispatch(updateProduct(currentProduct._id, productData));
    } else {
      dispatch(addProduct(productData));
    }
    
    handleCloseModal();
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };
  
  return (
    <Container fluid className="products-container">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">Products</h1>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => handleOpenModal()}
          >
            <FaPlus className="me-2" />
            Add Product
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
                  placeholder="Search products..."
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
            <div className="text-center py-5">Loading products...</div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <tr key={product._id}>
                        <td>
                          <div className="product-image-small">
                            <img 
                              src={product.image || '/placeholder.jpg'} 
                              alt={product.name} 
                            />
                          </div>
                        </td>
                        <td>{product.name}</td>
                        <td>{product.sku}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          {product.stock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Out of Stock</Badge>
                          )}
                        </td>
                        <td>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleOpenModal(product)}
                          >
                            <FaEdit />
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">No products found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Product Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentProduct ? 'Edit Product' : 'Add New Product'}
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
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU</Form.Label>
                  <Form.Control
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Barcode</Form.Label>
                  <Form.Control
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentProduct ? 'Update' : 'Add'} Product
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Products;
