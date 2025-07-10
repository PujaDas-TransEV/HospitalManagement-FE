import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Button, Spinner, Alert,
} from 'react-bootstrap';
import {
  FaUserMd, FaUserInjured, FaCalendarAlt, FaHome, FaHospital,
  FaClipboardList, FaToolbox, FaWallet, FaCog, FaFileMedical,
  FaUserShield, FaBed, FaUsers, FaPrescriptionBottleAlt, FaPlusCircle,
  FaProcedures,FaUserPlus,FaComments,FaLifeRing,FaUserMinus,FaFirstAid
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './Dashboard.css'; // ✅ Make sure this file exists

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [
          docRes, patRes, billRes, apptRes
        ] = await Promise.all([
          fetch('http://192.168.0.106:5000/doctorops/getalldoctor'),
          fetch('http://192.168.0.106:5000/patientops/getallpatient'),
          fetch('http://192.168.0.106:5000/billing/getallbill'),
          fetch('http://192.168.0.106:5000/getallappoinment'),
        ]);
        const [docData, patData, billData, apptData] = await Promise.all([
          docRes.json(), patRes.json(), billRes.json(), apptRes.json()
        ]);
        setDoctors(docData.data || []);
        setPatients(patData || []);
        setBills((billData.bills || []).filter(b => b.status?.toLowerCase() === 'pending').length);
        const upcoming = (apptData.data || []).filter(a => new Date(a.appoinmenttime) > new Date());
        setAppointments(apptData.data || []);
        setUpcomingCount(upcoming.length);
        setRecentActivity(apptData.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5));
      } catch (e) {
        console.error(e);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const iconRows = [
    [
      { icon: <FaUserMd />, label: 'Doctors', to: '/manage-doctors', bg: '#4e79a7' },
      { icon: <FaUserInjured />, label: 'Patients', to: '/manage-patients', bg: '#59a14f' },
      { icon: <FaCalendarAlt />, label: 'Appointments', to: '/appointment-management', bg: '#f28e2b' },
      { icon: <FaProcedures />, label: 'Ward Management', to: '/ward-management', bg: '#edc949' },
      { icon: <FaBed />, label: 'Room Management', to: '/room-management', bg: '#e15759' },
      { icon: <FaUsers />, label: 'Staff Management', to: '/staff-management', bg: '#76b7b2' },
      { icon: <FaHome />, label: 'Homecare', to: '/homecare', bg: '#59a14f' },
      { icon: <FaHospital />, label: 'Departments', to: '/facility-management', bg: '#af7aa1' },
    ],
    [
      { icon: <FaClipboardList />, label: 'Lab Reports', to: '/admin-labtest', bg: '#ff9da7' },
      { icon: <FaToolbox />, label: 'Equipment', to: '/equipment-management', bg: '#9c755f' },
      { icon: <FaWallet />, label: 'Billing', to: '/admin-billing', bg: '#bab0ac' },
      { icon: <FaPrescriptionBottleAlt />, label: 'Prescriptions', to: '/reportsprescription', bg: '#a6761d' },
      { icon: <FaCog />, label: 'Settings', to: '/admin-settings', bg: '#1f77b4' },
      { icon: <FaFileMedical />, label: 'Medical Survey', to: '/admin-survey', bg: '#b07aa1' },
      { icon: <FaUserShield />, label: 'Admin Profile', to: '/admin-profile', bg: '#b801dd' },
      { icon: <FaPlusCircle />, label: 'Add Doctor', to: '/doctor-signup', bg: '#d62728' },
    ],
    [
     
  { icon: <FaUserPlus />, label: 'Patient Admission', to: '/patient-admission', bg: '#6aaed6' },
  { icon: <FaFirstAid /> , label: 'Emergency', to: '/admin/emergency',  bg: '#d62828' },
   {icon: <FaUserMinus />, label: 'Patient Discharge', to: '/discharge-list', bg: '#f67280'}, // light blue
  { icon: <FaComments />, label: 'Patient Feedbacks', to: '/admin-feedback', bg: '#8cd790' }, // soft green
  { icon: <FaLifeRing />, label: 'Support Ticket', to: '/admin-support', bg: '#f6c26b' }  // orange yellow

 ]
  ];

  return (
    <div className="admin-dashboard-bg">
      <AdminNavbar />
      <AdminSidebar />
      <Container fluid className="admin-dashboard-content">
        <h2>Admin Dashboard</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        {iconRows.map((row, ri) => (
          <div key={ri} className="icon-row">
            {row.map(({ icon, label, to, bg }) => (
              <div
                key={label}
                className="icon-circle"
                style={{ backgroundColor: bg }}
                onClick={() => navigate(to)}
                role="button"
                tabIndex={0}
              >
                {icon}
                <span>{label}</span>
              </div>
            ))}
          </div>
        ))}

      <Row className="mt-4 info-cards">
  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    {/* Left-aligned card */}
    <Card
      className="card-doctors"
      style={{
        backgroundColor: '#4e79a7',
        padding: '15px',
        borderRadius: '8px',
        width: '30%',
      }}
    >
      <Card.Body className="dashboard-card-body">
        <FaUserMd className="card-icon" color="yellow" />
        <h5>Doctors</h5>
        {/* <p>{loading ? <Spinner animation="border" size="sm" /> : doctors.length}</p> */}
        <p style={{ color: 'orange', fontWeight: 'bold', fontSize: '16px' }}>
  {loading ? <Spinner animation="border" size="sm" /> : doctors.length}
</p>

      </Card.Body>
    </Card>

    {/* Center-aligned card */}
    <Card
      className="card-patients"
      style={{
        backgroundColor: '#aec785',
        padding: '15px',
        borderRadius: '8px',
        width: '30%',
      }}
    >
      <Card.Body className="dashboard-card-body">
        <FaUserInjured className="card-icon" />
        <h5>Patients</h5>
        {/* <p>{loading ? <Spinner animation="border" size="sm" /> : patients.length}</p> */}
          <p style={{ color: 'orange', fontWeight: 'bold', fontSize: '16px' }}>
  {loading ? <Spinner animation="border" size="sm" /> : patients.length}
</p>
      </Card.Body>
    </Card>

    {/* Right-aligned card */}
    <Card
      className="card-appointments"
      style={{
        backgroundColor: '#94b0d1',
        padding: '15px',
        borderRadius: '8px',
        width: '30%',
      }}
    >
      <Card.Body className="dashboard-card-body">
        <FaCalendarAlt className="card-icon" color="pink" />
        <h5>Upcoming Appointments</h5>
        {/* <p>{loading ? <Spinner animation="border" size="sm" /> : upcomingCount}</p> */}
           <p style={{ color: 'orange', fontWeight: 'bold', fontSize: '16px' }}>
  {loading ? <Spinner animation="border" size="sm" /> : upcomingCount}
</p>
      </Card.Body>
    </Card>
  </div>
</Row>

        <Card className="mt-4 recent-activity-card"style={{ backgroundColor: 'skyblue' }}>
  <Card.Header>Recent Activity</Card.Header>
  <Card.Body>
    {loading ? (
      <div className="activity-loading">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading activity...</span>
      </div>
    ) : recentActivity.length ? (
      recentActivity.map((a, i) => (
        <div key={i} className="activity-entry">
          <strong>Dr. {a.doctor_fullname}</strong> with <strong>{a.patient_firstname} {a.patient_lastname}</strong> — {a.appoinmentstatus}
        </div>
      ))
    ) : (
      <p>No recent activity.</p>
    )}
  </Card.Body>
</Card>

      </Container>
    </div>
  );
};

export default AdminDashboard;
