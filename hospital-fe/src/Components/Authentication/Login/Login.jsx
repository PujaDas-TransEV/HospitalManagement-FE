
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';  // fixed import
import './Login.css';

const LoginPage = () => {
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
          navigate('/patient-dashboard', { replace: true });
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('patientId');
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('patientId');
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
      const response = await fetch('http://192.168.0.106:5000/patients/login', {
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
      const patientId = decodedToken.userid || decodedToken.patientId || decodedToken.id;

      if (patientId) {
        localStorage.setItem('patientId', patientId);
      }

      navigate('/patient-dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-card" style={{ backgroundColor: '#4682b4'}}>
          <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>
            Welcome Back! Please log in to your account
          </h1>

          <form onSubmit={handleLogin}  style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
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
              <button type="submit" className="login-buttonn" style={{ marginRight: '10px' }}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <Link to="/signup">
                <button type="button" className="signup-buttonn">Sign Up</button>
              </Link>
            </div>
          </form>

       <div className="forgot-password">
         <Link to="/password" style={{ color: '#ff0000', textDecoration: 'none' }}>
  Forgot Password?
</Link>

          </div>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
