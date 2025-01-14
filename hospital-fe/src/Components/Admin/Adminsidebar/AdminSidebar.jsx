
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'react-bootstrap';
import { FaTachometerAlt, FaUserMd, FaUserInjured, FaCalendarAlt, FaMoneyBillWave, FaCogs, FaSignOutAlt, FaBars, FaArrowLeft, FaPills } from 'react-icons/fa';
import './AdminSidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);  // Initially collapsed state

  const toggleSidebar = () => {
    setCollapsed(!collapsed);  // Toggle sidebar collapse/expand
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Toggle Button for Sidebar */}
      <div className="toggle-btn" onClick={toggleSidebar}>
        {collapsed ? (
          <FaBars style={{ fontSize: '1.5rem', cursor: 'pointer' }} />
        ) : (
          <FaArrowLeft
            style={{
             
              cursor: 'pointer',
              marginRight:'80px'

            }}
          />
        )}
      </div>

      {/* Sidebar Content */}
      <div className="sidebar-header">
        {/* You can add any header content here */}
      </div>
      <Nav className="flex-column">
        <NavItem>
          <Link to="/ad-dashboard" className="nav-link">
            <FaTachometerAlt />
            {!collapsed && <span>Dashboard</span>} {/* Show text when not collapsed */}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/manage-doctors" className="nav-link">
            <FaUserMd />
            {!collapsed && <span>Manage Doctors</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/manage-patients" className="nav-link">
            <FaUserInjured />
            {!collapsed && <span>Manage Patients</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/appointment-management" className="nav-link">
            <FaCalendarAlt />
            {!collapsed && <span>Appointment Management</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/facility-management" className="nav-link">
            <FaCalendarAlt />
            {!collapsed && <span>Facility Management</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/billing" className="nav-link">
            <FaMoneyBillWave />
            {!collapsed && <span>Billing & Payments</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/inventory" className="nav-link">
            <FaCogs />
            {!collapsed && <span>Inventory Management</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/reportsprescription" className="nav-link">
            < FaPills />
            {!collapsed && <span> Prescription & Reports</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/admin-settings" className="nav-link">
            <FaCogs />
            {!collapsed && <span>Settings</span>}
          </Link>
        </NavItem>
        <NavItem>
          <Link to="/admin/login" className="nav-link">
            <FaSignOutAlt />
            {!collapsed && <span>Logout</span>}
          </Link>
        </NavItem>
      </Nav>
    </div>
  );
};

export default Sidebar;
