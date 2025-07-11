import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorForgetPassword.css'; 

function DoctorForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  
  const handleEmailSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('email', email);

   
    fetch('http://192.168.0.106:5000/doctorpasswordreset', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data) {
          setMessage('OTP has been sent to your email. Please check your inbox.');
          setIsOtpSent(true); 
        } else {
          setMessage('Error sending OTP. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error during email submission:', error);
        setMessage('An error occurred while sending OTP. Please try again.');
      });
  };


  const handlePasswordReset = (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', otp);
    formData.append('newpassword', newPassword);

  
    fetch('http://192.168.0.106:5000/doctorpasswordreset', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          alert('Password reset successful!');
          navigate('/doctor-login'); 
        } else {
          alert('Error resetting password. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error during password reset:');
        alert('An error occurred during password reset. Please try again.');
      });
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1 style={{ fontSize: '24px', color: '#800000' }}>Doctor Forgot Password</h1>

      
        {!isOtpSent && (
          <form onSubmit={handleEmailSubmit} style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
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
        )}

       
        {isOtpSent && (
          <form onSubmit={handlePasswordReset}>
            <div className="input-group">
              <label htmlFor="otp">Enter OTP:</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                required
              />
            </div>

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
              <label htmlFor="confirm-password">Confirm New Password:</label>
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
        )}

   
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default DoctorForgotPasswordPage;
