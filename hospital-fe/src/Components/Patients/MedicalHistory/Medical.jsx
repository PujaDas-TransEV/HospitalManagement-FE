import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
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
  const [dischargeDetails, setDischargeDetails] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [patientEmailId, setPatientEmailId] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    try {
      const decodedToken = jwtDecode(accessToken);
      setPatientId(decodedToken.userid);
      setPatientEmailId(decodedToken.patientemailid);
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

      fetch('https://backend.medapp.transev.site/ops/patientadmitstatus', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            setPatientDetails(data.data);
            setDischargeDetails(null); // clear discharge if admission found
          } else {
            setPatientDetails(null);
            // Now fetch discharge details if no admission found
            if (patientEmailId) {
              fetchDischargeDetails(patientEmailId);
            } else {
              setIsFetching(false);
            }
          }
          if (data.data) setIsFetching(false);
        })
        .catch(err => {
          console.error('Fetch error:', err);
          setIsFetching(false);
        });
    }
  }, [patientId, patientEmailId]);

  const fetchDischargeDetails = (email) => {
    setIsFetching(true);
    const formData = new FormData();
    formData.append('patientemailid', email);

    fetch('https://backend.medapp.transev.site/discharge/getdisdetailsp', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setDischargeDetails(data.data);
        } else {
          setDischargeDetails(null);
        }
        setIsFetching(false);
      })
      .catch(err => {
        console.error('Fetch discharge error:', err);
        setIsFetching(false);
      });
  };

  return (
    <div 
      className="dashboard-container-medical" 
      style={{ 
        backgroundColor: '#e0f7fa', 
        backgroundImage: `url('/images/medical-bg.jpg')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <PatientNavbar />
      <div className="dashboard-content" style={{ backgroundColor: 'rgba(224, 247, 250, 0.8)' }}>
        <PatientSidebar />

        <div className="medical-container">
          <h2 className="page-title">Patient Admission History</h2>

          {isFetching && (
            <div className="modal-overlay-admission">
              <div className="modal-content-admission" style={{ backgroundColor: '#e0f7fa' }}>
                <FaSpinner className="spin large" />
                <p>Loading admission/discharge...</p>
              </div>
            </div>
          )}

          {!isFetching && patientDetails && (
          <div className="patient-info-list">
  <div className="patient-info-item patient-name">
    <FaUser className="icon" /> <strong>Name:</strong> {patientDetails.patientfirstname} {patientDetails.patientlastname}
  </div>
  <div className="patient-info-item patient-age">
    <FaCalendarAlt className="icon" /> <strong>Age:</strong> {patientDetails.patientage}
  </div>
  <div className="patient-info-item patient-email">
    <FaEnvelope className="icon" /> <strong>Email:</strong> {patientDetails.patientemail}
  </div>
  <div className="patient-info-item patient-gender">
    <FaVenusMars className="icon" /> <strong>Gender:</strong> {patientDetails.patientgender}
  </div>
  <div className="patient-info-item patient-phone">
    <FaPhone className="icon" /> <strong>Phone:</strong> {patientDetails.patientphoneno}
  </div>
  <div className="patient-info-item patient-status">
    <FaInfoCircle className="icon" /> <strong>Status:</strong> {patientDetails.admitstatus}
  </div>

  {/* ✅ Discharge date/time if discharged */}
  {patientDetails.admitstatus === 'discharged' && (
    <>
      <div className="patient-info-item patient-discharge-date">
        <FaCalendarAlt className="icon" /> <strong>Discharge Date:</strong> {patientDetails.dischargedate}
      </div>
      <div className="patient-info-item patient-discharge-time">
        <FaCalendarAlt className="icon" /> <strong>Discharge Time:</strong> {patientDetails.dischargetime}
      </div>
    </>
  )}

  <div className="patient-info-item patient-ward">
    <FaHospital className="icon" /> <strong>Ward:</strong> {patientDetails.wardname}
  </div>
  <div className="patient-info-item patient-wardmail">
    <FaEnvelope className="icon" /> <strong>Ward Email:</strong> {patientDetails.wardemail}
  </div>
  <div className="patient-info-item patient-room">
    <FaDoorClosed className="icon" /> <strong>Room No:</strong> {patientDetails.room_number}
  </div>
  <div className="patient-info-item patient-type">
    <FaBed className="icon" /> <strong>Room Type:</strong> {patientDetails.room_type}
  </div>
</div>
          )}

          {!isFetching && !patientDetails && dischargeDetails && (
            <>
              <h2 className="page-title" style={{ marginTop: '40px' }}>Discharge Details</h2>
              <div className="patient-info-list">
                <div className="patient-info-item patient-name" style={{ backgroundColor: '#4caf50' }}>
                  <FaInfoCircle className="icon" /> <strong>Disease Name:</strong> {dischargeDetails.deaseasename}
                </div>
                <div className="patient-info-item patient-age" style={{ backgroundColor: '#81c784' }}>
                  <FaInfoCircle className="icon" /> <strong>Disease Type:</strong> {dischargeDetails.deaseasestype}
                </div>
                <div className="patient-info-item patient-email" style={{ backgroundColor: '#aed581' }}>
                  <FaEnvelope className="icon" /> <strong>Doctor Email:</strong> {dischargeDetails.doctoremailid}
                </div>
                <div className="patient-info-item patient-gender" style={{ backgroundColor: '#dce775' }}>
                  <FaCalendarAlt className="icon" /> <strong>Discharge Date:</strong> {dischargeDetails.patientdischarge_date}
                </div>
                <div className="patient-info-item patient-phone" style={{ backgroundColor: '#fff176', color: '#000' }}>
                  <FaCalendarAlt className="icon" /> <strong>Discharge Time:</strong> {dischargeDetails.patientdischarge_time}
                </div>
                <div className="patient-info-item patient-status" style={{ backgroundColor: '#ffb74d', color: '#000' }}>
                  <FaInfoCircle className="icon" /> <strong>Health Status:</strong> {dischargeDetails.patienthealth_status}
                </div>
                <div className="patient-info-item patient-email" style={{ backgroundColor: '#ff8a65', color: '#000' }}>
                  <FaEnvelope className="icon" /> <strong>Patient Email:</strong> {dischargeDetails.patientemailid}
                </div>
              </div>
            </>
          )}

          {!isFetching && !patientDetails && !dischargeDetails && (
            <div className="no-details-message">
              No admission or discharge details found for this patient.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistoryPage;
