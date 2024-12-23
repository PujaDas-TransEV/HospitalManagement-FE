
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
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
      <Link to="/login">
        <button className="login-btn">Login</button>
      </Link>
    </nav>
  );
};

export default Navbar;
