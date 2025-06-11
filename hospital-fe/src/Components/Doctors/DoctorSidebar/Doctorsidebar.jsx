
import React, { useState, useEffect } from 'react';
import { Nav, Button } from 'react-bootstrap';
import {
  FaCalendar, FaCalendarCheck, FaEnvelope, FaCog,
  FaBars, FaUser, FaCalendarAlt,FaHome ,FaClinicMedical
} from 'react-icons/fa';
import './Doctorsidebar.css';
import { MdDashboard } from 'react-icons/md';
import { FaUserMd } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
const DoctorSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false); // desktop expand/collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile sidebar open/close
const location = useLocation();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileOpen]);

  const handleLinkClick = () => {
    if (isMobileOpen) setIsMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button className="hamburger-btn" onClick={toggleMobileSidebar} aria-label="Toggle sidebar">
        <FaBars />
      </button>

      <div className={`doctor-sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isMobileOpen ? 'mobile-open' : 'mobile-closed'}`}>
        {/* Expand/Collapse toggle on desktop */}
        <button className="expand-toggle-btn" onClick={toggleSidebar} aria-label="Expand sidebar">
          <FaBars />
        </button>

        <div className="sidebar-header">
          {!isExpanded && !isMobileOpen ? null : <h3 className="sidebar-title">Doctor's Panel</h3>}
        </div>

        {/* <Nav className="flex-column"> */}
        <Nav
  className="flex-column"
  style={{
    marginTop: !isExpanded && !isMobileOpen ? '90px' : '20px', // More space when collapsed
  }}
>
          <Nav.Link href="/doctordashboard" className="sidebar-item" onClick={handleLinkClick}>
            < MdDashboard />
            {(isExpanded || isMobileOpen) && ' Dashboard'}
          </Nav.Link>
      

          <Nav.Link href="/appointments" className="sidebar-item" onClick={handleLinkClick}>
            <FaCalendarCheck />
            {(isExpanded || isMobileOpen) && ' Appointments'}
          </Nav.Link>
          <Nav.Link href="/patients" className="sidebar-item" onClick={handleLinkClick}>
            <FaUser />
            {(isExpanded || isMobileOpen) && ' Patient List'}
          </Nav.Link>
           <Nav.Link href="/doctor-homecare" className="sidebar-item" onClick={handleLinkClick}>
            <FaClinicMedical />
            {(isExpanded || isMobileOpen) && ' Homecare'}
          </Nav.Link>
          {/* <Nav.Link href="/messages" className="sidebar-item" onClick={handleLinkClick}>
            <FaEnvelope />
            {(isExpanded || isMobileOpen) && ' Messages'}
          </Nav.Link> */}
          <Nav.Link href="/leave" className="sidebar-item" onClick={handleLinkClick}>
            <FaCalendarAlt />
            {(isExpanded || isMobileOpen) && ' Leave Management'}
          </Nav.Link>
          <Nav.Link href="/doctor-settings" className="sidebar-item" onClick={handleLinkClick}>
            <FaCog />
            {(isExpanded || isMobileOpen) && ' Settings'}
          </Nav.Link>
        </Nav>
        <Nav.Link href="/doctor-profile" className="sidebar-item" onClick={handleLinkClick}>
  <FaUserMd />
  {(isExpanded || isMobileOpen) && ' Profile'}
</Nav.Link>
{/* <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <FaHome className="nav-icon" />
              {(isExpanded || isMobileOpen) && <span>Return To Home</span>}
            </Link>
          </li> */}
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && <div className="sidebar-overlay" onClick={toggleMobileSidebar} />}
    </>
  );
};

export default DoctorSidebar;
