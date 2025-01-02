import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserMd, FaUserInjured, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Import Link for navigation
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './Dashboard.css';

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <AdminNavbar /> {/* Navbar for admin */}

      <div className="dashboard-content">
        <AdminSidebar /> {/* Sidebar for admin navigation */}

        <Container fluid>
          <Row className="mt-4">
            {/* 1st Row: Dashboard Cards for different sections (2 cards per row side by side) */}
            <Col md={6} className="mb-4">
              <Card className="dashboard-card card-doctors">
                <Card.Body>
                  <FaUserMd size={40} className="icon" />
                  <h5>Manage Doctors</h5>
                  <p>Total Doctors: 20</p>
                  {/* Link to Manage Doctors page */}
                  <Link to="/manage-doctors">
                    <Button variant="primary">View Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="dashboard-card card-patients">
                <Card.Body>
                  <FaUserInjured size={40} className="icon" />
                  <h5>Manage Patients</h5>
                  <p>Total Patients: 150</p>
                  {/* Link to Manage Patients page */}
                  <Link to="/manage-patients">
                    <Button variant="primary">View Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            {/* 2nd Row: More Cards for different sections (2 cards per row side by side) */}
            <Col md={6} className="mb-4">
              <Card className="dashboard-card card-appointments">
                <Card.Body>
                  <FaCalendarAlt size={40} className="icon" />
                  <h5>Appointments</h5>
                  <p>Upcoming Appointments: 5</p>
                  {/* Link to Appointments page */}
                  <Link to="/appointments">
                    <Button variant="primary">View Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="dashboard-card card-billing">
                <Card.Body>
                  <FaMoneyBillWave size={40} className="icon" />
                  <h5>Billing & Payments</h5>
                  <p>Pending Bills: 10</p>
                  {/* Link to Billing and Payments page */}
                  <Link to="/billing-payments">
                    <Button variant="primary">View Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            {/* 3rd Row: Recent Activity Section (Single card spanning the full width of the row) */}
            <Col>
              <Card className="stats-card">
                <Card.Body>
                  <h5>Recent Activity</h5>
                  <ul>
                    <li>New Doctor Added: Dr. John Doe</li>
                    <li>Patient Admission: Jane Smith</li>
                    <li>Upcoming Appointment: Dr. John</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
