import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GuestNavbar.css'; // Make sure CSS is imported

const GuestNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove guest data from localStorage
    localStorage.removeItem('guestToken');
    localStorage.removeItem('guestPatientId');
    localStorage.removeItem('role'); // optional

    // Redirect to guest login/home page
    navigate('/');
  };

  return (
    <nav className="guest-navbar">
      <div className="navbar-content">
        <h1 className="navbar-title">Guest Dashboard</h1>
        <button className="guest-logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default GuestNavbar;
