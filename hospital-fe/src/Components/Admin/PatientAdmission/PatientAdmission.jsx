
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaPlusCircle,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaFileMedicalAlt
} from 'react-icons/fa';
import './PatientAdmission.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { useNavigate } from 'react-router-dom';

const PatientAdmissionPage = () => {
  const [wardId, setWardId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [wards, setWards] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchedDetail, setSearchedDetail] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bedDetails, setBedDetails] = useState([]);
  const [admissionIdSearch, setAdmissionIdSearch] = useState('');
  const [searchedBedDetails, setSearchedBedDetails] = useState(null);
  const [loadingBedDetails, setLoadingBedDetails] = useState(false);

  // Loading states for dropdowns
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
const [patientEmail, setPatientEmail] = useState('');
const [doctorEmail, setDoctorEmail] = useState('');
const navigate = useNavigate();

  useEffect(() => {
    fetchWards();
    fetchRooms();
    fetchPatients();
    fetchBedDetails();
  }, []);

  const fetchWards = async () => {
    setLoadingWards(true);
    try {
      const response = await axios.get('http://192.168.0.106:5000/ops/getallward');
      if (response.data && Array.isArray(response.data.data)) {
        setWards(response.data.data);
      }
    } catch {
      setErrorMessage('Failed to fetch wards.');
    } finally {
      setLoadingWards(false);
    }
  };

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const response = await axios.get('http://192.168.0.106:5000/ops/getallrooms');
      if (response.data && Array.isArray(response.data.data)) {
        setRooms(response.data.data);
      }
    } catch {
      setErrorMessage('Failed to fetch rooms.');
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchPatients = async () => {
    setLoadingPatients(true);
    try {
      const response = await axios.get('http://192.168.0.106:5000/patientops/getallpatient');
      if (response.data && Array.isArray(response.data)) {
        setPatients(response.data);
      }
    } catch {
      setErrorMessage('Failed to fetch patients.');
    } finally {
      setLoadingPatients(false);
    }
  };

  const fetchBedDetails = async () => {
    setLoadingBedDetails(true);
    try {
      const response = await axios.get('http://192.168.0.106:5000/ops/getbeddetails');
      if (response.data && Array.isArray(response.data.data)) {
        setBedDetails(response.data.data);
      }
    } catch {
      setErrorMessage('Failed to fetch bed details.');
    } finally {
      setLoadingBedDetails(false);
    }
  };

  const handlePatientAdmission = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!wardId || !roomId || !patientId) {
      setErrorMessage('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('ward_id', wardId);
    formData.append('room_id', roomId);
    formData.append('patientid', patientId);

    try {
      const response = await axios.post('http://192.168.0.106:5000/ops/patientadmit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setSuccessMessage('Patient admitted successfully!');
        setWardId('');
        setRoomId('');
        setPatientId('');
        setShowModal(false);
        fetchBedDetails(); // refresh table
      }
    } catch {
      setErrorMessage('Failed to admit patient. Please try again.');
    }
  };

  const handleSearchByAdmissionId = async () => {
    setErrorMessage('');
    setSearchedBedDetails(null);

    if (!admissionIdSearch) {
      setErrorMessage('Please enter an Admission ID.');
      return;
    }

    const formData = new FormData();
    formData.append('admissionid', admissionIdSearch);

    try {
      const response = await axios.post('http://192.168.0.106:5000/ops/getbeddetails', formData);
      if (response.data && response.data.data) {
        setSearchedBedDetails(response.data.data);
      } else {
        setErrorMessage('No bed details found for the provided Admission ID.');
      }
    } catch {
      setErrorMessage('Failed to fetch bed details. Please try again.');
    }
  };

  // Discharge-specific states:
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [dischargePatient, setDischargePatient] = useState(null);
  const [deaseasename, setDeaseaseName] = useState('');
  const [deaseasestype, setDeaseaseType] = useState('');
  const [patienthealth_status, setPatientHealthStatus] = useState('');
  const [patientdischarge_date, setPatientDischargeDate] = useState('');
  const [patientdischarge_time, setPatientDischargeTime] = useState('');

  const openDischargeModal = (bed) => {
    setDischargePatient(bed);
    setShowDischargeModal(true);
    setDeaseaseName('');
    setDeaseaseType('');
    setPatientHealthStatus('');
    setPatientDischargeDate('');
    setPatientDischargeTime('');
    setErrorMessage('');
    setSuccessMessage('');
  };

 const submitDischargeForm = async (e) => {
  e.preventDefault();

  if (
    !patientEmail || !doctorEmail ||
    !deaseasename || !deaseasestype ||
    !patienthealth_status || !patientdischarge_date || !patientdischarge_time
  ) {
    setErrorMessage('All fields are required.');
    return;
  }

  const formData = new FormData();
  formData.append('patientemailid', patientEmail);
  formData.append('doctoremailid', doctorEmail);
  formData.append('deaseasename', deaseasename);
  formData.append('deaseasestype', deaseasestype);
  formData.append('patienthealth_status', patienthealth_status);
  formData.append('patientdischarge_date', patientdischarge_date);
  formData.append('patientdischarge_time', patientdischarge_time);

  try {
    await axios.post('http://192.168.0.106:5000/discharge/patientdischarge', formData);
    setSuccessMessage('Patient discharged successfully!');
    setShowDischargeModal(false);
    fetchBedDetails();
  } catch {
    setErrorMessage('Discharge failed. Please try again.');
  }
};


  return (
    <div className="ptadm-wrapper">
      <AdminNavbar />
      <div className="ptadm-content">
        <AdminSidebar />
        <div className="ptadm-container">
          <h2>🩺 Patient Admission</h2>
          {(error || errorMessage) && <div className="error">{error || errorMessage}</div>}
          {(success || successMessage) && <div className="success">{success || successMessage}</div>}

          {/* Search & Admit */}
          <div className="controls">
            <button className="btn create-btn" onClick={() => setShowModal(true)}>
              <FaPlusCircle /> Admit Patient
            </button>
             <button
    className="btn discharge-btn"
    style={{
      marginTop: '10px',
      backgroundColor: '#17a2b8',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px'
    }}
  onClick={() => navigate('/discharge-list')}
      // TODO: Handle navigation or modal opening for discharge list
     >
    
      <FaFileMedicalAlt /> All Discharge List
  </button>
            <div className="search-input">
              <input
                type="text"
                  style={{
          backgroundColor: "#e0f7fa",}}
                placeholder="Search Admission ID..."
                value={admissionIdSearch}
                onChange={(e) => setAdmissionIdSearch(e.target.value)}
              />
              <button className="btn search-btn" onClick={handleSearchByAdmissionId}>
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Searched Detail Card */}
         
  {searchedBedDetails && (
            <div className="detail-card">
              <button className="close-btn" onClick={() => setSearchedBedDetails(null)}><FaTimes /></button>
              <h3>Bed Details</h3>
              <p><strong>Admission UID:</strong> {searchedBedDetails.admission_uid}</p>
              <p><strong>Assigned At:</strong> {searchedBedDetails.assigned_at}</p>
              <p><strong>Patient Name:</strong> {searchedBedDetails.patient_name}</p>
              <p><strong>Patient Age:</strong> {searchedBedDetails.patient_age}</p>
              <p><strong>Patient Gender:</strong> {searchedBedDetails.patient_gender}</p>
              <p><strong>Status:</strong> {searchedBedDetails.patient_status}</p>
            </div>
          )}
          {/* Admissions Table with Discharge Action */}
          <div className="bed-table">
            <h3>All Admissions</h3>
            {loadingBedDetails ? (
              <div className="spinner-wrapper">
                <FaSpinner className="loading-spinner" />
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Admit ID</th>
                    <th>Patient</th>
                    <th>Ward</th>
                    <th>Room</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
               <tbody>
  {bedDetails.map((b) => (
    <tr key={b.admission_uid}>
      <td>{b.admission_uid}</td>
      <td>{b.patient_name}</td>
      <td>{b.ward_id}</td>
      <td>{b.room_id}</td>
      <td>{b.patient_status}</td>
      <td
        style={{
          backgroundColor: '#f8d7da',
          border: '1px solid #dc3545',
          textAlign: 'center',
        }}
      >
        {b.patient_status &&
        ['admit', 'readmitted'].includes(b.patient_status.trim().toLowerCase()) ? (
          <button
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '6px 12px',
              fontSize: '14px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-block',
              minWidth: '80px',
              textAlign: 'center',
            }}
            onClick={() => openDischargeModal(b)}
          >
            Discharge
          </button>
        ) : (
          <span style={{ color: '#999', fontStyle: 'italic' }}>
            No Action
          </span>
        )}
      </td>
    </tr>
  ))}
</tbody>

              </table>
            )}
          </div>

          {/* Admit Patient Modal (your existing code here) */}

          {/* Discharge Modal */}
          {showDischargeModal && dischargePatient && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="close-btn" onClick={() => setShowDischargeModal(false)}>
                  <FaTimes />
                </button>
                <h3>Discharge Patient</h3>
                <form onSubmit={submitDischargeForm} className="adm-form"style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px"}}>
            <label>
  Patient Email
  <input
    type="email"
    value={patientEmail}
    onChange={(e) => setPatientEmail(e.target.value)}
    required
  />
</label>
<label>
  Doctor Email
  <input
    type="email"
    value={doctorEmail}
    onChange={(e) => setDoctorEmail(e.target.value)}
    required
  />
</label>

                  <label>
                    Disease Name
                    <input
                      type="text"
                      value={deaseasename}
                      onChange={(e) => setDeaseaseName(e.target.value)}
                    />
                  </label>
                  <label>
                    Disease Type
                    <select
                      value={deaseasestype}
                      onChange={(e) => setDeaseaseType(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Infectious</option>
                      <option>Chronic</option>
                      <option>Acute</option>
                    </select>
                  </label>
                  <label>
                    Health Status
                    <select
                      value={patienthealth_status}
                      onChange={(e) => setPatientHealthStatus(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option>Stable</option>
                      <option>Improving</option>
                      <option>Critical</option>
                    </select>
                  </label>
                  <label>
                    Discharge Date
                    <input
                      type="date"
                      value={patientdischarge_date}
                      onChange={(e) => setPatientDischargeDate(e.target.value)}
                    />
                  </label>
                  <label>
                    Discharge Time
                    <input
                      type="time"
                      value={patientdischarge_time}
                      onChange={(e) => setPatientDischargeTime(e.target.value)}
                    />
                  </label>
                  <button type="submit" className="btn submit-btnn">
                    Confirm Discharge
                  </button>
                </form>
              </div>
            </div>
          )}
                  {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowModal(false)}><FaTimes /></button>
              <h3>Admit Patient</h3>
              <form onSubmit={handlePatientAdmission} className="adm-form"style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px"}}>
                <label>
                  Ward:
                  <select value={wardId} onChange={e => setWardId(e.target.value)} disabled={loadingWards}>
                    <option value="" disabled>
                      {loadingWards ? 'Loading wards...' : 'Select Ward'}
                    </option>
                    {wards.map(w => (
                      <option key={w.uid} value={w.uid}>
                        {w.wardname} - {w.wardlocation} ({w.capacity} beds)
                      </option>
                    ))}
                  </select>
                  {loadingWards && <FaSpinner className="spin small-spinner" />}
                </label>

                <label>
                  Room:
                  <select value={roomId} onChange={e => setRoomId(e.target.value)} disabled={loadingRooms}>
                    <option value="" disabled>
                      {loadingRooms ? 'Loading rooms...' : 'Select Room'}
                    </option>
                    {rooms.map(r => (
                      <option key={r.uid} value={r.uid}>
                        {r.room_number} - {r.room_type}
                      </option>
                    ))}
                  </select>
                  {loadingRooms && <FaSpinner className="spin small-spinner" />}
                </label>

                <label>
                  Patient:
                  <select value={patientId} onChange={e => setPatientId(e.target.value)} disabled={loadingPatients}>
                    <option value="" disabled>
                      {loadingPatients ? 'Loading patients...' : 'Select Patient'}
                    </option>
                    {patients.map(p => (
                      <option key={p.uid} value={p.uid}>
                        {p.firstname} {p.lastname} ({p.age} yrs)
                      </option>
                    ))}
                  </select>
                  {loadingPatients && <FaSpinner className="spin small-spinner" />}
                </label>

                <button type="submit" className="btn submit-btnn">Submit</button>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default PatientAdmissionPage;
