
import React, { useState, useEffect } from "react";
import { Navbar, Nav, FormControl, Button, Dropdown } from "react-bootstrap";
import { FaBell, FaSearch } from "react-icons/fa";
import { jwtDecode } from "jwt-decode"; // Ensure jwt-decode is installed
import './DoctorNavbar.css'; // Your custom styling

const DoctorNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [doctorData, setDoctorData] = useState({
    fullname: "",
    profilepictures: "/images/default-profile.jpg", // Default image
  });

  // Toggle Profile dropdown
  const toggleProfileDropdown = () => setProfileOpen(!profileOpen);

  // Toggle Notifications dropdown
  const toggleNotificationDropdown = () => setNotificationOpen(!notificationOpen);

  // Fetch doctor info using the decoded doctorId
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      const accessToken = localStorage.getItem("accessToken"); // Get the token from localStorage

      if (!accessToken) {
        console.error("No access token found. Please log in.");
        return;
      }

      try {
        // Decode the access token to get doctorId
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid; // Extract doctorid from decoded token

        // Prepare the form data to send doctorId
        const formData = new FormData();
        formData.append("doctorid", doctorId); // Append doctorId to the form data

        // Fetch doctor information from API
        const response = await fetch("http://localhost:5000/doctors/getbyid", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.message === "Doctor data hasbeen fetched successfully") {
          // Set the doctor information from the API response
          setDoctorData({
            fullname: data.data.fullname, // Set the full name
            profilepictures: data.data.profilepictures 
              ? `data:image/jpeg;base64,${data.data.profilepictures}` 
              : "/images/default-profile.jpg", // Handle base64 encoding for profile image
          });
        } else {
          console.error("Error fetching doctor information:", data.message);
        }
      } catch (error) {
        console.error("Error decoding token or fetching doctor info:", error);
      }
    };

    fetchDoctorInfo(); // Fetch doctor information when the component mounts
  }, []); // Empty dependency array means it runs once when the component mounts

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="doctor-navbar">
      <Navbar.Brand>Doctor Dashboard</Navbar.Brand>

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
                src={doctorData.profilepictures} // Use the fetched base64 encoded profile picture
                alt="profile"
                className="profile-image"
              />
              <span className="doctor-name">
                {doctorData.fullname} 
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
