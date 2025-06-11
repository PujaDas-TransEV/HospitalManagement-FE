import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use navigate for redirection if needed
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the JWT token
import './AdminProfile.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar' ;// Import your custom CSS for styling

const AdminProfilePage = () => {
  const [adminDetails, setAdminDetails] = useState(null);  // Store fetched admin details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Store error message if any
  const navigate = useNavigate();  // Navigate hook for redirection if needed

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

    if (!token) {
      navigate('/admin/login'); // Redirect to login page if there's no token
      return;
    }

    try {
      const decodedToken = jwtDecode(token);  // Decode the token
      console.log('Decoded Token:', decodedToken); // Log the decoded token to inspect it

      // Ensure that 'adminid' exists in the decoded token
      const adminIdFromToken = decodedToken.adminid || decodedToken.userid || null;

      if (!adminIdFromToken) {
        throw new Error('Admin ID is missing from the token');
      }

      // Fetch the admin details using the adminId
      fetchAdminDetails(adminIdFromToken);  // Call the function to fetch admin details

    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/admin/login'); // Redirect to login if token is invalid or expired
    }
  }, [navigate]); // Empty dependency array ensures this effect runs only once

  // Function to fetch admin details
  const fetchAdminDetails = async (adminId) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('adminid', adminId);  // Send adminId as part of the form data

      const response = await fetch('http://192.168.0.105:5000/admin/getdetails', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Backend Response:', data); // Log backend response to inspect it

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch admin details');
      }

      setAdminDetails(data.data);  // Set the response data as the admin profile details
    } catch (error) {
      console.error('Error fetching admin details:', error);
      setError(error.message);  // Set error message if fetching fails
    } finally {
      setLoading(false);  // End the loading state
    }
  };

  // Render loading state or profile info
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!adminDetails) {
    return <div className="error">No admin details available.</div>;  // Display this if no admin details were fetched
  }

  return (
    <div className="dashboard-container">
    <AdminNavbar /> {/* Navbar for admin */}

    <div className="dashboard-content">
      <AdminSidebar /> {/* Sidebar for admin navigation */}

    <div className="profile-container">
      <h1 className="profile-title">Admin Profile</h1>
      <div className="profile-card">
        <div className="profile-info">
          <p><strong>Admin ID:</strong> {adminDetails.uid}</p></div>
          <div className="profile-info"> <p><strong>Name:</strong> {adminDetails.name}</p></div>
          <div className="profile-info"><p><strong>Email:</strong> {adminDetails.email}</p></div>
          <div className="profile-info"></div> <p><strong>Role:</strong> {adminDetails.userrole}</p></div>
        </div>
        </div>
        </div>

    
  );
};

export default AdminProfilePage;
