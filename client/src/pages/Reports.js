import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/Reports.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [timeRange, setTimeRange] = useState('week');
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: []
  });
  const [productData, setProductData] = useState({
    labels: [],
    datasets: []
  });
  const [paymentData, setPaymentData] = useState({
    labels: [],
    datasets: []
  });
  
  // Generate mock data based on report type and time range
  useEffect(() => {
    // Generate labels based on time range
    let labels = [];
    
    switch (timeRange) {
      case 'day':
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        break;
      case 'week':
        labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        break;
      case 'month':
        labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
        break;
      case 'year':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        break;
      default:
        labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
    
    // Generate random data for sales report
    const salesValues = labels.map(() => Math.floor(Math.random() * 1000) + 500);
    setSalesData({
      labels,
      datasets: [
        {
          label: 'Sales',
          data: salesValues,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
      ]
    });
    
    // Generate random data for product report
    setProductData({
      labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
      datasets: [
        {
          label: 'Units Sold',
          data: [65, 59, 80, 81, 56],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        }
      ]
    });
    
    // Generate random data for payment report
    setPaymentData({
      labels: ['Cash', 'Card', 'Mobile Payment'],
      datasets: [
        {
          label: 'Payment Methods',
          data: [45, 35, 20],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        }
      ]
    });
  }, [timeRange]);
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`,
      },
    },
  };
  
  return (
    <Container fluid className="reports-container">
      <Row className="mb-4">
        <Col>
          <h1 className="page-title">Reports</h1>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Report Type</Form.Label>
                <Form.Select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="sales">Sales Report</option>
                  <option value="products">Product Sales Report</option>
                  <option value="payments">Payment Methods Report</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Time Range</Form.Label>
                <Form.Select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex justify-content-end">
              <Button variant="primary">
                Generate Report
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body>
          <div className="chart-container">
            {reportType === 'sales' && (
              <Line options={chartOptions} data={salesData} />
            )}
            
            {reportType === 'products' && (
              <Bar options={chartOptions} data={productData} />
            )}
            
            {reportType === 'payments' && (
              <div className="pie-chart-container">
                <Pie options={chartOptions} data={paymentData} />
              </div>
            )}
          </div>
          
          <div className="mt-5">
            <h5>Summary</h5>
            {reportType === 'sales' && (
              <Row>
                <Col md={3}>
                  <div className="summary-item">
                    <h6>Total Sales</h6>
                    <p className="summary-value">$12,345.67</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="summary-item">
                    <h6>Total Orders</h6>
                    <p className="summary-value">256</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="summary-item">
                    <h6>Average Order Value</h6>
                    <p className="summary-value">$48.22</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="summary-item">
                    <h6>Highest Sales Day</h6>
                    <p className="summary-value">Friday</p>
                  </div>
                </Col>
              </Row>
            )}
            
            {reportType === 'products' && (
              <Row>
                <Col md={3}>
                  <div className="summary-item">
                    <h6>Total Products Sold</h6>
                    <p className="summary-value">341</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="summary-item">
                    <h6>Best Selling Product</h6>
                    <p className="summary-value">Product C</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="summary-item">
                    <h6>Lowest Selling Product</h6>
                    <p className="summary-value">Product E</p>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="summary-item">
                    <h6>Average Units Per Order</h6>
                    <p className="summary-value">1.33</p>
                  </div>
                </Col>
              </Row>
            )}
            
            {reportType === 'payments' && (
              <Row>
                <Col md={4}>
                  <div className="summary-item">
                    <h6>Most Popular Method</h6>
                    <p className="summary-value">Cash (45%)</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="summary-item">
                    <h6>Card Payments</h6>
                    <p className="summary-value">$5,432.10</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="summary-item">
                    <h6>Mobile Payments</h6>
                    <p className="summary-value">$2,468.90</p>
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reports;
