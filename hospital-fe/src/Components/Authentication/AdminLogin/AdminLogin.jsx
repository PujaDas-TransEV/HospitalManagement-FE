import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AdminLogin.css';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Check token on component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          // Token valid - redirect to dashboard
          navigate('/ad-dashboard', { replace: true });
        } else {
          // Token expired
          localStorage.removeItem('accessToken');
          localStorage.removeItem('adminEmail');
        }
      } catch (err) {
        // Invalid token
        localStorage.removeItem('accessToken');
        localStorage.removeItem('adminEmail');
      }
    }
  }, [navigate]);

  // ✅ Handle admin login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://192.168.0.106:5000/admins/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Save token
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('adminEmail', email);

      // Navigate to dashboard
      navigate('/ad-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>Admin Login</h1>

        <form onSubmit={handleSubmit}>
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
            <button type="submit" className="login-button" style={{ marginRight: '10px' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <Link to="/admin/signup">
              <button type="button" className="signup-button">Sign Up</button>
            </Link>
          </div>
        </form>

        <div className="forgot-password">
          <Link to="/admin/password">Forgot Password?</Link>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

export default AdminLoginPage;
