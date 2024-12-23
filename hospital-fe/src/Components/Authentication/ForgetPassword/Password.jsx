import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigating to the login page after password reset
import './Password.css'; // Import the CSS file

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpValid, setIsOtpValid] = useState(false);
  const navigate = useNavigate();

  // Handle email submission (Send OTP)
  const handleEmailSubmit = (event) => {
    event.preventDefault();
    // Here you can call an API to verify the email if required
    console.log(`OTP sent to email: ${email}`);
    setShowOTP(true);  // Show OTP input popup after email submission
  };

  // Handle OTP submission
  const handleOtpSubmit = (event) => {
    event.preventDefault();

    // Simulating OTP validation
    if (otp === '123456') {  // You can replace this with actual OTP validation logic
      setIsOtpValid(true);
      alert('OTP is valid. You can now reset your password.');
    } else {
      alert('Invalid OTP');
    }
  };

  // Handle password reset form submission
  const handlePasswordReset = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Here you can call your API to update the password in the backend
    alert("Password reset successfully!");
    navigate('/login');  // Redirect to login page after password reset
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        {/* Forgot Password Form */}
        {!showOTP && !isOtpValid && (
          <>
            <h1 style={{ fontSize: '24px', color: '#800000' }}>Forgot Password</h1><br></br>
            <form onSubmit={handleEmailSubmit}>
              <div className="input-group">
                <label htmlFor="email">Enter Your Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" className="submit-button">Send OTP</button>
            </form>
          </>
        )}

        {/* OTP Verification Form */}
        {showOTP && !isOtpValid && (
          <>
            <h2 style={{ fontSize: '20px', color: '#800000' }}>Enter OTP Sent to {email}</h2>
            <form onSubmit={handleOtpSubmit}>
              <div className="input-group">
                <label htmlFor="otp">OTP:</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
              </div>
              <button type="submit" className="submit-button">Submit OTP</button>
            </form>
          </>
        )}

        {/* Reset Password Form */}
        {isOtpValid && (
          <>
            <h2>Reset Your Password</h2>
            <form onSubmit={handlePasswordReset}>
              <div className="input-group">
                <label htmlFor="new-password">New Password:</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirm-password">Confirm Password:</label>
                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button type="submit" className="submit-button">Reset Password</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
