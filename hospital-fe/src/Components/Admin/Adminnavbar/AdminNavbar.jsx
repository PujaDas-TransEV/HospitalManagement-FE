import React, { useState } from 'react';
import { Navbar, Nav, FormControl, Button, Dropdown } from 'react-bootstrap';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false); // For toggling profile dropdown
  const [notificationOpen, setNotificationOpen] = useState(false); // For toggling notifications dropdown

  // Toggle for Profile dropdown
  const toggleProfileDropdown = () => setProfileOpen(!profileOpen);

  // Toggle for Notifications dropdown
  const toggleNotificationDropdown = () => setNotificationOpen(!notificationOpen);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand >Hospital Admin</Navbar.Brand>

      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav" className="justify-content-between">
        {/* Centered Search Bar Section */}
        <Nav className="mx-auto"> {/* This will center the content */}
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2 search-bar"
          />
          <Button variant="outline-light">
            <FaSearch />
          </Button>
        </Nav>

        {/* Notification and Profile Icons aligned to the right */}
        <Nav className="ml-auto"> {/* Ensures this section goes to the right */}
          {/* Notifications Dropdown */}
          <Dropdown alignRight show={notificationOpen} onToggle={toggleNotificationDropdown}>
            <Dropdown.Toggle variant="outline-light" id="notifications-dropdown" onClick={toggleNotificationDropdown}>
              <FaBell />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">New Appointment Scheduled</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Patient Admission</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Doctor Availability Updated</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Profile Dropdown */}
          <Dropdown alignRight show={profileOpen} onToggle={toggleProfileDropdown}>
            <Dropdown.Toggle variant="outline-light" id="profile-dropdown" onClick={toggleProfileDropdown}>
              {/* Profile image and name */}
              <img
                src="https://via.placeholder.com/40"
                alt="profile"
                className="profile-image"
              />
              <span className="admin-name">Admin</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#/profile-settings">Profile Settings</Dropdown.Item>
              <Dropdown.Item href="#/logout">Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminNavbar;
