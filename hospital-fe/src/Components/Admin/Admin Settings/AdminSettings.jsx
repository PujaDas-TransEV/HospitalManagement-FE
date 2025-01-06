import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate for navigation in React Router v6
import './AdminSettings.css'; // Assuming you will add styles here
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

function AdminSettingsPage() {
  const navigate = useNavigate();  // to redirect to the Forgot Password page
  
  // State for storing admin settings (dummy data for this example)
  const [settings, setSettings] = useState({
    hospitalName: 'LifeCare Hospital',
    hospitalEmail: 'admin@lifecarehospital.com',
    hospitalPhone: '+1234567890',
    hospitalAddress: '123 Sample St, City, Country',
  });

  // Handler to redirect to the Forgot Password page
  const handleChangePassword = () => {
    navigate('/admin/password');  // Redirect to Forgot Password page
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
                setSettings((prev) => ({ ...prev, hospitalName: e.target.value }))
              }
            />
          </div>
          <div className="settings-field">
            <label>Email</label>
            <input
              type="email"
              value={settings.hospitalEmail}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, hospitalEmail: e.target.value }))
              }
            />
          </div>
          <div className="settings-field">
            <label>Phone</label>
            <input
              type="text"
              value={settings.hospitalPhone}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, hospitalPhone: e.target.value }))
              }
            />
          </div>
          <div className="settings-field">
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

        <div className="settings-card">
          <h3>Security Settings</h3>
          <button className="btn" onClick={handleChangePassword}>
            Change Password
          </button>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}

export default AdminSettingsPage;
