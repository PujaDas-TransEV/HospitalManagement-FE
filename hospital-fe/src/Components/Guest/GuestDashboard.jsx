
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './GuestDashboard.css';

// const GuestDashboard = () => {
//   const navigate = useNavigate();
//   const [patient, setPatient] = useState(null);
//   const [message, setMessage] = useState('Loading patient details...');

//   useEffect(() => {
//     const token = localStorage.getItem('guestToken');
//     const patientId = localStorage.getItem('guestPatientId');

//     if (!token || !patientId) {
//       setMessage('Please login as guest to view your dashboard.');
//       return;
//     }

//     const fetchPatient = async () => {
//       try {
//         const formData = new FormData();
//         formData.append('patientid', patientId);

//         const res = await axios.post(
//           'http://localhost:5000/patients/profile/getbyid',
//           formData,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (res.data?.data) {
//           setPatient(res.data.data);
//           setMessage('');
//         } else {
//           setMessage('Unable to load patient profile.');
//         }
//       } catch (error) {
//         console.error(error);
//         setMessage('Error loading patient profile.');
//       }
//     };

//     fetchPatient();
//   }, []);

//   if (message) {
//     return <p className="centered-message">{message}</p>;
//   }

//   return (
//     <div className="guest-dashboard">
//       <h2>Welcome, {patient.firstname} {patient.lastname}</h2>

//       <div className="patient-card">
//         <div className="patient-info">
//           <p><strong>Email:</strong> {patient.email}</p>
//           <p><strong>Phone:</strong> {patient.phonenumber}</p>
//           <p><strong>Age:</strong> {patient.age}</p>
//           <p><strong>Gender:</strong> {patient.gender}</p>
//           <p><strong>Date of Birth:</strong> {new Date(patient.dob).toLocaleDateString()}</p>
//           <p><strong>Blood Group:</strong> {patient.bloodgroup}</p>
//           <p><strong>Height:</strong> {patient.height} cm</p>
//           <p><strong>Address:</strong> {patient.address}</p>
//         </div>

//         <div className="patient-actions">
//           <button className="action-btn lab-report-btn" onClick={() => navigate('/guest/lab-reports')}>
//             View Lab Report
//           </button>
//           <button className="action-btn prescription-btn" onClick={() => navigate('/guest/prescriptions')}>
//             View Prescription
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuestDashboard;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GuestNavbar from '../Guest/GuestNavbar';  // Adjust path if needed
import './GuestDashboard.css';

const GuestDashboard = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [message, setMessage] = useState('Loading patient details...');

  useEffect(() => {
    const token = localStorage.getItem('guestToken');
    const patientId = localStorage.getItem('guestPatientId');

    if (!token || !patientId) {
      setMessage('Please login as guest to view your dashboard.');
      return;
    }

    const fetchPatient = async () => {
      try {
        const formData = new FormData();
        formData.append('patientid', patientId);

        const res = await axios.post(
          'http://localhost:5000/patients/profile/getbyid',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data?.data) {
          setPatient(res.data.data);
          setMessage('');
        } else {
          setMessage('Unable to load patient profile.');
        }
      } catch (error) {
        console.error(error);
        setMessage('Error loading patient profile.');
      }
    };

    fetchPatient();
  }, []);

  if (message) {
    return <p className="centered-message">{message}</p>;
  }

  return (
    <div className="guest-dashboard-container">
      <GuestNavbar />

      <div className="guest-dashboard">
        <h2>Welcome, {patient.firstname} {patient.lastname}</h2>

        <div className="patient-card">
          <div className="patient-info">
            <p><strong>Email:</strong> {patient.email}</p>
            <p><strong>Phone:</strong> {patient.phonenumber}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Date of Birth:</strong> {new Date(patient.dob).toLocaleDateString()}</p>
            <p><strong>Blood Group:</strong> {patient.bloodgroup}</p>
            <p><strong>Height:</strong> {patient.height} cm</p>
            <p><strong>Address:</strong> {patient.address}</p>
          </div>

          <div className="patient-actions">
            <button className="action-btn lab-report-btn" onClick={() => navigate('/guest/lab-reports')}>
              View Lab Report
            </button>
            <button className="action-btn prescription-btn" onClick={() => navigate('/guest/prescriptions')}>
              View Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestDashboard;
