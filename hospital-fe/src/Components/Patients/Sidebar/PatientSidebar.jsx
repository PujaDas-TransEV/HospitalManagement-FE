
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome, FaHeartbeat, FaCalendarCheck, FaNotesMedical,
  FaEnvelope, FaFileAlt, FaUser, FaBars, FaQuestionCircle, FaCog,
  FaAngleDoubleLeft, FaAngleDoubleRight,FaRegClipboard
} from 'react-icons/fa';

import './PatientSidebar.css';
import { MdDashboard } from 'react-icons/md';
import { MdSupportAgent } from 'react-icons/md';

const PatientSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false); // desktop expand/collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile sidebar open/close
  const location = useLocation();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Lock scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileOpen]);

  // Close mobile sidebar on navigation click
  const handleLinkClick = () => {
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger button only on mobile */}
      <button className="hamburger-btn" onClick={toggleMobileSidebar} aria-label="Toggle sidebar">
        <FaBars />
      </button>

      {/* Sidebar */}
      <div
        className={`
          sidebar-nav 
          ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'} 
          ${isMobileOpen ? 'mobile-open' : 'mobile-closed'}
        `}
      >
        {/* Desktop expand/collapse toggle */}
        <button className="expand-toggle-btn" onClick={toggleSidebar} aria-label="Expand sidebar">
          {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
        </button>

        <ul className="navigation-list">
          <li className="nav-item">
            <Link to="/patient-dashboard" className={`nav-link ${location.pathname === '/patient-dashboard' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <MdDashboard className="nav-icon" />
              {(isExpanded || isMobileOpen) && <span>Dashboard</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/home-care-service" className={`nav-link ${location.pathname === '/home-care-service' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <FaHeartbeat className="nav-icon" />
              {(isExpanded || isMobileOpen)&& <span>Home Care Service</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/patient-Appointments" className={`nav-link ${location.pathname === '/appointments' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <FaCalendarCheck className="nav-icon" />
              {(isExpanded || isMobileOpen) && <span>Appointments</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/medical-history" className={`nav-link ${location.pathname === '/medical-history' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <FaNotesMedical className="nav-icon" />
              {(isExpanded || isMobileOpen)&& <span>Medical History</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/messages" className={`nav-link ${location.pathname === '/messages' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <FaEnvelope className="nav-icon" />
              {(isExpanded || isMobileOpen) && <span>Messages</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/prescription" className={`nav-link ${location.pathname === '/reports' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <FaFileAlt className="nav-icon" />
              {(isExpanded || isMobileOpen) && <span>Reports</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/patient-support" className={`nav-link ${location.pathname === '/patient-support' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <MdSupportAgent className="nav-icon" />
              {(isExpanded || isMobileOpen)&& <span>Support</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <FaUser className="nav-icon" />
              {(isExpanded || isMobileOpen) && <span>My Account</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <FaCog className="nav-icon" />
              {(isExpanded || isMobileOpen) && <span>Settings</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <FaHome className="nav-icon" />
              {(isExpanded || isMobileOpen) && <span>Return To Home</span>}
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay behind sidebar on mobile */}
      {isMobileOpen && <div className="sidebar-overlay" onClick={toggleMobileSidebar} />}
    </>
  );
};

export default PatientSidebar;
