import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode';
import { FaSpinner } from 'react-icons/fa'; // ✅ Import spinner icon
import './AdminProfile.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const AdminProfilePage = () => {
  const [adminDetails, setAdminDetails] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();  

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); 
    if (!token) {
      navigate('/admin/login'); 
      return;
    }

    try {
      const decodedToken = jwtDecode(token);  
      const adminIdFromToken = decodedToken.adminid || decodedToken.userid || null;
      if (!adminIdFromToken) {
        throw new Error('Admin ID is missing from the token');
      }
      fetchAdminDetails(adminIdFromToken); 
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/admin/login'); 
    }
  }, [navigate]); 

  const fetchAdminDetails = async (adminId) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('adminid', adminId);  

      const response = await fetch('https://backend.medapp.transev.site/admin/getdetails', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch admin details');
      }
      setAdminDetails(data.data); 
    } catch (error) {
      setError(error.message);  
    } finally {
      setLoading(false); 
    }
  };

  // ✅ Loading Spinner JSX
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#ecf0f1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          fontWeight: 600,
          color: '#2c3e50',
        }}
      >
        <FaSpinner
          style={{
            fontSize: '3rem',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px',
            color: '#2980b9',
          }}
        />
        Loading admin profile...
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
      </div>
    );
  }

  // No admin details
  if (!adminDetails) {
    return <div className="error">No admin details available.</div>;  
  }

  return (
    <div className="dashboard-container">
      <AdminNavbar />
      <div className="dashboard-content">
        <AdminSidebar />
        <div className="profile-container">
          <h1 className="profile-title">Admin Profile</h1>
          <div className="profile-card">
            <div className="profile-info">
              <p><strong>Admin ID:</strong> {adminDetails.uid}</p>
            </div>
            <div className="profile-info">
              <p><strong>Name:</strong> {adminDetails.name}</p>
            </div>
            <div className="profile-info">
              <p><strong>Email:</strong> {adminDetails.email}</p>
            </div>
            <div className="profile-info">
              <p><strong>Role:</strong> {adminDetails.userrole}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
