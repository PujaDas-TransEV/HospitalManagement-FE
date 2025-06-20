import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './DoctorLogin.css';

const DoctorLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          // Valid token exists — redirect to dashboard
          navigate('/doctordashboard', { replace: true });
        } else {
          // Token expired — clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('doctorId');
        }
      } catch (err) {
        // Invalid token — clear it
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

      // ✅ Redirect after successful login
      navigate('/doctordashboard');
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

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="login-button" style={{ marginRight: '10px' }} disabled={loading}>
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </div>
        </form>

        <div className="forgot-password">
          <Link to="/doctor-password">Forgot Password?</Link>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default DoctorLoginPage;
