
import React, { useState } from "react";
import { Navbar, Nav, FormControl, Button, Dropdown } from "react-bootstrap";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import './DoctorNavbar.css'; // Your custom styling

const DoctorNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [doctorData, setDoctorData] = useState({
    firstname: "John",
    lastname: "Doe",
    profilePicture: "/images/default-profile.jpg", // Default image
  });

  // Toggle Profile dropdown
  const toggleProfileDropdown = () => setProfileOpen(!profileOpen);

  // Toggle Notifications dropdown
  const toggleNotificationDropdown = () => setNotificationOpen(!notificationOpen);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="doctor-navbar">
      <Navbar.Brand >Doctor Dashboard</Navbar.Brand>

      
      <Navbar.Collapse id="navbar-nav" className="justify-content-between">
        {/* Search Bar */}
        <Nav className="mx-auto">
          <FormControl
            type="text"
            placeholder="Search for Patients or Appointments"
            className="search-bar"
          />
          <Button variant="outline-light">
            <FaSearch />
          </Button>
        </Nav>

        {/* Notification & Profile Section */}
        <Nav className="ml-auto notification-profile-container">
          {/* Notifications */}
          <Dropdown
            alignRight
            show={notificationOpen}
            onToggle={toggleNotificationDropdown}
            className="notification-dropdown"
          >
            <Dropdown.Toggle
              variant="outline-light"
              id="notifications-dropdown"
              onClick={toggleNotificationDropdown}
            >
              <FaBell />
            </Dropdown.Toggle>
            {notificationOpen && (
              <Dropdown.Menu>
                <Dropdown.Item href="/appointments">New Appointment</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Patient Update</Dropdown.Item>
              </Dropdown.Menu>
            )}
          </Dropdown>

          {/* Profile Dropdown */}
          <Dropdown
            alignRight
            show={profileOpen}
            onToggle={toggleProfileDropdown}
            className="profile-dropdown"
          >
            <Dropdown.Toggle
              variant="outline-light"
              id="profile-dropdown"
              onClick={toggleProfileDropdown}
            >
              <img
                src={doctorData.profilePicture}
                alt="profile"
                className="profile-image"
              />
              <span className="doctor-name">
                {doctorData.firstname} {doctorData.lastname}
              </span>
            </Dropdown.Toggle>
            {profileOpen && (
              <Dropdown.Menu>
                <Dropdown.Item href="/doctor-profile">Profile</Dropdown.Item>
                <Dropdown.Item href="/login">Log Out</Dropdown.Item>
              </Dropdown.Menu>
            )}
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default DoctorNavbar;
