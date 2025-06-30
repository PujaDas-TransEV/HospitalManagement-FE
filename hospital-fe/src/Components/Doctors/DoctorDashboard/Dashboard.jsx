
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import { FaCalendarAlt, FaUserMd, FaRegCalendarAlt, FaUserInjured, FaPlaneDeparture, FaHome, FaCog, FaUserCircle, FaBell } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode'; // fixed import
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';
import { Link, useNavigate } from 'react-router-dom';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState({
    fullname: '',
    specialization: '',
    profilepictures: '/images/default-profile.jpg',
    leaveFrom: '',
    leaveTo: '',
    leaveStatus: '',
  });

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      try {
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid;

        const formData = new FormData();
        formData.append('doctorid', doctorId);

        const response = await fetch('http://192.168.0.106:5000/doctors/getbyid', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.message.includes('Doctor data hasbeen fetched successfully')) {
          const d = result.data;

          setDoctorData((prev) => ({
            ...prev,
            fullname: d.fullname || '',
            specialization: d.specialization || '', // Make sure API sends this field
            profilepictures: d.profilepictures
              ? `data:image/jpeg;base64,${d.profilepictures}`
              : '/images/default-profile.jpg',
            leaveFrom: d.leavefrom || '',
            leaveTo: d.leaveto || '',
            leaveStatus: d.status || '',
          }));
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

        const response = await fetch('http://192.168.0.106:5000/getappoinmentdetails', {
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

        const response = await fetch('http://192.168.0.106:5000/patientview', {
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

  // Icon buttons config
  const iconButtons = [
    { icon: <FaRegCalendarAlt size={36} />, label: 'Appointments', onClick: () => navigate('/appointments'), bgColor: '#007bff' },
    { icon: <FaUserInjured size={36} />, label: 'Patients List', onClick: () => navigate('/patients'), bgColor: '#28a745' },
    { icon: <FaPlaneDeparture size={36} />, label: 'Leave Management', onClick: () => navigate('/leave'), bgColor: '#ffc107', textColor: '#212529' },
    { icon: <FaHome size={36} />, label: 'Homecare', onClick: () => navigate('/doctor-homecare'), bgColor: '#17a2b8' },
    { icon: <FaCog size={36} />, label: 'Settings', onClick: () => navigate('/doctor-settings'), bgColor: '#6f42c1' },
    { icon: <FaUserCircle size={36} />, label: 'Profile', onClick: () => navigate('/doctor-profile'), bgColor: '#fd7e14' },
  ];

  return (
    <div className="dashboard-container-doctor">
      <DoctorNavbar />
      <div className="dashboard-content d-flex">
        <Doctorsidebar />
        <div className="doctor-dashboard flex-grow-1 p-3 position-relative">
          {/* Top welcome & specialization + notification bell */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* <div>
              <h2>Welcome, Dr. {doctorData.fullname || 'Loading...'}</h2>
              <p className="specialization">{doctorData.specialization || 'Loading specialization...'}</p>
            </div> */}
            <div
  style={{
    backgroundColor: '#e3f2fd', // Light blue background
    padding: '20px 30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    color: '#0d47a1', // Dark blue text
    marginBottom: '30px',
    textAlign: 'left'
  }}
>
  <h2 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: '700' }}>
    Welcome, Dr. {doctorData.fullname || 'Loading...'}
  </h2>
  <p
    className="specialization"
    style={{
      margin: '0',
      fontSize: '18px',
      color: '#1565c0', // Slightly lighter blue
      fontWeight: '500',
      marginLeft:'470px'
    }}
  >
    Specialization: {doctorData.specialization || 'Loading specialization...'}
  </p>
</div>

            <div
              className="notification-icon"
              onClick={() => setShowSummary(!showSummary)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => e.key === 'Enter' && setShowSummary(!showSummary)}
              title="View Summary"
              aria-label="Toggle summary panel"
            >
              <FaBell size={28} />
            </div>
          </div>

          {/* Summary panel */}
          {showSummary && (
            <Card className="summary-panel shadow p-3 position-absolute" style={{ top: 60, right: 20, width: 320, zIndex: 999 }}>
              <h5>Upcoming Appointments</h5>
              <ListGroup variant="flush" className="mb-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {appointments.length > 0 ? (
                  appointments.map((appt) => (
                    <ListGroup.Item key={appt.id}>
                      {appt.patientName} at {appt.time} - Status: {appt.status}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No upcoming appointments</ListGroup.Item>
                )}
              </ListGroup>

              <h5>Patients</h5>
              <ListGroup variant="flush" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <ListGroup.Item key={patient.id}>
                      {patient.name} - Age: {patient.age} - Blood Group: {patient.condition}
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No patients available</ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          )}

          {/* Icon row */}
     <div className="icon-card-row d-flex flex-wrap justify-content-start gap-3 my-4">
  {iconButtons.map(({ icon, label, onClick, bgColor, textColor }) => (
    <div
      key={label}
      className="icon-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{ backgroundColor: bgColor, color: textColor || '#fff' }}
      aria-label={`Go to ${label}`}
    >
      {icon}
      <p>{label}</p>
    </div>
  ))}
</div>


          {/* Existing cards for appointments, patients, leave */}
          <Row className="mb-2"style={{ paddingTop: '30px' }}>
            <Col md={6} sm={12}>
             <Card
  className="appointment-card h-100"
  style={{
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    transition: 'transform 0.2s ease',
    marginTop: '20px',           // 👈 pushes it down
    marginBottom: '10px',
    padding: '0',
  }}
>

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
  );
};

export default DoctorDashboard;
