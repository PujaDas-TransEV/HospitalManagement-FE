import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwt-decode with the correct case
import './DoctorLogin.css';

const DoctorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://192.168.0.105:5000/doctors/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store the access token in localStorage
      const accessToken = data.token;
      localStorage.setItem('accessToken', accessToken);

      // Decode the JWT token and get the doctorId (optional if needed)
      const decodedToken = jwtDecode(accessToken);  // Decode JWT token
      const doctorId = decodedToken.userid;  // Assuming 'userid' is the field in the JWT payload

      // Store the doctorId in localStorage for later use
      localStorage.setItem('doctorId', doctorId);

      // Redirect to the doctor dashboard
      navigate('/doctordashboard');  // Navigate to the doctor dashboard after successful login

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-doctor">
      <div className="login-card">
        <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>
          Doctor Login - Welcome Back!
        </h1>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
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
            <button type="submit" className="login-button" style={{ marginRight: '10px' }} disabled={loading}>
              {loading ? 'Logging In...' : 'Login'}
            </button>
            <Link to="/doctor/signup">
              <button type="button" className="signup-button">
                Sign Up
              </button>
            </Link>
          </div>
        </form>

        {/* Forgot Password link */}
        <div className="forgot-password">
          <Link to="/doctor-password">Forgot Password?</Link>
        </div>

        {/* Display error message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default DoctorLoginPage;
