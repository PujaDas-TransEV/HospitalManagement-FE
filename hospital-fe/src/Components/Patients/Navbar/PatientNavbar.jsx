
import React, { useState } from 'react';
import './PatientNavbar.css';

const PatientNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const patientData = {
    name: 'John Doe',
    profilePicture: 'https://via.placeholder.com/40',
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Implement logout functionality (e.g., clear user data, redirect to login page)
    alert('Logging out...');
  };

  return (
    <div className="navbar">
      <div className="brand-name"> Dashboard</div>
      <div className="profile-info">
        <img
          src={patientData.profilePicture}
          alt="Profile"
          className="profile-img"
          onClick={toggleDropdown}
        />
        <span className="patient-name">{patientData.name}</span>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item">My Profile</button>
            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientNavbar;
