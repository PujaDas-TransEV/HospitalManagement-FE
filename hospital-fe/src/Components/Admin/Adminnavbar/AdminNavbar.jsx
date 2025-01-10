
import React, { useState, useEffect } from "react";
import { Navbar, Nav, FormControl, Button, Dropdown, Modal } from "react-bootstrap";
import { FaBell, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import './AdminNavbar.css'; // Make sure this is imported

const AdminNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "", // Only store the name as a string
  });
  const [notifications, setNotifications] = useState([]); // State to hold notifications
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedNotification, setSelectedNotification] = useState(null); // Store the selected notification details
  const navigate = useNavigate();

  // Fetch admin data on component mount
  useEffect(() => {
    const fetchAdminData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/admin/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const adminId = decodedToken.userid;

        // Prepare FormData to send the admin id in POST request
        const formData = new FormData();
        formData.append("adminid", adminId);

        const response = await fetch("http://localhost:5000/admin/getdetails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setAdminData({
            name: data.data.name, // Store only the name
          });
        } else {
          console.error("Failed to fetch admin data");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [navigate]);

  // Mocking notification data for the sake of example
  useEffect(() => {
    // In a real case, fetch this data from an API or use a socket connection
    setNotifications([
      {
        id: 1,
        message: "New Appointment Scheduled",
        details: "Dr. Smith has a new appointment scheduled with Patient A on 2025-01-12 at 10:00 AM.",
      },
      {
        id: 2,
        message: "Patient Admission",
        details: "New patient admitted to Room 5: John Doe.",
      },
      {
        id: 3,
        message: "Doctor Availability Updated",
        details: "Dr. Williams is now available for appointments after 2:00 PM.",
      },
    ]);
  }, []);

  // Toggle for Profile dropdown
  const toggleProfileDropdown = () => setProfileOpen(!profileOpen);

  // Toggle for Notifications dropdown
  const toggleNotificationDropdown = () => setNotificationOpen(!notificationOpen);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // Clear the token
    navigate("/admin/login"); // Navigate to login page
  };

  // Handle notification click to show modal
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true); // Show the modal when a notification is clicked
  };

  // Handle closing the modal
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Navbar className="admin-navbar" bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>Hospital Admin</Navbar.Brand>

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
                {notifications.map((notification) => (
                  <Dropdown.Item
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {notification.message}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Profile Dropdown */}
            <Dropdown alignRight show={profileOpen} onToggle={toggleProfileDropdown}>
              <Dropdown.Toggle variant="outline-light" id="profile-dropdown" onClick={toggleProfileDropdown}>
                {/* Displaying Admin Name */}
                <span className="admin-name">{adminData.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/admin-profile">Profile Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout} className="logout-btn">Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Modal for displaying notification details */}
      {selectedNotification && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedNotification.message}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{selectedNotification.details}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default AdminNavbar;