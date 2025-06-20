import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuestNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // optional, remove role too
    localStorage.removeItem('patientId'); // optional, if exists

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
