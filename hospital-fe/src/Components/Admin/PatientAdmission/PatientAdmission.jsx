


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientAdmission.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { FiSearch } from 'react-icons/fi';

const PatientAdmissionPage = () => {
  const [wardId, setWardId] = useState(''); // Store selected ward ID
  const [roomId, setRoomId] = useState(''); // Store selected room ID
  const [patientId, setPatientId] = useState(''); // Store selected patient ID
  const [wards, setWards] = useState([]); // Store list of wards
  const [rooms, setRooms] = useState([]); // Store list of rooms
  const [patients, setPatients] = useState([]); // Store list of patients
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [bedDetails, setBedDetails] = useState([]); // Store all bed details
  const [admissionIdSearch, setAdmissionIdSearch] = useState(''); // Store the admission ID for search
  const [searchedBedDetails, setSearchedBedDetails] = useState(null); // Store searched bed details

  // Fetch all wards, rooms, patients, and bed details when the page loads
  useEffect(() => {
    fetchWards();
    fetchRooms();
    fetchPatients();
    fetchBedDetails(); // Fetch all bed details
  }, []);

  // Fetch all wards from the API
  const fetchWards = async () => {
    try {
      const response = await axios.get('http://192.168.0.106:5000/ops/getallward');
      if (response.data && Array.isArray(response.data.data)) {
        setWards(response.data.data);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch wards.');
    }
  };

  // Fetch all rooms from the API
  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://192.168.0.106:5000/ops/getallrooms');
      if (response.data && Array.isArray(response.data.data)) {
        setRooms(response.data.data);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch rooms.');
    }
  };

  // Fetch all patients from the API
  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://192.168.0.106:5000/patientops/getallpatient');
      if (response.data && Array.isArray(response.data)) {
        setPatients(response.data);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch patients.');
    }
  };

  // Fetch all bed details from the API
  const fetchBedDetails = async () => {
    try {
      const response = await axios.get('http://192.168.0.106:5000/ops/getbeddetails');
      if (response.data && Array.isArray(response.data.data)) {
        setBedDetails(response.data.data);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch bed details.');
    }
  };

  // Handle patient admission
  const handlePatientAdmission = async (e) => {
    e.preventDefault();

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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Patient admitted successfully!');
        setWardId('');
        setRoomId('');
        setPatientId('');
      }
    } catch (error) {
      setErrorMessage('Failed to admit patient. Please try again.');
    }
  };

  // Handle search by admission ID
  const handleSearchByAdmissionId = async () => {
    if (!admissionIdSearch) {
      setErrorMessage('Please enter an Admission ID.');
      return;
    }

    const formData = new FormData();
    formData.append('admissionid', admissionIdSearch);

    try {
      const response = await axios.post('http://192.168.0.106:5000/ops/getbeddetails', formData);
      if (response.data && response.data.data) {
        // Set the fetched data for the searched admission ID
        setSearchedBedDetails(response.data.data);
        setErrorMessage(''); // Clear any previous errors
      } else {
        setErrorMessage('No bed details found for the provided Admission ID.');
        setSearchedBedDetails(null);
      }
    } catch (error) {
      setErrorMessage('Failed to fetch bed details. Please try again.');
      setSearchedBedDetails(null);
    }
  };

  return (
    <div className="patient-admission-page">
      <AdminNavbar />
      <div className="patient-admission-content">
        <AdminSidebar />
        
        <div className="container">
          <h2 className="page-title">Patient Admission</h2>

          {/* Error Message */}
          {errorMessage && <div className="error">{errorMessage}</div>}

          {/* Success Message */}
          {successMessage && <div className="success">{successMessage}</div>}

          {/* Patient Admission Form */}
          <div className="card form-container">
            <h3>Admit a Patient</h3>
            <form onSubmit={handlePatientAdmission}>
              {/* Ward Selection */}
              <div className="form-group">
                <label htmlFor="wardId">Ward</label>
                <select
                  id="wardId"
                  value={wardId}
                  onChange={(e) => setWardId(e.target.value)}
                >
                  <option value="">Select Ward</option>
                  {wards.map((ward) => (
                    <option key={ward.uid} value={ward.uid}>
                      {ward.wardname} - {ward.wardlocation} ({ward.capacity} beds)
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Selection */}
              <div className="form-group">
                <label htmlFor="roomId">Room</label>
                <select
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.uid} value={room.uid}>
                      {room.room_type} - {room.room_number} (ID: {room.uid})
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Selection */}
              <div className="form-group">
                <label htmlFor="patientId">Patient</label>
                <select
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.uid} value={patient.uid}>
                      {patient.firstname} {patient.lastname} ({patient.uid})
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn">Admit Patient</button>
            </form>
          </div>

          {/* Search for Bed Details by Admission ID */}
          <div className="search-section">
            <h3>Search Bed Details by Admission ID</h3>
            <input
              type="text"
              value={admissionIdSearch}
              onChange={(e) => setAdmissionIdSearch(e.target.value)}
              placeholder="Enter Admission ID"
            />
          <button onClick={handleSearchByAdmissionId} className="btn">
  <FiSearch style={{ marginRight: '1px' }} />
</button>
          </div>

          {/* Display Search Results */}
          {searchedBedDetails && (
            <div className="searched-bed-details">
              <h4>Bed Details</h4>
              <p><strong>Admission UID:</strong> {searchedBedDetails.admission_uid}</p>
              <p><strong>Assigned At:</strong> {searchedBedDetails.assigned_at}</p>
              <p><strong>Patient Name:</strong> {searchedBedDetails.patient_name}</p>
              <p><strong>Patient Age:</strong> {searchedBedDetails.patient_age}</p>
              <p><strong>Patient Gender:</strong> {searchedBedDetails.patient_gender}</p>
              <p><strong>Status:</strong> {searchedBedDetails.patient_status}</p>
            </div>
          )}

          {/* All Bed Details Table */}
          <div className="card bed-details-table">
            <h3>All Bed Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Admission UID</th>
                  <th>Assigned At</th>
                  <th>Patient Name</th>
                  <th>Patient Age</th>
                  <th>Patient Gender</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bedDetails.map((bed) => (
                  <tr key={bed.admission_uid}>
                    <td>{bed.admission_uid}</td>
                    <td>{bed.assigned_at}</td>
                    <td>{bed.patient_name}</td>
                    <td>{bed.patient_age}</td>
                    <td>{bed.patient_gender}</td>
                    <td>{bed.patient_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAdmissionPage;
