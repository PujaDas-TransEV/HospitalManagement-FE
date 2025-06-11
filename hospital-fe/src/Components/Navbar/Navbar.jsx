
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [profilePic, setProfilePic] = useState('/images/default-profile.jpg');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'patient' or 'doctor'
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userid || decoded.doctorid; // assume either field
        const type = decoded.userType || decoded.role; // 'patient' or 'doctor'
        setIsLoggedIn(true);
        setUserType(type);

        const fetchProfile = async () => {
          let url = '';
          let formData = new FormData();
          formData.append(type === 'doctor' ? 'doctorid' : 'patientid', userId);
          if (type === 'patient') {
            url = 'http://192.168.0.106:5000/patients/profile/getbyid';
          } else if (type === 'doctor') {
            url = 'http://192.168.0.106:5000/doctors/profile/getbyid';
          }

          const response = await fetch(url, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          const data = await response.json();
          if (response.ok && data.data?.profilepicture) {
            setProfilePic(`data:image/jpeg;base64,${data.data.profilepicture}`);
          } else {
            setProfilePic('/images/default-profile.jpg');
          }
        };

        fetchProfile();
      } catch (error) {
        console.error('Token decode or profile fetch error:', error);
        setIsLoggedIn(false);
        setProfilePic('/images/default-profile.jpg');
      }
    }
  }, []);

  const goToProfile = () => {
    if (userType === 'doctor') {
      navigate('/doctor/dashboard');
    } else {
      navigate('/profile');
    }
  };

  const handleLoginClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handlePatientLogin = () => {
    navigate('/login');
    setShowDropdown(false);
  };

  const handleDoctorLogin = () => {
    navigate('/doctor-login');
    setShowDropdown(false);
  };

  return (
    <nav className={isActive ? 'active' : ''}>
      <div className="logo">
        <h1>LifeCare</h1>
      </div>
      <i id="bar" className="fa-solid fa-bars" onClick={handleToggle}></i>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/medical">Medical Care</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
      </ul>

      {isLoggedIn ? (
        <img
          src={profilePic}
          alt="Profile"
          className="profile-pic"
          onClick={goToProfile}
          title="Go to Profile"
        />
      ) : (
        <div className="login-dropdown">
          <button className="login-btn" onClick={handleLoginClick}>Login</button>
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handlePatientLogin}>Patient Login</button>
              <button onClick={handleDoctorLogin}>Doctor Login</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
