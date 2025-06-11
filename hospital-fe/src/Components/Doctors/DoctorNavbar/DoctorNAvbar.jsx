

import React, { useState, useEffect } from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import './DoctorNavbar.css';

const DoctorNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [doctorData, setDoctorData] = useState({
    fullname: "",
    profilepictures: "/images/default-profile.jpg",
  });

  const navigate = useNavigate();

  const toggleProfileDropdown = () => setProfileOpen(!profileOpen);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }
      try {
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid;

        const formData = new FormData();
        formData.append("doctorid", doctorId);

        const response = await fetch("http://192.168.0.106:5000/doctors/getbyid", {
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

    fetchDoctorInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="doctor-navbar" fixed="top">
      <Navbar.Brand href="/">LifeCare</Navbar.Brand>
      {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}

      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav>
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
    </Navbar>
  );
};

export default DoctorNavbar;
