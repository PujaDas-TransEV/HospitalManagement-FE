import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserMd, FaUserInjured, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';  // Import Link for navigation
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './Dashboard.css';

const AdminDashboard = () => {
  // Initialize state for doctors, patients, and counts
  const [doctors, setDoctors] = useState([]);  // Empty array for doctors
  const [patients, setPatients] = useState([]); // Empty array for patients
  const [upcomingAppointments, setUpcomingAppointments] = useState(5); // Dummy value
  const [pendingBills, setPendingBills] = useState(10); // Dummy value

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/doctorops/getalldoctor');
        const data = await response.json();
        if (response.ok) {
          console.log('Doctors Data:', data); // Log response for debugging
          setDoctors(data.data || []);  // Set the doctors array from the response
        } else {
          console.error("Failed to fetch doctor data");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:5000/patientops/getallpatient');
        const data = await response.json();
        if (response.ok) {
          console.log('Patients Data:', data); // Log response for debugging
          setPatients(data || []);  // Set the patients array from the response
        } else {
          console.error("Failed to fetch patient data");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchDoctors();
    fetchPatients();
  }, []); // Empty dependency array ensures this runs only once on mount

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
                  <p>Total Doctors: {doctors.length}</p> {/* Display number of doctors */}
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
                  <p>Total Patients: {patients.length}</p> {/* Display number of patients */}
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
                  <p>Upcoming Appointments: {upcomingAppointments}</p> {/* Dummy value */}
                  <Link to="/appointment-management">
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
                  <p>Pending Bills: {pendingBills}</p> {/* Dummy value */}
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

