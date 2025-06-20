
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // import useNavigate
import './guestlogin.css';

const GuestLogin = () => {
  const [formData, setFormData] = useState({
    hospital_email: '',
    hospital_mobile: '',
    patient_email: '',
    patient_mobile: '',
    otp: ''
  });

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();  // initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/guest/login', {
        hospital_email: formData.hospital_email,
        hospital_mobile: formData.hospital_mobile,
        patient_email: formData.patient_email,
        patient_mobile: formData.patient_mobile
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 200) {
        setMessage('OTP sent successfully. Check your email or phone.');
        setStep(2);
      } else {
        setMessage('Failed to send OTP. Please check your details.');
      }
    } catch (error) {
      setMessage('Error sending OTP. Please check your input.');
      console.error(error);
    }
  };

  const verifyOTPAndFetchData = async () => {
    try {
      const otpResponse = await axios.post('http://localhost:5000/guest/login', {
        hospital_email: formData.hospital_email,
        hospital_mobile: formData.hospital_mobile,
        patient_email: formData.patient_email,
        patient_mobile: formData.patient_mobile,
        otp: formData.otp
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (otpResponse.status === 200 && otpResponse.data?.session?.patient_uid) {
        const patientId = otpResponse.data.session.patient_uid;
        const authToken = otpResponse.data.token;

        // Store token & patientId in localStorage for dashboard use
        localStorage.setItem('guestToken', authToken);
        localStorage.setItem('guestPatientId', patientId);

        setMessage('OTP verified! Redirecting to your dashboard...');
        
        // Redirect to guest dashboard
        navigate('/guest-dashboard');
      } else {
        setMessage('Invalid OTP or session data missing.');
      }
    } catch (error) {
      setMessage('Error verifying OTP.');
      console.error(error);
    }
  };

  return (
    <div className="guest-login-wrapper">
      <h2>Guest Login</h2>

      {step === 1 && (
        <div className="guest-form">
          <input
            type="email"
            name="hospital_email"
            placeholder="Hospital Email"
            value={formData.hospital_email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="hospital_mobile"
            placeholder="Hospital Mobile"
            value={formData.hospital_mobile}
            onChange={handleChange}
          />
          <input
            type="email"
            name="patient_email"
            placeholder="Patient Email"
            value={formData.patient_email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="patient_mobile"
            placeholder="Patient Mobile"
            value={formData.patient_mobile}
            onChange={handleChange}
          />
          <button onClick={sendOTP}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div className="guest-form">
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
          />
          <button onClick={verifyOTPAndFetchData}>Verify OTP & Go to Dashboard</button>
        </div>
      )}

      {message && <p className="guest-message">{message}</p>}
    </div>
  );
};

export default GuestLogin;
