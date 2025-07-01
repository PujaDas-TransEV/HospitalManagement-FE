import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import {jwtDecode} from 'jwt-decode'; 
import './AdminSettings.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const AdminSettingsPage = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    hospitalName: 'LifeCare Hospital',
    hospitalEmail: 'admin@lifecarehospital.com',
    hospitalPhone: '+1234567890',
    hospitalAddress: '123 Sample St, City, Country',
  });

  const [deletionStatus, setDeletionStatus] = useState('');
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const adminIdFromToken = decodedToken.adminid || decodedToken.userid || null;
        setAdminId(adminIdFromToken);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/admin/login');
      }
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleChangePassword = () => {
    navigate('/admin/password');
  };

  const handleDeleteAccount = async () => {
    if (!adminId) {
      setDeletionStatus('Admin ID is missing. Please log in again.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('adminid', adminId);

      const response = await fetch('http://192.168.0.106:5000/adminops/deleteadminprofile', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setDeletionStatus(data.message || 'Failed to delete account.');
      } else {
        setDeletionStatus('Your account has been successfully deleted.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('adminId');
        setTimeout(() => navigate('/admin/login'), 3000);
      }
    } catch (error) {
      console.error('Error deleting admin account:', error);
      setDeletionStatus('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="dashboard-container-admin">
      <AdminNavbar />
      <div className="dashboard-content-admin">
        <AdminSidebar />

        <div className="settings-container-admin">
          <h1 className="settings-title-admin">Admin Settings</h1>

          <div className="settings-section-admin hospital-info">
            <h2 className="section-title-admin">Hospital Information</h2>
            <div className="settings-field-admin">
              <label>Hospital Name</label>
              <input
                type="text"
                value={settings.hospitalName}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, hospitalName: e.target.value }))
                }
              />
            </div>
            <div className="settings-field-admin">
              <label>Email</label>
              <input
                type="email"
                value={settings.hospitalEmail}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, hospitalEmail: e.target.value }))
                }
              />
            </div>
            <div className="settings-field-admin">
              <label>Phone</label>
              <input
                type="text"
                value={settings.hospitalPhone}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, hospitalPhone: e.target.value }))
                }
              />
            </div>
            <div className="settings-field-admin">
              <label>Address</label>
              <input
                type="text"
                value={settings.hospitalAddress}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, hospitalAddress: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="settings-section-admin security-settings">
            <h2 className="section-title-admin">Security Settings</h2>
            <button className="action-button-admin" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>

          <div className="settings-section-admin account-settings">
            <h2 className="section-title-admin">Account Settings</h2>
            <button className="delete-button-admin" onClick={handleDeleteAccount}>
              Delete Account
            </button>
            {deletionStatus && (
              <p
                className={`deletion-status-admin ${
                  deletionStatus.includes('successfully') ? 'success' : 'error'
                }`}
              >
                {deletionStatus}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
