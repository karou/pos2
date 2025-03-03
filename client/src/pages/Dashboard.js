import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShoppingCart, FaBoxes, FaUsers, FaMoneyBillWave } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import '../styles/Dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  
  const [salesData, setSalesData] = useState({
    labels: [],
    datasets: []
  });
  
  const [topProducts, setTopProducts] = useState({
    labels: [],
    datasets: []
  });
  
  useEffect(() => {
    // In a real app, these would be API calls
    // For now, we'll use dummy data
    
    // Fetch dashboard stats
    setStats({
      totalSales: 15680.45,
      totalOrders: 256,
      totalProducts: 124,
      totalCustomers: 89
    });
    
    // Fetch sales data for the chart
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    setSalesData({
      labels,
      datasets: [
        {
          label: 'Sales',
          data: [4500, 5200, 4800, 5800, 6000, 5500, 7200],
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }
      ]
    });
    
    // Fetch top products data
    setTopProducts({
      labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
      datasets: [
        {
          label: 'Units Sold',
          data: [65, 59, 80, 81, 56],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }
      ]
    });
  }, []);
  
  const salesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales',
      },
    },
  };
  
  const productsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Selling Products',
      },
    },
  };
  
  return (
    <Container fluid className="dashboard-container">
      <h1 className="page-title">Dashboard</h1>
      
      {/* Stats Cards */}
      <Row className="stats-cards">
        <Col md={3} sm={6} className="mb-4">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-icon sales-icon">
                <FaMoneyBillWave />
              </div>
              <div className="stats-info">
                <h3>${stats.totalSales.toLocaleString()}</h3>
                <p>Total Sales</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-icon orders-icon">
                <FaShoppingCart />
              </div>
              <div className="stats-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-icon products-icon">
                <FaBoxes />
              </div>
              <div className="stats-info">
                <h3>{stats.totalProducts}</h3>
                <p>Products</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="stats-card">
            <Card.Body>
              <div className="stats-icon customers-icon">
                <FaUsers />
              </div>
              <div className="stats-info">
                <h3>{stats.totalCustomers}</h3>
                <p>Customers</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Charts */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Body>
              <Line options={salesChartOptions} data={salesData} />
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Bar options={productsChartOptions} data={topProducts} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Recent Orders */}
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Orders</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#ORD-0025</td>
                      <td>John Doe</td>
                      <td>2023-08-15</td>
                      <td>$125.99</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#ORD-0024</td>
                      <td>Jane Smith</td>
                      <td>2023-08-15</td>
                      <td>$85.50</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#ORD-0023</td>
                      <td>Robert Johnson</td>
                      <td>2023-08-14</td>
                      <td>$245.00</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                    <tr>
                      <td>#ORD-0022</td>
                      <td>Emily Davis</td>
                      <td>2023-08-14</td>
                      <td>$65.25</td>
                      <td><span className="badge bg-warning text-dark">Processing</span></td>
                    </tr>
                    <tr>
                      <td>#ORD-0021</td>
                      <td>Michael Wilson</td>
                      <td>2023-08-13</td>
                      <td>$112.75</td>
                      <td><span className="badge bg-success">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
