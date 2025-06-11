
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode'; 
import './AdminSettings.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

function AdminSettingsPage() {
  const navigate = useNavigate();  // to redirect to the Forgot Password page
  const [settings, setSettings] = useState({
    hospitalName: 'LifeCare Hospital',
    hospitalEmail: 'admin@lifecarehospital.com',
    hospitalPhone: '+1234567890',
    hospitalAddress: '123 Sample St, City, Country',
  });

  // State to handle deletion response
  const [deletionStatus, setDeletionStatus] = useState('');

  // Get the adminId from localStorage (assuming the admin's token contains this ID)
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');  // Retrieve token from localStorage

    if (token) {
      try {
        const decodedToken = jwtDecode(token);  // Decode the token
        const adminIdFromToken = decodedToken.adminid || decodedToken.userid || null;
        setAdminId(adminIdFromToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/admin/login');  // Redirect to login page if the token is invalid
      }
    } else {
      navigate('/admin/login');  // Redirect to login if no token is found
    }
  }, [navigate]);

  // Handler to redirect to the Forgot Password page
  const handleChangePassword = () => {
    navigate('/admin/password');  // Redirect to Forgot Password page
  };

  // Handle delete account functionality
  const handleDeleteAccount = async () => {
    if (!adminId) {
      setDeletionStatus('Admin ID is missing. Please log in again.');
      return;
    }

    console.log("Deleting account for adminId: ", adminId);  // Log the adminId to verify

    try {
      // Create a FormData object and append the adminId to it
      const formData = new FormData();
      formData.append('adminid', adminId);  // Send adminId as FormData

      const response = await fetch('http://192.168.0.105:5000/adminops/deleteadminprofile', {
        method: 'POST',
        body: formData,  // Pass FormData in the body
      });

      const data = await response.json();

      if (!response.ok) {
        setDeletionStatus(data.message || 'Failed to delete account.');
      } else {
        setDeletionStatus('Your account has been successfully deleted.');
        // Remove tokens and redirect to the login page after successful deletion
        localStorage.removeItem('accessToken');
        localStorage.removeItem('adminId');
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Error deleting admin account:', error);
      setDeletionStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="dashboard-container">
      <AdminNavbar /> {/* Navbar for admin */}

      <div className="dashboard-content">
        <AdminSidebar /> {/* Sidebar for admin navigation */}

        <div className="admin-settings-page">
          <div className="settings-header">
            <h2>Admin Settings</h2>
          </div>

          <div className="settings-container">
            <div className="settings-card">
              <h3>Hospital Information</h3>
              <div className="settings-field">
                <label>Hospital Name</label>
                <input
                  type="text"
                  value={settings.hospitalName}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, hospitalName: e.target.value }))}
                />
              </div>
              <div className="settings-field">
                <label>Email</label>
                <input
                  type="email"
                  value={settings.hospitalEmail}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, hospitalEmail: e.target.value }))}
                />
              </div>
              <div className="settings-field">
                <label>Phone</label>
                <input
                  type="text"
                  value={settings.hospitalPhone}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, hospitalPhone: e.target.value }))}
                />
              </div>
              <div className="settings-field">
                <label>Address</label>
                <input
                  type="text"
                  value={settings.hospitalAddress}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, hospitalAddress: e.target.value }))}
                />
              </div>
            </div>

            <div className="settings-card">
              <h3>Security Settings</h3>
              <button className="btn" onClick={handleChangePassword}>
                Change Password
              </button>
            </div>

            <div className="settings-card">
              <h3>Account Settings</h3>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Delete Account
              </button>
              {deletionStatus && (
                <p className={`deletion-status ${deletionStatus.includes('successfully') ? 'success' : 'error'}`}>
                  {deletionStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettingsPage;
