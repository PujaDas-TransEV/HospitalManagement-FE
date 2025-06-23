
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';  // import useNavigate
// import './guestlogin.css';

// const GuestLogin = () => {
//   const [formData, setFormData] = useState({
//     hospital_email: '',
//     hospital_mobile: '',
//     patient_email: '',
//     patient_mobile: '',
//     otp: ''
//   });

//   const [step, setStep] = useState(1);
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();  // initialize navigate

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const sendOTP = async () => {
//     try {
//       const response = await axios.post('http://192.168.0.106:5000/guest/login', {
//         hospital_email: formData.hospital_email,
//         hospital_mobile: formData.hospital_mobile,
//         patient_email: formData.patient_email,
//         patient_mobile: formData.patient_mobile
//       }, {
//         headers: { 'Content-Type': 'application/json' }
//       });

//       if (response.status === 200) {
//         setMessage('OTP sent successfully. Check your email or phone.');
//         setStep(2);
//       } else {
//         setMessage('Failed to send OTP. Please check your details.');
//       }
//     } catch (error) {
//       setMessage('Error sending OTP. Please check your input.');
//       console.error(error);
//     }
//   };

//   const verifyOTPAndFetchData = async () => {
//     try {
//       const otpResponse = await axios.post('http://192.168.0.106:5000/guest/login', {
//         hospital_email: formData.hospital_email,
//         hospital_mobile: formData.hospital_mobile,
//         patient_email: formData.patient_email,
//         patient_mobile: formData.patient_mobile,
//         otp: formData.otp
//       }, {
//         headers: { 'Content-Type': 'application/json' }
//       });

//       if (otpResponse.status === 200 && otpResponse.data?.session?.patient_uid) {
//         const patientId = otpResponse.data.session.patient_uid;
//         const authToken = otpResponse.data.token;

//         // Store token & patientId in localStorage for dashboard use
//         localStorage.setItem('guestToken', authToken);
//         localStorage.setItem('guestPatientId', patientId);

//         setMessage('OTP verified! Redirecting to your dashboard...');
        
//         // Redirect to guest dashboard
//         navigate('/guest-dashboard');
//       } else {
//         setMessage('Invalid OTP or session data missing.');
//       }
//     } catch (error) {
//       setMessage('Error verifying OTP.');
//       console.error(error);
//     }
//   };

//   return (
//     <div className="guest-login-wrapper">
//       <h2>Guest Login</h2>

//       {step === 1 && (
//         <div className="guest-form">
//           <input
//             type="email"
//             name="hospital_email"
//             placeholder="Hospital Email"
//             value={formData.hospital_email}
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="hospital_mobile"
//             placeholder="Hospital Mobile"
//             value={formData.hospital_mobile}
//             onChange={handleChange}
//           />
//           <input
//             type="email"
//             name="patient_email"
//             placeholder="Patient Email"
//             value={formData.patient_email}
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             name="patient_mobile"
//             placeholder="Patient Mobile"
//             value={formData.patient_mobile}
//             onChange={handleChange}
//           />
//           <button onClick={sendOTP}>Send OTP</button>
//         </div>
//       )}

//       {step === 2 && (
//         <div className="guest-form">
//           <input
//             type="text"
//             name="otp"
//             placeholder="Enter OTP"
//             value={formData.otp}
//             onChange={handleChange}
//           />
//           <button onClick={verifyOTPAndFetchData}>Verify OTP & Go to Dashboard</button>
//         </div>
//       )}

//       {message && <p className="guest-message">{message}</p>}
//     </div>
//   );
// };

// export default GuestLogin;
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './guestlogin.css';

const Spinner = () => (
  <svg
    className="spinner"
    width="20px"
    height="20px"
    viewBox="0 0 50 50"
  >
    <circle
      className="path"
      cx="25"
      cy="25"
      r="20"
      fill="none"
      strokeWidth="5"
    />
  </svg>
);

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
      const res = await axios.post('http://192.168.0.106:5000/guest/login', {
        ...formData,
      });
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
      <div className="guest-card"   style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
        <h2>Guest Login</h2>

        <div className="guest-form">
          {step === 1 && (
            <>
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
              <button
                className="guest-btn"
                onClick={sendOTP}
                disabled={loading}
              >
                {loading ? <Spinner /> : 'Send OTP'}
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
              />
              <button
                className="guest-btn"
                onClick={verifyOTPAndFetchData}
                disabled={loading}
              >
                {loading ? <Spinner /> : 'Verify OTP'}
              </button>
            </>
          )}
        </div>

        {message && <p className="guest-message">{message}</p>}
      </div>
    </div>
  );
};

export default GuestLogin;
