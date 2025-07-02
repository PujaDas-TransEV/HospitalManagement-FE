
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlusCircle, FaSearch, FaTrashAlt, FaTimes,FaSpinner } from 'react-icons/fa';
import './WardManagement.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const WardManagementPage = () => {
  const [wardName, setWardName] = useState('');
  const [wardType, setWardType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [wardEmail, setWardEmail] = useState('');
  const [wardPhoneNo, setWardPhoneNo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [allWards, setAllWards] = useState([]);
  const [searchWardId, setSearchWardId] = useState('');
  const [wardDetails, setWardDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchAllWards();
  }, []);

  const fetchAllWards = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.0.106:5000/ops/getallward');
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setAllWards(data);
      setErrorMessage('');
    } catch {
      setErrorMessage('Failed to fetch wards.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wardName || !wardType || !capacity || !location || !wardEmail || !wardPhoneNo) {
      setErrorMessage('All fields are required.');
      return;
    }
    setErrorMessage('');
    const formData = new FormData();
    formData.append('name', wardName);
    formData.append('type', wardType);
    formData.append('capacity', capacity);
    formData.append('location', location);
    formData.append('ward_email', wardEmail);
    formData.append('ward_phoneno', wardPhoneNo);

    try {
      const response = await axios.post('http://192.168.0.106:5000/ops/wardmanagement', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        setSuccessMessage('Ward created successfully!');
        setWardName('');
        setWardType('');
        setCapacity('');
        setLocation('');
        setWardEmail('');
        setWardPhoneNo('');
        fetchAllWards();
        setShowCreateModal(false);
      }
    } catch {
      setErrorMessage('Failed to create ward. Please try again.');
    }
  };

  const handleSearchById = async () => {
    if (!searchWardId.trim()) {
      setErrorMessage('Please enter a Ward ID.');
      setWardDetails(null);
      return;
    }
    setErrorMessage('');
    setLoading(true);
    const formData = new FormData();
    formData.append('wardid', searchWardId.trim());
    try {
      const response = await axios.post('http://192.168.0.106:5000/ops/getwarddetailsbyid', formData);
      if (response.data?.data?.length > 0) {
        setWardDetails(response.data.data[0]);
      } else {
        setErrorMessage('Ward not found.');
        setWardDetails(null);
      }
    } catch {
      setErrorMessage('Failed to fetch ward details. Please try again.');
      setWardDetails(null);
    }
    setLoading(false);
  };

  const handleDelete = async (wardId) => {
    if (!window.confirm('Are you sure you want to delete this ward?')) return;
    setErrorMessage('');
    setSuccessMessage('');
    const formData = new FormData();
    formData.append('wardid', wardId);
    try {
      const response = await axios.post('http://192.168.0.106:5000/ops/deleteward', formData);
      if (response.status === 200) {
        setSuccessMessage('Ward deleted successfully!');
        if (wardDetails?.uid === wardId) setWardDetails(null);
        fetchAllWards();
      }
    } catch {
      setErrorMessage('Failed to delete ward. Please try again.');
    }
  };

  return (
    <div className="ward-management-wrapper">
      <AdminNavbar />
      <div className="ward-management-content">
        <AdminSidebar />

        {/* Background Overlay Container */}
        <div className="ward-container">
          <h2>🏥 Ward Management</h2>

          {/* Notifications */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          {/* Top controls: Create Button + Search */}
          <div className="controls-row">
            <button
              className="btn create-btn"
              onClick={() => setShowCreateModal(true)}
              title="Create New Ward"
            >
              <FaPlusCircle className="icon" /> Create Ward
            </button>

            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search Ward by ID"
                value={searchWardId}style={{
          backgroundColor: "#e0f7fa",
         
        }}
                onChange={(e) => setSearchWardId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchById()}
              />
              <button onClick={handleSearchById} className="btn search-btn" title="Search Ward">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Show ward details when searched */}
          {wardDetails && (
            <div className="ward-details-card">
               <button 
      className="close-btnn" 
      onClick={() => setWardDetails(null)} 
      aria-label="Close Ward Details"
    >
      ×
    </button>
              <h3>Ward Details</h3>
              <p><strong>Ward ID:</strong> {wardDetails.uid}</p>
              <p><strong>Ward Name:</strong> {wardDetails.wardname}</p>
              <p><strong>Ward Type:</strong> {wardDetails.wardtype}</p>
              <p><strong>Capacity:</strong> {wardDetails.capacity}</p>
              <p><strong>Location:</strong> {wardDetails.wardlocation}</p>
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(wardDetails.uid)}
              >
                <FaTrashAlt /> Delete Ward
              </button>
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="spinner-wrapper">
                           <FaSpinner className="loading-spinner" />
                         </div>
          )}

          {/* All wards list */}
          {!loading && (
            <div className="wards-list">
              {/* Desktop Table */}
              <table className="wards-table">
                <thead>
                  <tr>
                    <th>Ward ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allWards.map((ward) => (
                    <tr key={ward.uid}>
                      <td>{ward.uid}</td>
                      <td>{ward.wardname}</td>
                      <td>{ward.wardtype}</td>
                      <td>{ward.wardlocation}</td>
                      <td>{ward.capacity}</td>
                      <td>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(ward.uid)}
                          title="Delete Ward"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile cards */}
              <div className="wards-cards">
                {allWards.map((ward) => (
                  <div key={ward.uid} className="ward-card">
                    <p><strong>ID:</strong> {ward.uid}</p>
                    <p><strong>Name:</strong> {ward.wardname}</p>
                    <p><strong>Type:</strong> {ward.wardtype}</p>
                    <p><strong>Location:</strong> {ward.wardlocation}</p>
                    <p><strong>Capacity:</strong> {ward.capacity}</p>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(ward.uid)}
                      title="Delete Ward"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal for Create Ward */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close"
              >
                <FaTimes />
              </button>
              <h3>Create New Ward</h3>
              <form onSubmit={handleSubmit} className="create-ward-form"style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px",
        }}>
                <label>
                  Ward Name
                  <input
                    type="text"
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    placeholder="Enter Ward Name"
                  />
                </label>

                <label>
                  Ward Type
                  <input
                    type="text"
                    value={wardType}
                    onChange={(e) => setWardType(e.target.value)}
                    placeholder="Enter Ward Type"
                  />
                </label>

                <label>
                  Capacity
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Enter Capacity"
                    min="1"
                  />
                </label>

                <label>
                  Location
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter Location"
                  />
                </label>

                <label>
                  Ward Email
                  <input
                    type="email"
                    value={wardEmail}
                    onChange={(e) => setWardEmail(e.target.value)}
                    placeholder="Enter Ward Email"
                  />
                </label>

                <label>
                  Ward Phone Number
                  <input
                    type="text"
                    value={wardPhoneNo}
                    onChange={(e) => setWardPhoneNo(e.target.value)}
                    placeholder="Enter Ward Phone No"
                  />
                </label>

                <button type="submit" className="btn submit-btn">
                  Create Ward
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardManagementPage;
