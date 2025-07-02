
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaPlusCircle,
  FaSearch,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import './PatientAdmission.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

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
  setLoadingBedDetails(true);  // Start spinner
  try {
    const response = await axios.get('http://192.168.0.106:5000/ops/getbeddetails');
    if (response.data && Array.isArray(response.data.data)) {
      setBedDetails(response.data.data);
    }
  } catch {
    setErrorMessage('Failed to fetch bed details.');
  } finally {
    setLoadingBedDetails(false); // Stop spinner
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

  return (
    <div
  className="ptadm-wrapper"
  
>
      <AdminNavbar />
      <div className="ptadm-content">
        <AdminSidebar />
        <div className="ptadm-container">
          <h2>🩺 Patient Admission</h2>

          {(error || errorMessage) && <div className="error">{error || errorMessage}</div>}
          {(success || successMessage) && <div className="success">{success || successMessage}</div>}

          <div className="controls">
            <button className="btn create-btn" onClick={() => setShowModal(true)}>
              <FaPlusCircle /> Admit Patient
            </button>

            <div className="search-input">
              <input
                placeholder="Search Admission ID"
                style={{
          backgroundColor: "#e0f7fa"
          }}
                value={searchId}
                onChange={e => {
                  setSearchId(e.target.value);
                  setAdmissionIdSearch(e.target.value);
                }}
                onKeyDown={e => e.key === 'Enter' && handleSearchByAdmissionId()}
              />
              <button className="btn search-btn" onClick={handleSearchByAdmissionId}>
                <FaSearch />
              </button>
            </div>
          </div>

          {loading && <div className="spinner"><FaSpinner className="spin" /></div>}

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
{loading && (
            <div className="spinner-wrapper">
              <FaSpinner className="loading-spinner" />
            </div>
          )}
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
          <th>Patient Name</th>
           <th>Patient Age</th>
            <th>Patient Gender</th>
          <th>Ward No</th>
          <th>Room No</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {bedDetails.map(b => (
          <tr key={b.admission_uid}>
            <td>{b.admission_uid}</td>
            <td>{b.patient_name}</td>
              <td>{b.patient_age}</td>
               <td>{b.patient_gender}</td>
            <td>{b.ward_id}</td>
            <td>{b.room_id}</td>
            <td>{b.patient_status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
</div>

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
  );
};

export default PatientAdmissionPage;
