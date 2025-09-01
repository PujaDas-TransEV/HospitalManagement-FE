import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import {
  FaCalendarAlt,
  FaUserMd,
  FaRegCalendarAlt,
  FaUserInjured,
  FaPlaneDeparture,
  FaHome,
  FaCog,
  FaUserCircle,
  FaBell,
} from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
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
  const [timetable, setTimetable] = useState([]); // ✅ New state
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

        const response = await fetch('https://backend.medapp.transev.site/doctors/getbyid', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.message.includes('Doctor data hasbeen fetched successfully')) {
          const d = result.data;

        setDoctorData((prev) => ({
  ...prev,
  fullname: d.fullname || '',
  specialization: d.specialization || '',
  profilepictures: d.profilepictures
    ? `data:image/jpeg;base64,${d.profilepictures}`
    : '/images/default-profile.jpg',
  leaveFrom: d.leavefrom || '',
  leaveTo: d.leaveto || '',
  leaveStatus: d.status || '',
  timetable: d.timetable || [], // 👈 Add this
}));


          // ✅ Set and sort timetable
          const sortedTimetable = (d.timetable || []).sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );
          setTimetable(sortedTimetable);
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

        const response = await fetch('https://backend.medapp.transev.site/getappoinmentdetails', {
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

        const response = await fetch('https://backend.medapp.transev.site/patientview', {
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
          {/* Top welcome */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div
              style={{
                backgroundColor: '#e3f2fd',
                padding: '20px 30px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                color: '#0d47a1',
                marginBottom: '30px',
                textAlign: 'left',
              }}
            >
              <h2 style={{ margin: '0 0 10px', fontSize: '28px', fontWeight: '700' }}>
                Welcome, Dr. {doctorData.fullname || 'Loading...'}
              </h2>
              <p
                style={{
                  margin: '0',
                  fontSize: '18px',
                  color: '#1565c0',
                  fontWeight: '500',
                  marginLeft: '470px',
                }}
              >
                Specialization: {doctorData.specialization || 'Loading...'}
              </p>
            </div>
            {/* <div
              className="notification-icon"
              onClick={() => setShowSummary(!showSummary)}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => e.key === 'Enter' && setShowSummary(!showSummary)}
              title="View Summary"
              aria-label="Toggle summary panel"
            >
              <FaBell size={28} />
            </div> */}
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

          {/* Icon Buttons */}
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

          {/* Appointment and Patient cards */}
          <Row className="mb-2" style={{ paddingTop: '30px' }}>
            <Col md={6} sm={12}>
              <Card className="appointment-card h-100" style={{ marginTop: '20px', marginBottom: '10px' }}>
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
                          <Button variant="outline-primary" size="sm">
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

   {/* Leave Status */}
      <Row className="mb-4">
        <Col xs={12} md={6}>
          <Card className="leave-card" style={{ width: '120%',maxWidth: '1200px', margin: '0 auto' }}>
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

        <Col xs={12} md={6}>
          <Card className="timetable-card" style={{ width: '150%', maxWidth: '1200px', marginLeft: '100px',    padding: '15px', }}>
            <Card.Header>Availability Schedule</Card.Header>
            <ListGroup variant="flush">
              {doctorData.timetable?.length > 0 ? (
                doctorData.timetable.map((entry, idx) => (
                  <ListGroup.Item key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: '1' }}>
                      <strong>{entry.date}</strong>
                    </div>
                    <div style={{ flex: '2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {entry.slots.map((slot, id2) => (
                        <span key={id2}>{slot.start_time} - {slot.end_time}</span>
                      ))}
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>No timetable available</ListGroup.Item>
              )}
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
