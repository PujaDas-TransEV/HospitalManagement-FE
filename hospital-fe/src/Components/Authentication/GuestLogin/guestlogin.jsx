import React, { useState } from 'react';
import axios from 'axios';
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
  const [labReports, setLabReports] = useState([]);
  const [token, setToken] = useState(null);

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
        setToken(authToken);

        setMessage('OTP verified. Fetching lab reports...');

        const labDataResponse = await axios.post(
          'http://localhost:5000/guestlogin/allguestaccesslabdata',
          { patientid: patientId },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`
            }
          }
        );

        if (labDataResponse.data?.data?.length > 0) {
          setLabReports(labDataResponse.data.data);
          setMessage('Lab reports fetched successfully.');
        } else {
          setMessage('No accessible lab reports found.');
        }
      } else {
        setMessage('Invalid OTP or session data missing.');
      }
    } catch (error) {
      setMessage('Error verifying OTP or fetching lab reports.');
      console.error(error);
    }
  };

  return (
    <div className="guest-login-wrapper">
      <h2>Guest Login</h2>

      {step === 1 && (
        <div className="guest-form">
          <input type="email" name="hospital_email" placeholder="Hospital Email" value={formData.hospital_email} onChange={handleChange} />
          <input type="text" name="hospital_mobile" placeholder="Hospital Mobile" value={formData.hospital_mobile} onChange={handleChange} />
          <input type="email" name="patient_email" placeholder="Patient Email" value={formData.patient_email} onChange={handleChange} />
          <input type="text" name="patient_mobile" placeholder="Patient Mobile" value={formData.patient_mobile} onChange={handleChange} />
          <button onClick={sendOTP}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div className="guest-form">
          <input type="text" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} />
          <button onClick={verifyOTPAndFetchData}>Verify OTP & Fetch Reports</button>
        </div>
      )}

      {message && <p className="guest-message">{message}</p>}

      {labReports.length > 0 && (
        <div className="lab-reports-section">
          <h3>Accessible Lab Reports</h3>
          {labReports.map((report, idx) => (
            <div key={idx} className="lab-report-card">
              <p><strong>Patient:</strong> {report.patientname}</p>
              <p><strong>Age:</strong> {report.patientage}</p>
              <p><strong>Symptoms:</strong> {report.patientsymptoms}</p>
              <p><strong>Test Type:</strong> {report.typeoftest}</p>
              <p><strong>Doctor:</strong> {report.doctorreferal}</p>
              <p><strong>Final Report:</strong> {report.finalreport}</p>
              <p><strong>Created At:</strong> {new Date(report.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestLogin;
