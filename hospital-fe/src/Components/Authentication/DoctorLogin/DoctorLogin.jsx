
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';  
import './DoctorLogin.css';

const DoctorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          navigate('/doctordashboard', { replace: true });
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('doctorId');
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('doctorId');
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://192.168.0.106:5000/doctors/login', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      const accessToken = data.token;
      localStorage.setItem('accessToken', accessToken);
      const decodedToken = jwtDecode(accessToken);
      const doctorId = decodedToken.userid || decodedToken.doctorId || decodedToken.id;
      if (doctorId) {
        localStorage.setItem('doctorId', doctorId);
      }

      navigate('/doctordashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-doctor">
      <div className="login-card" style={{ backgroundColor: '#ccf2f4' }}>
        <h1 style={{ fontSize: '24px', color: '#4169e1' }}>
          Doctor Login - Welcome Back!
        </h1>

        <form
          onSubmit={handleLogin}
          style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}
        >
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="login-buttonn" disabled={loading}  style={{
      width: '120px',
      padding: '8px 0',
      fontSize: '14px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: 'white',
      background: 'linear-gradient(to right, #0a3b84, #2568a8)',
      marginRight: '10px'
    }}>
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="forgot-password">
          <Link to="/doctor-password" style={{ color: '#4169e1', textDecoration: 'none' }}>
            Forgot Password?
          </Link>
        </div>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
};

export default DoctorLoginPage;
