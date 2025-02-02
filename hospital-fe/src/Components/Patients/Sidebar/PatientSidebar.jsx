import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaHeartbeat, FaCalendarCheck, FaNotesMedical, FaEnvelope, FaFileAlt, FaUser, FaAngleDoubleLeft, FaAngleDoubleRight,FaCog ,FaQuestionCircle  } from 'react-icons/fa';  // Import FaTimes for close button
import './PatientSidebar.css'; // Import your CSS file for styling

const PatientSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation(); // Get current location from react-router-dom

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar-container ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <div className={`sidebar-nav ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* Toggle Button */}
        <button className="expand-toggle-btn" onClick={toggleExpand}>
          {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
        </button>

        {/* Sidebar Navigation */}
        <ul className="navigation-list">
          <li className="nav-item home-item">
            <Link to="/patient-dashboard" className={`nav-link ${location.pathname === '/patient-dashboard' ? 'active-link' : ''}`}>
              <FaHome className="nav-icon" />
              {isExpanded && <span>Home</span>}
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/patient-health" className={`nav-link ${location.pathname === '/patient-health' ? 'active-link' : ''}`}>
              <FaHeartbeat className="nav-icon" />
              {isExpanded && <span>Health Overview</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/patient-Appointments" className={`nav-link ${location.pathname === '/appointments' ? 'active-link' : ''}`}>
              <FaCalendarCheck className="nav-icon" />
              {isExpanded && <span>Appointments</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/medical-history" className={`nav-link ${location.pathname === '/medical-history' ? 'active-link' : ''}`}>
              <FaNotesMedical className="nav-icon" />
              {isExpanded && <span>Medical History</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/messages" className={`nav-link ${location.pathname === '/messages' ? 'active-link' : ''}`}>
              <FaEnvelope className="nav-icon" />
              {isExpanded && <span>Messages</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/prescription" className={`nav-link ${location.pathname === '/reports' ? 'active-link' : ''}`}>
              <FaFileAlt className="nav-icon" />
              {isExpanded && <span>Reports/Documents</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/patient-support" className={`nav-link ${location.pathname === '/patient-support' ? 'active-link' : ''}`}>
              <FaQuestionCircle className="nav-icon" />
              {isExpanded && <span>Support</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active-link' : ''}`}>
              <FaUser className="nav-icon" />
              {isExpanded && <span>My Account</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active-link' : ''}`}>
              <FaCog  className="nav-icon" />
              {isExpanded && <span>Settings</span>}
            </Link>
          </li>
        </ul>

       
      </div>
    </div>
  );
};

export default PatientSidebar;

