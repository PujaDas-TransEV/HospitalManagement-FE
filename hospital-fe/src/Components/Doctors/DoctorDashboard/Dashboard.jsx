
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaUserMd } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';
import './DoctorDashboard.css';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState({
    fullname: '',
    profilepictures: '/images/default-profile.jpg',
    leaveFrom: '',
    leaveTo: '',
    leaveStatus: '',
  });

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

useEffect(() => {
  const fetchDoctorInfo = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const decodedToken = jwtDecode(accessToken);
      const doctorId = decodedToken.doctorid;

      const formData = new FormData();
      formData.append('doctorid', doctorId);

      const response = await fetch('http://localhost:5000/doctors/getbyid', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.message.includes('Doctor data hasbeen fetched successfully')) {
        const d = result.data;

        setDoctorData({
          fullname: d.fullname || '',
          profilepictures: d.profilepictures
            ? `data:image/jpeg;base64,${d.profilepictures}`
            : '/images/default-profile.jpg',
          leaveFrom: d.leavefrom || '',
          leaveTo: d.leaveto || '',
          leaveStatus: d.status || '',
        });
      } else {
        console.warn('Unexpected response message:', result.message);
      }
    } catch (error) {
      console.error('Error fetching doctor info:', error);
    }
  };

  

    const fetchAppointmentDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid;

        const formData = new FormData();
        formData.append('doctorid', doctorId);

        const response = await fetch('http://localhost:5000/getappoinmentdetails', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.data) {
          setAppointments([
            {
              id: 1,
              patientName: `${data.data.patient_firstname} ${data.data.patient_lastname}`,
              time: data.data.appoinmenttime,
              status: data.data.appoinmentstatus,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching appointment details:', error);
      }
    };

    const fetchPatientDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid;

        const formData = new FormData();
        formData.append('doctorid', doctorId);

        const response = await fetch('http://localhost:5000/patientview', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.patients && data.patients.length > 0) {
          setPatients([
            {
              id: 1,
              name: `${data.patients[0].firstname} ${data.patients[0].lastname}`,
              age: data.patients[0].age,
              condition: data.patients[0].bloodgroup,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchDoctorInfo();
    fetchAppointmentDetails();
    fetchPatientDetails();
  }, []);

  return (
    <div className="dashboard-container">
      <DoctorNavbar />
      <div className="dashboard-content d-flex">
        <Doctorsidebar />
        <div className="doctor-dashboard flex-grow-1 p-3">
          <div className="container-fluid">
            <h2 className="mb-4">Welcome, Dr. {doctorData.fullname || 'Loading...'}</h2>

            <Row className="mb-4">
              <Col md={6} sm={12}>
                <Card className="appointment-card h-100">
                  <Card.Header>
                    <FaCalendarAlt style={{ marginRight: '8px' }} />
                    Upcoming Appointments
                  </Card.Header>
                  <ListGroup variant="flush">
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <ListGroup.Item key={appointment.id}>
                          {appointment.patientName} at {appointment.time} - Status: {appointment.status}
                          
                          <Link to="/appointments" className="float-end">
  <Button variant="outline-primary" size="sm">
    View
  </Button>
</Link>

                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>No upcoming appointments</ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              </Col>

              <Col md={6} sm={12}>
                <Card className="patient-card h-100">
                  <Card.Header>
                    <FaUserMd style={{ marginRight: '8px' }} />
                    Patients Overview
                  </Card.Header>
                  <ListGroup variant="flush">
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <ListGroup.Item key={patient.id}>
                          {patient.name} - Age: {patient.age} - Blood Group: {patient.condition}
                           <Link to="/patients" className="float-end">
                          <Button variant="outline-primary" size="sm" className="float-end">
                            View Record
                          </Button>
                          </Link>
                        </ListGroup.Item>
                      ))
                    ) : (
                      <ListGroup.Item>No patients available</ListGroup.Item>
                    )}
                  </ListGroup>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Card className="leave-card">
                  <Card.Header>Leave Status</Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
                      Leave From: <strong>{doctorData.leaveFrom || 'N/A'}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
                      Leave To: <strong>{doctorData.leaveTo || 'N/A'}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item style={{ backgroundColor: '#f8f9fa', color: '#000' }}>
                      Status: <strong>{doctorData.leaveStatus || 'N/A'}</strong>
                    </ListGroup.Item>
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
