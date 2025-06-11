
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaUserMd, FaFileMedical } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState({
    fullname: '',
    profilepictures: '/images/default-profile.jpg',
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch doctor info from API
    const fetchDoctorInfo = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid;

        const formData = new FormData();
        formData.append('doctorid', doctorId);

        const response = await fetch('http://192.168.0.105:5000/doctors/getbyid', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.message === 'Doctor data hasbeen fetched successfully') {
          setDoctorData({
            fullname: data.data.fullname,
            profilepictures: data.data.profilepictures
              ? `data:image/jpeg;base64,${data.data.profilepictures}`
              : '/images/default-profile.jpg',
          });
        }
      } catch (error) {
        console.error('Error fetching doctor info:', error);
      }
    };

    // Simulate fetching appointments, patients, notifications
    const fetchDashboardData = () => {
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
    };

    fetchDoctorInfo();
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <DoctorNavbar />

      <div className="dashboard-content">
        <Doctorsidebar />

        <div className="doctor-dashboard">
          <div className="container mt-4">
            <h2>Welcome, Dr. {doctorData.fullname || 'Loading...'}</h2>

            <Row className="mb-4">
              <Col md={6} sm={12}>
                <Card className="appointment-card">
                  <Card.Header>
                    <FaCalendarAlt style={{ marginRight: '8px' }} />
                    Upcoming Appointments
                  </Card.Header>
                  <ListGroup variant="flush">
                    {appointments.map((appointment) => (
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

              <Col md={6} sm={12}>
                <Card className="patient-card">
                  <Card.Header>
                    <FaUserMd style={{ marginRight: '8px' }} />
                    Patients Overview
                  </Card.Header>
                  <ListGroup variant="flush">
                    {patients.map((patient) => (
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
              <Col md={12}>
                <Card className="medical-record-card">
                  <Card.Header>
                    <FaFileMedical style={{ marginRight: '8px' }} />
                    Medical Records
                  </Card.Header>
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
