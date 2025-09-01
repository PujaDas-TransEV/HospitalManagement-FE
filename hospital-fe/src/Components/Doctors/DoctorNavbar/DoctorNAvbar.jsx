
import React, { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown, Badge } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import './DoctorNavbar.css';

const DoctorNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [doctorData, setDoctorData] = useState({
    fullname: "",
    profilepictures: "/images/default-profile.jpg",
  });
  const [unseenCount, setUnseenCount] = useState(0);
  const [unseenNotifications, setUnseenNotifications] = useState([]);

  const navigate = useNavigate();

  const toggleProfileDropdown = () => setProfileOpen(!profileOpen);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      try {
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid;

        const formData = new FormData();
        formData.append("doctorid", doctorId);

        const response = await fetch("https://backend.medapp.transev.site/doctors/getbyid", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (data.message === "Doctor data hasbeen fetched successfully") {
          setDoctorData({
            fullname: data.data.fullname,
            profilepictures: data.data.profilepictures
              ? `data:image/jpeg;base64,${data.data.profilepictures}`
              : "/images/default-profile.jpg",
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchUnseenNotifications = async () => {
      try {
        const res = await fetch("https://backend.medapp.transev.site/notify/show/unseen");
        const data = await res.json();
        if (res.ok && Array.isArray(data.notifications)) {
          setUnseenCount(data.unseen_count || 0);
          setUnseenNotifications(data.notifications);
        }
      } catch (err) {
        console.error("Error fetching unseen notifications:", err);
      }
    };

    fetchDoctorInfo();
    fetchUnseenNotifications();
  }, []);

  const handleBellClick = async () => {
    try {
      for (const notification of unseenNotifications) {
        const formData = new FormData();
        formData.append("notificationuid", notification.uid);

        const res = await fetch("https://backend.medapp.transev.site/notify/unseen/update", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          console.error("Failed to update notification:", notification.uid);
        }
      }

      // Reset unseen count after all updates
      setUnseenCount(0);
    } catch (error) {
      console.error("Failed to update notification seen status:", error);
    }

    navigate("/doctor/notification");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="doctor-navbar" fixed="top">
      <Navbar.Brand href="/">LifeCare</Navbar.Brand>

      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="align-items-center">
          {/* Notification Icon with Badge */}
          <div className="notifications-icon" onClick={handleBellClick}>
            <FaBell size={20} color="white" />
            {unseenCount > 0 && (
              <Badge pill bg="danger" className="notifications-badge">
                {unseenCount}
              </Badge>
            )}
          </div>

          {/* Profile Dropdown
          <Dropdown
            align="end"
            show={profileOpen}
            onToggle={toggleProfileDropdown}
            className="profile-dropdown"
          >
            <Dropdown.Toggle
              variant="outline-light"
              id="profile-dropdown"
              onClick={toggleProfileDropdown}
              className="d-flex align-items-center"
            >
              <img
                src={doctorData.profilepictures}
                alt="profile"
                className="profile-image"
              />
              <span className="doctor-name">{doctorData.fullname}</span>
            </Dropdown.Toggle>

            {profileOpen && (
              <Dropdown.Menu>
                <Dropdown.Item href="/doctor-profile">Profile</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            )}
          </Dropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar> */}
    {/* Profile Dropdown */}
<div className="custom-profile-dropdown">
  <div
    className="custom-toggle"
    onClick={toggleProfileDropdown}
    style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
  >
    <img
      src={doctorData.profilepictures}
      alt="Profile"
      className="custom-profile-img"
      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
    />
    <span className="custom-doctor-name" style={{ fontWeight: 600 }}>
      {doctorData.fullname}
    </span>
  </div>

  {profileOpen && (
    <div className="custom-dropdown-menu" style={{
      position: "absolute",
      top: "100%",
      right: 0,
      background: "#fff",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      borderRadius: "6px",
      marginTop: "10px",
      zIndex: 1000,
      minWidth: "160px"
    }}>
      <a
        href="/doctor-profile"
        className="custom-dropdown-item"
        style={{
          padding: "10px 15px",
          display: "block",
          textDecoration: "none",
          color: "#003baa",
          fontWeight: 500
        }}
      >
        Profile
      </a>
      <div
        onClick={handleLogout}
        className="custom-dropdown-item"
        style={{
          padding: "10px 15px",
          cursor: "pointer",
          color: "#a52a2a",
          fontWeight: 500
        }}
      >
        Log Out
      </div>
    </div>
  )}
</div>
  </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default DoctorNavbar;
