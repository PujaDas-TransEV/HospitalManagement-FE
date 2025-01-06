import React, { useState, useEffect } from 'react';
import { Navbar, Nav, FormControl, Button, Dropdown, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { FaBell, FaCalendarAlt, FaUserMd, FaFileMedical, FaUser,FaSearch } from 'react-icons/fa';
import './DoctorDashboard.css'; // Custom styling for the dashboard
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';

const DoctorDashboard = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [doctorData, setDoctorData] = useState({
    firstname: "John",
    lastname: "Doe",
    profilePicture: "/images/default-profile.jpg",
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate fetching data for appointments, patients, notifications
    setAppointments([
      { id: 1, patientName: 'Alice Smith', time: '10:00 AM', status: 'Pending' },
      { id: 2, patientName: 'Bob Johnson', time: '11:30 AM', status: 'Confirmed' },
      { id: 3, patientName: 'Charlie Brown', time: '1:00 PM', status: 'Completed' },
    ]);
    setPatients([
      { id: 1, name: 'Alice Smith', age: 30, condition: 'Flu' },
      { id: 2, name: 'Bob Johnson', age: 45, condition: 'Hypertension' },
      { id: 3, name: 'Charlie Brown', age: 60, condition: 'Diabetes' },
    ]);
    setNotifications([
      { id: 1, message: 'New Appointment scheduled for Alice Smith.' },
      { id: 2, message: 'Patient Bob Johnson has updated their condition.' },
      { id: 3, message: 'Patient Charlie Brown’s medical report is ready.' },
    ]);
  }, []);

  const toggleProfileDropdown = () => setProfileOpen(!profileOpen);
  const toggleNotificationDropdown = () => setNotificationOpen(!notificationOpen);

  return (
    <div className="dashboard-container">
      {/* Navbar at the top */}
      <DoctorNavbar />
      
      <div className="dashboard-content">
        {/* Sidebar for navigation */}
        <Doctorsidebar />
        
    <div className="doctor-dashboard">
     
          
        

      {/* Dashboard Main Content */}
      <div className="container mt-4">
        <h2>Welcome, Dr. {doctorData.firstname}</h2>
        
        <Row className="mb-4">
          {/* Upcoming Appointments Section */}
          <Col md={6}>
            <Card className="appointment-card">
              <Card.Header><FaCalendarAlt /> Upcoming Appointments</Card.Header>
              <ListGroup variant="flush">
                {appointments.map(appointment => (
                  <ListGroup.Item key={appointment.id}>
                    {appointment.patientName} at {appointment.time} - Status: {appointment.status}
                    <Button variant="outline-primary" size="sm" className="float-right">
                      View
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>

          {/* Patients Overview Section */}
          <Col md={6}>
            <Card className="patient-card">
              <Card.Header><FaUserMd /> Patients Overview</Card.Header>
              <ListGroup variant="flush">
                {patients.map(patient => (
                  <ListGroup.Item key={patient.id}>
                    {patient.name} - Age: {patient.age} - Condition: {patient.condition}
                    <Button variant="outline-primary" size="sm" className="float-right">
                      View Record
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          {/* Medical Records Section */}
          <Col md={12}>
            <Card className="medical-record-card">
              <Card.Header><FaFileMedical /> Medical Records</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Patient Alice Smith - Prescription: Amoxicillin</ListGroup.Item>
                <ListGroup.Item>Patient Bob Johnson - Prescription: Amlodipine</ListGroup.Item>
                <ListGroup.Item>Patient Charlie Brown - Prescription: Metformin</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
    </div>
    </div>
  );
};

export default DoctorDashboard;
