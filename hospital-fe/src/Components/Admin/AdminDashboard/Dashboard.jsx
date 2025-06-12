
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaUserMd, FaUserInjured, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './Dashboard.css';

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [pendingBills, setPendingBills] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch doctors
        const doctorRes = await fetch('http://192.168.0.106:5000/doctorops/getalldoctor');
        const doctorData = await doctorRes.json();
        if (doctorRes.ok) {
          setDoctors(doctorData.data || []);
        } else {
          throw new Error('Failed to fetch doctor data');
        }

        // Fetch patients
        const patientRes = await fetch('http://192.168.0.106:5000/patientops/getallpatient');
        const patientData = await patientRes.json();
        if (patientRes.ok) {
          setPatients(patientData || []);
        } else {
          throw new Error('Failed to fetch patient data');
        }

        // Fetch bills
        const billRes = await fetch('http://192.168.0.106:5000/billing/getallbill');
        const billData = await billRes.json();
        if (billRes.ok && Array.isArray(billData.bills)) {
          const pending = billData.bills.filter(
            bill =>
              typeof bill.status === 'string' &&
              bill.status.trim().toLowerCase() === 'pending'
          );
          setPendingBills(pending.length);
        } else {
          throw new Error('Failed to fetch billing data');
        }

        // Fetch appointments
        const appointmentRes = await fetch('http://192.168.0.106:5000/getallappoinment');
        const appointmentData = await appointmentRes.json();
        if (appointmentRes.ok && Array.isArray(appointmentData.data)) {
          const now = new Date();
          const upcoming = appointmentData.data.filter(item => {
            const time = new Date(item.appoinmenttime);
            return time > now;
          });
          setUpcomingAppointments(upcoming.length);

          const sorted = [...appointmentData.data]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4);

          setRecentActivity(sorted);
        } else {
          throw new Error('Failed to fetch appointment data');
        }
      } catch (err) {
        setError(err.message || 'Something went wrong');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-containerr">
      <AdminNavbar />
      <div className="dashboard-content">
        <AdminSidebar />

        <Container fluid>
          <h2 className="mt-4">Admin Dashboard</h2>

          {error && (
            <Alert variant="danger" className="my-3">
              {error}
            </Alert>
          )}

        
<Row className="mt-4">
  <Col md={6} className="mb-4">
    <Card className="dashboard-card card-doctors">
      <Card.Body>
        <FaUserMd size={40} className="icon" />
        <h5>Manage Doctors</h5>
        <p>Total Doctors: {loading ? <Spinner size="sm" animation="border" /> : doctors.length}</p>

      
<div className="button-group-custom">
  <Link to="/manage-doctors">
    <Button variant="primary">View Details</Button>
  </Link>
  <Link to="/doctor-signup">
    <Button variant="success">Register New Doctor</Button>
  </Link>
</div>

      </Card.Body>
    </Card>
  </Col>





            <Col md={6} className="mb-4">
              <Card className="dashboard-card card-patients">
                <Card.Body>
                  <FaUserInjured size={40} className="icon" />
                  <h5>Manage Patients</h5>
                  <p>Total Patients: {loading ? <Spinner size="sm" animation="border" /> : patients.length}</p>
                  <Link to="/manage-patients">
                    <Button variant="primary">View Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6} className="mb-4">
              <Card className="dashboard-card card-appointments">
                <Card.Body>
                  <FaCalendarAlt size={40} className="icon" />
                  <h5>Appointments</h5>
                  <p>Upcoming Appointments: {loading ? <Spinner size="sm" animation="border" /> : upcomingAppointments}</p>
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
                  <p>Total Bills: {loading ? <Spinner size="sm" animation="border" /> : pendingBills}</p>
                  <Link to="/admin-billing">
                    <Button variant="primary">View Details</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* <Row className="mt-4">
            <Col>
              <Card className="stats-card">
                <Card.Body>
                  <h5>Recent Activity</h5>
                  {loading ? (
                    <Spinner animation="border" />
                  ) : (
                    <ul>
                      {recentActivity.map((item, index) => (
                        <li key={index}>
                          Doctor: {item.doctor_fullname || 'Unknown'} — Patient: {item.patient_firstname} {item.patient_lastname} — Status: {item.appoinmentstatus}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row> */}
          <Row className="mt-4">
  <Col>
    <Card className="stats-card">
      <Card.Body>
        <h5>Recent Activity</h5>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <div className="recent-activity-list">
            {recentActivity.map((item, index) => {
              const status = item.appoinmentstatus?.toLowerCase();
              return (
                <div
                  key={index}
                  className={`activity-card activity-${status}`}
                >
                  <Row>
                    <Col xs={12} md={4}>
                      <strong>Doctor:</strong> {item.doctor_fullname || 'Unknown'}
                    </Col>
                    <Col xs={12} md={4}>
                      <strong>Patient:</strong> {item.patient_firstname} {item.patient_lastname}
                    </Col>
                    <Col xs={12} md={4}>
                      <strong>Status:</strong> {item.appoinmentstatus}
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        )}
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
