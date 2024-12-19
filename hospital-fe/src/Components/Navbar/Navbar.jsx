import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaHospital, FaSignInAlt } from 'react-icons/fa';
import './Navbar.css'; // Importing the CSS file for styles

function HospitalNavbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page
  };

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="hospital-navbar">
      <div className="navbar-container">
        {/* Left side: Hospital Logo and Name */}
        <div className="navbar-brand">
          <img
            src="/docpulse-logo.png" // Replace with your logo URL
            alt="Hospital Logo"
            className="logo-img"
          />
          <span className="brand-name">MedEase</span>
        </div>

        {/* Center: Navbar Links */}
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">
              <FaHome className="icon" /> Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              <FaInfoCircle className="icon" /> About
            </Link>
          </li>

          {/* Medical Care Dropdown */}
          <li className="dropdown">
            <button onClick={toggleDropdown} className="nav-link dropdown-toggle">
              <FaHospital className="icon" /> Medical Care
            </button>
            {isDropdownOpen && (
              <div className="dropdown-popup">
                <ul className="dropdown-menu">
                  <li><Link to="/medical-care/services" className="dropdown-item">Services</Link></li>
                  <li><Link to="/medical-care/appointments" className="dropdown-item">Appointments</Link></li>
                  <li><Link to="/medical-care/insurance" className="dropdown-item">Insurance</Link></li>
                  <li><Link to="/medical-care/emergency" className="dropdown-item">Emergency</Link></li>
                </ul>
              </div>
            )}
          </li>

          <li>
            <Link to="/contact" className="nav-link">
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Right side: Login/Logout Button */}
        <div className="auth-section">
          {localStorage.getItem('token') ? (
            <button onClick={handleLogout} className="logout-btn">
              <FaSignInAlt className="icon" /> Logout
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              <FaSignInAlt className="icon" /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default HospitalNavbar;
