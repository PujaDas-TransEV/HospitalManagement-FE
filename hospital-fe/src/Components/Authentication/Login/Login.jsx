
import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link component
import './Login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Handle login form submission
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Updated header text */}
        <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>Welcome Back! Please log in to your account</h1>


        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Email</label>
            <input
              type="text"
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
  <button type="submit" className="login-button" style={{ marginRight: '10px' }}>Login</button> {/* Added margin to the right of Login button */}
  <Link to="/signup">
    <button type="button" className="signup-button">Sign Up</button>
  </Link>
</div>

        </form>

        {/* Forgot Password link */}
        <div className="forgot-password">
          <Link to="/password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


