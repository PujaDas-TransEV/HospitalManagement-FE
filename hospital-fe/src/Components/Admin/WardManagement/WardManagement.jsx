import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  // Fetch all wards on component load
  useEffect(() => {
    fetchAllWards();
  }, []);

  // Function to fetch all wards
  const fetchAllWards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ops/getallward');
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setAllWards(data);
    } catch (error) {
      setErrorMessage('Failed to fetch wards.');
    }
  };

  // Handle Ward creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wardName || !wardType || !capacity || !location || !wardEmail || !wardPhoneNo) {
      setErrorMessage('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', wardName);
    formData.append('type', wardType);
    formData.append('capacity', capacity);
    formData.append('location', location);
    formData.append('ward_email', wardEmail);
    formData.append('ward_phoneno', wardPhoneNo);

    try {
      const response = await axios.post('http://localhost:5000/ops/wardmanagement', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setSuccessMessage('Ward created successfully!');
        setWardName('');
        setWardType('');
        setCapacity('');
        setLocation('');
        setWardEmail('');
        setWardPhoneNo('');
        fetchAllWards(); // Refresh the ward list after creation
      }
    } catch (error) {
      setErrorMessage('Failed to create ward. Please try again.');
    }
  };

  // Handle search for ward by ID using POST method
  const handleSearchById = async () => {
    if (!searchWardId) {
      setErrorMessage('Please enter a Ward ID.');
      return;
    }

    // Create FormData to send wardid via POST request
    const formData = new FormData();
    formData.append('wardid', searchWardId);

    try {
      const response = await axios.post('http://localhost:5000/ops/getwarddetailsbyid', formData);

      if (response.data && response.data.data && response.data.data.length > 0) {
        setWardDetails(response.data.data[0]); // Set the ward details from the response
        setErrorMessage('');
      } else {
        setErrorMessage('Ward not found.');
        setWardDetails(null); // Clear any previous details if no ward is found
      }
    } catch (error) {
      setErrorMessage('Failed to fetch ward details. Please try again.');
    }
  };

  // Handle Ward Deletion
  const handleDelete = async (wardId) => {
    const formData = new FormData();
    formData.append('wardid', wardId);

    try {
      const response = await axios.post('http://localhost:5000/ops/deleteward', formData);

      if (response.status === 200) {
        setSuccessMessage('Ward deleted successfully!');
        fetchAllWards(); // Refresh the ward list after deletion
      }
    } catch (error) {
      setErrorMessage('Failed to delete ward. Please try again.');
    }
  };

  return (
    <div className="facility-management-page">
      <AdminNavbar />
      <div className="facility-management-content">
        <AdminSidebar />
        <div className="container">
          <h2 className="page-title">Ward Management</h2>

          {/* Error Message */}
          {errorMessage && <div className="error">{errorMessage}</div>}

          {/* Success Message */}
          {successMessage && <div className="success">{successMessage}</div>}

          {/* Search Ward by ID */}
          <div className="search-container">
            <h3>Search Ward by ID</h3>
            <input
              type="text"
              placeholder="Enter Ward ID"
              value={searchWardId}
              onChange={(e) => setSearchWardId(e.target.value)}
            />
            <button onClick={handleSearchById} className="btn">Search</button>

            {/* Display Ward Details */}
            {wardDetails && (
              <div className="ward-details">
                <h4>Ward Details</h4>
                <p><strong>Ward ID:</strong> {wardDetails.uid}</p>
                <p><strong>Ward Name:</strong> {wardDetails.wardname}</p>
                <p><strong>Ward Type:</strong> {wardDetails.wardtype}</p>
                <p><strong>Capacity:</strong> {wardDetails.capacity}</p>
                <p><strong>Location:</strong> {wardDetails.wardlocation}</p>
              </div>
            )}
          </div>

          {/* Ward Creation Form */}
          <div className="card form-container">
            <h3>Create a New Ward</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="wardName">Ward Name</label>
                <input
                  type="text"
                  id="wardName"
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  placeholder="Enter Ward Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="wardType">Ward Type</label>
                <input
                  type="text"
                  id="wardType"
                  value={wardType}
                  onChange={(e) => setWardType(e.target.value)}
                  placeholder="Enter Ward Type"
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Enter Capacity"
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter Location"
                />
              </div>

              <div className="form-group">
                <label htmlFor="wardEmail">Ward Email</label>
                <input
                  type="email"
                  id="wardEmail"
                  value={wardEmail}
                  onChange={(e) => setWardEmail(e.target.value)}
                  placeholder="Enter Ward Email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="wardPhoneNo">Ward Phone Number</label>
                <input
                  type="text"
                  id="wardPhoneNo"
                  value={wardPhoneNo}
                  onChange={(e) => setWardPhoneNo(e.target.value)}
                  placeholder="Enter Ward Phone No"
                />
              </div>

              <button type="submit" className="btn">Create Ward</button>
            </form>
          </div>

          {/* All Wards Table */}
          <div className="card all-wards-container">
            <h3>All Wards</h3>
            <table>
              <thead>
                <tr>
                  <th>Ward Id</th>
                  <th>Ward Name</th>
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
                        onClick={() => handleDelete(ward.uid)}
                        className="btn btn-delete"
                      >
                        Delete
                      </button>
                    </td>
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

export default WardManagementPage;
