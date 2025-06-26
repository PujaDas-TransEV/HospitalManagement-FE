
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  FaUser, FaEnvelope, FaPhone, FaCalendarAlt,
  FaVenusMars, FaBed, FaHospital, FaDoorClosed,
  FaInfoCircle, FaSpinner
} from 'react-icons/fa';
import './Medical.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const PatientMedicalHistoryPage = () => {
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    try {
      const decodedToken = jwtDecode(accessToken);
      setPatientId(decodedToken.userid);
    } catch (error) {
      console.error('Token decode failed:', error);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (patientId) {
      setIsFetching(true);
      const formData = new FormData();
      formData.append('patientid', patientId);

      fetch('http://192.168.0.106:5000/ops/patientadmitstatus', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setPatientDetails(data.data);
          } else {
            setPatientDetails(null);
          }
          setIsFetching(false);
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setIsFetching(false);
        });
    }
  }, [patientId]);

  return (
    <div className="dashboard-container-medical" style={{ backgroundColor: '#e0f7fa'}}>
      <PatientNavbar />
      <div className="dashboard-content"style={{ backgroundColor: '#e0f7fa'}}>
        <PatientSidebar />

        <div className="medical-container">
          <h2 className="page-title">Patient Admission History</h2>

          {isFetching && (
            <div className="modal-overlay">
                         <div className="modal-content"  style={{ backgroundColor: '#e0f7fa'}}>
                           <FaSpinner className="spin large" />
                           <p>Loading admission...</p>
                         </div>
            </div>
          )}

          {!isFetching && patientDetails ? (
            <div className="patient-info-list">
            
            <div className="patient-info-item patient-name">
  <FaUser className="icon" style={{ color: "#00796b" }} /> <strong>Name:</strong> {patientDetails.patientfirstname} {patientDetails.patientlastname}
</div>
<div className="patient-info-item patient-age">
  <FaCalendarAlt className="icon" style={{ color: "#3f51b5" }} /> <strong>Age:</strong> {patientDetails.patientage}
</div>
<div className="patient-info-item patient-email">
  <FaEnvelope className="icon" style={{ color: "#d84315" }} /> <strong>Email:</strong> {patientDetails.patientemail}
</div>
<div className="patient-info-item patient-gender">
  <FaVenusMars className="icon" style={{ color: "#8e24aa" }} /> <strong>Gender:</strong> {patientDetails.patientgender}
</div>
<div className="patient-info-item patient-phone">
  <FaPhone className="icon" style={{ color: "#388e3c" }} /> <strong>Phone:</strong> {patientDetails.patientphoneno}
</div>
<div className="patient-info-item patient-status">
  <FaInfoCircle className="icon" style={{ color: "#fbc02d" }} /> <strong>Status:</strong> {patientDetails.admitstatus}
</div>
<div className="patient-info-item patient-ward">
  <FaHospital className="icon" style={{ color: "#0097a7" }} /> <strong>Ward:</strong> {patientDetails.wardname}
</div>
<div className="patient-info-item patient-wardmail">
  <FaEnvelope className="icon" style={{ color: "#c2185b" }} /> <strong>Ward Email:</strong> {patientDetails.wardemail}
</div>
<div className="patient-info-item patient-room">
  <FaDoorClosed className="icon" style={{ color: "#5d4037" }} /> <strong>Room No:</strong> {patientDetails.room_number}
</div>
<div className="patient-info-item patient-type">
  <FaBed className="icon" style={{ color: "#303f9f" }} /> <strong>Room Type:</strong> {patientDetails.room_type}
</div>
</div>
          ) : (
            !isFetching && (
              <div className="no-details-message">
                 No admission details found for this patient.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistoryPage;
