import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate hook
import './AdminLogin.css';  // You can reuse the same CSS file for styling

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Initialize the useNavigate hook

  // Handle form submission for admin login
  const handleSubmit = (event) => {
    event.preventDefault();

    // Prepare the form data to be sent as multipart/form-data
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // Send a POST request to the admin login endpoint
    fetch('http://localhost:5000/admins/login', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Check if login is successful
        if (data.message === 'Login successful!') {
          alert('Login successful!');
          navigate('/admin-dashboard');  // Redirect to admin dashboard after successful login
        } else {
          alert('Login failed! Please check your credentials.');
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again.');
      });
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>Admin Login</h1>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email id"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {/* Buttons placed side by side */}
          <div className="button-group">
            <button type="submit" className="login-button" style={{ marginRight: '10px' }}>
              Login
            </button>
            <Link to="/admin/signup">
              <button type="button" className="signup-button">
                Sign Up
              </button>
            </Link>
          </div>
        </form>

        {/* Forgot Password link */}
        <div className="forgot-password">
          <Link to="/admin/password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
