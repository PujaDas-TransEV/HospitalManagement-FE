
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './guestlogin.css';
import { FaSpinner } from 'react-icons/fa';

const GuestLogin = () => {
  const [formData, setFormData] = useState({
    hospital_email: '',
    hospital_mobile: '',
    patient_email: '',
    patient_mobile: '',
    otp: '',
  });

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://192.168.0.106:5000/guest/login', {
        hospital_email: formData.hospital_email,
        hospital_mobile: formData.hospital_mobile,
        patient_email: formData.patient_email,
        patient_mobile: formData.patient_mobile,
      });

      if (res.status === 200) {
        setMessage('OTP sent successfully.');
        setStep(2);
      } else {
        setMessage('Failed to send OTP.');
      }
    } catch (err) {
      setMessage('Error sending OTP.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndFetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://192.168.0.106:5000/guest/login', formData);

      if (res.status === 200 && res.data.session?.patient_uid) {
        localStorage.setItem('guestToken', res.data.token);
        localStorage.setItem('guestPatientId', res.data.session.patient_uid);
        setMessage('OTP verified! Redirecting...');
        navigate('/guest-dashboard');
      } else {
        setMessage('Invalid OTP.');
      }
    } catch (err) {
      setMessage('Error verifying OTP.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-wrapper">
      <div
        className="guest-card"
        style={{
          backgroundColor: '#e0f7fa',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <h2>Guest Login</h2>

        <div className="guest-form">
          {step === 1 && (
            <>
              <input
                type="email"
                name="hospital_email"
                placeholder="Hospital Email Or Doctor Email"
                value={formData.hospital_email}
                onChange={handleChange}
              />
              <input
                type="text"
                name="hospital_mobile"
                placeholder="Hospital Mobile or Doctor Mobile"
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

              <button
                onClick={sendOTP}
                disabled={loading}
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '150px',
                  height: '40px',
                  marginLeft:'90px'
                }}
              >
                {loading ? (
                  <div style={{ animation: 'spin 1s linear infinite' }}>
                    <FaSpinner />
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                style={{
                  padding: '8px',
                  marginBottom: '10px',
                  width: '200px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                }}
              />
              <button
                onClick={verifyOTPAndFetchData}
                disabled={loading}
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '150px',
                  height: '40px',
                }}
              >
                {loading ? (
                  <div style={{ animation: 'spin 1s linear infinite' }}>
                    <FaSpinner />
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </>
          )}
        </div>

        {message && (
          <p
            className="guest-message"
            style={{ marginTop: '15px', fontWeight: 'bold', color: '#333' }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default GuestLogin;
