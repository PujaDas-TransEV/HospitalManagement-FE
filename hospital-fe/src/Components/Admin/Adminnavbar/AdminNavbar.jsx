import React, { useState, useEffect } from "react";
import { Navbar, Nav, FormControl, Button, Dropdown } from "react-bootstrap";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import './AdminNavbar.css'; // Make sure this is imported

const AdminNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    firstname: "",
    lastname: "",
    profilePicture: "/images/default-profile.jpg",
  });
  const navigate = useNavigate();

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("admin/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const adminId = decodedToken.userid;

        const formData = new FormData();
        formData.append("adminid", adminId);

        const response = await fetch("http://localhost:5000/admin/profile/getbyid", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setAdminData({
            firstname: data.data.firstname,
            lastname: data.data.lastname,
            profilePicture: `data:image/jpeg;base64,${data.data.profilepicture}`,
          });
        } else {
          console.error("Failed to fetch admin profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Toggle for Profile dropdown
  const toggleProfileDropdown = () => setProfileOpen(!profileOpen);

  // Toggle for Notifications dropdown
  const toggleNotificationDropdown = () => setNotificationOpen(!notificationOpen);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Clear the token
    navigate("admin/login"); // Navigate to login page
  };

  return (
    <Navbar className="admin-navbar" bg="dark" variant="dark" expand="lg">
      <Navbar.Brand >Hospital Admin</Navbar.Brand>

      <Navbar.Collapse id="navbar-nav" className="justify-content-between">
        {/* Centered Search Bar Section */}
        <Nav className="mx-auto">
          <FormControl
            type="text"
            placeholder="Search"
            className="mr-sm-2 search-bar"
          />
          <Button variant="outline-light">
            <FaSearch />
          </Button>
        </Nav>

        {/* Notification and Profile Icons aligned side-by-side */}
        <Nav className="ml-auto navbar-right-section">
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
              <img
                src={adminData.profilePicture}
                alt="profile"
                className="profile-image"
              />
              <span className="admin-name">{adminData.firstname} {adminData.lastname}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/admin-profile">Profile Settings</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} className="logout-btn">Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default AdminNavbar;
