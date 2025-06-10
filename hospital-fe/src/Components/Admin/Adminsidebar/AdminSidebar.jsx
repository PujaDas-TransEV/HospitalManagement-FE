
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserMd, FaUserInjured, FaCalendarAlt, FaMoneyBillWave,
  FaCogs, FaSignOutAlt, FaBars, FaPills, FaPlusCircle, FaBed, FaTools,
  FaBuilding, FaUser, FaQuestionCircle, FaClinicMedical, FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';
import './AdminSidebar.css';
import { useNavigate } from "react-router-dom";
import { MdMedicalServices } from 'react-icons/md';
import { MdDashboard } from 'react-icons/md';
const AdminSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsExpanded(!isExpanded);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
  }, [isMobileOpen]);

  const handleLinkClick = () => {
    if (isMobileOpen) setIsMobileOpen(false);
  };
  const navigate = useNavigate();
  const showText = isExpanded || isMobileOpen;
const handleLogout = () => {
  localStorage.removeItem("accessToken");
  navigate("/admin/login");
};

  return (
    <>
      <button className="hamburger-btn" onClick={toggleMobileSidebar}>
        <FaBars />
      </button>

      <div className={`sidebar-nav ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'} ${isMobileOpen ? 'mobile-open' : 'mobile-closed'}`}>
        <button className="expand-toggle-btnn" onClick={toggleSidebar}>
          {isExpanded ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
        </button>
 <div className="sidebar-content">
        <ul className="navigation-list">
          <li className="nav-item">
            <Link to="/ad-dashboard" className={`nav-link ${location.pathname === '/ad-dashboard' ? 'active-link' : ''}`} onClick={handleLinkClick}>
              <MdDashboard className="nav-icon" />
              {showText && <span>Dashboard</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/manage-doctors" className="nav-link" onClick={handleLinkClick}>
              <FaUserMd className="nav-icon" />
              {showText && <span>Manage Doctors</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/manage-patients" className="nav-link" onClick={handleLinkClick}>
              <FaUserInjured className="nav-icon" />
              {showText && <span>Manage Patients</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/appointment-management" className="nav-link" onClick={handleLinkClick}>
              <FaCalendarAlt className="nav-icon" />
              {showText && <span>Appointments</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/homecare" className="nav-link" onClick={handleLinkClick}>
              <FaClinicMedical className="nav-icon" />
              {showText && <span>Homecare</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/facility-management" className="nav-link" onClick={handleLinkClick}>
              <FaBuilding className="nav-icon" />
              {showText && <span>Facility Management</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/ward-management" className="nav-link" onClick={handleLinkClick}>
              <FaPlusCircle className="nav-icon" />
              {showText && <span>Ward Management</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/room-management" className="nav-link" onClick={handleLinkClick}>
              <FaBed className="nav-icon" />
              {showText && <span>Room Management</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/staff-management" className="nav-link" onClick={handleLinkClick}>
              <FaUser className="nav-icon" />
              {showText && <span>Staff Management</span>}
            </Link>
          </li>
           <li className="nav-item">
            <Link to="/admin-labtest" className="nav-link" onClick={handleLinkClick}>
              < MdMedicalServices className="nav-icon" />
              {showText && <span>Lab Report Management</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin-billing" className="nav-link" onClick={handleLinkClick}>
              <FaMoneyBillWave className="nav-icon" />
              {showText && <span>Billing</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/equipment-management" className="nav-link" onClick={handleLinkClick}>
              <FaTools className="nav-icon" />
              {showText && <span>Equipment</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/reportsprescription" className="nav-link" onClick={handleLinkClick}>
              <FaPills className="nav-icon" />
              {showText && <span>Prescriptions</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin-support" className="nav-link" onClick={handleLinkClick}>
              <FaQuestionCircle className="nav-icon" />
              {showText && <span>Support</span>}
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin-settings" className="nav-link" onClick={handleLinkClick}>
              <FaCogs className="nav-icon" />
              {showText && <span>Settings</span>}
            </Link>
          </li>
        
          <li className="nav-item">
  <button className="nav-link logout-button" onClick={handleLogout}>
    <FaSignOutAlt className="nav-icon" />
    {showText && <span>Logout</span>}
  </button>
</li>

        </ul>
      </div>
</div>
      {isMobileOpen && <div className="sidebar-overlay" onClick={toggleMobileSidebar} />}
    </>
  );
};

export default AdminSidebar;
