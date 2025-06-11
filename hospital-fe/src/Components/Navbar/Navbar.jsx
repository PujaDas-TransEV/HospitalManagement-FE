
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // fix import - no curly braces
import './Navbar.css';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [profilePic, setProfilePic] = useState('/images/default-profile.jpg'); // default profile image initially
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userid;

        const fetchProfile = async () => {
          const formData = new FormData();
          formData.append('patientid', userId);

          const response = await fetch('http://192.168.0.105:5000/patients/profile/getbyid', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const data = await response.json();

          if (response.ok && data.data?.profilepicture) {
            setProfilePic(`data:image/jpeg;base64,${data.data.profilepicture}`);
          } else {
            setProfilePic('/images/default-profile.jpg'); // fallback default
          }
        };

        fetchProfile();
      } catch (error) {
        console.error('Token decode error:', error);
        setIsLoggedIn(false);
        setProfilePic('/images/default-profile.jpg'); // still show default on error
      }
    } else {
      setIsLoggedIn(false);
      setProfilePic(null); // no profile pic since not logged in
    }
  }, []);

  const goToProfile = () => {
    navigate('/profile');
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
          src={profilePic || '/images/default-profile.jpg'}
          alt="Profile"
          className="profile-pic"
          onClick={goToProfile}
          title="Go to Profile"
        />
      ) : (
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
