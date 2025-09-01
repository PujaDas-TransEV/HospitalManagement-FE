
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import './DoctorSignup.css';

function DoctorSignupPage() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [yoe, setYoe] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordMatchDisplay, setPasswordMatchDisplay] = useState('none');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    fetch('https://backend.medapp.transev.site/facilityops/getallfacility')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setDepartments(data.data);
        }
      })
      .catch(err => console.error('Error fetching departments:', err));
  }, []);


  useEffect(() => {
    if (password.length > 0 && password.trim().length <= 6) {
      setPasswordValidationMessage('Password length must be greater than 6 characters');
    } else {
      setPasswordValidationMessage('');
    }

    if (password === confirmPassword) {
      setPasswordMatchDisplay('none');
    } else {
      setPasswordMatchDisplay('block');
    }
  }, [password, confirmPassword]);

  const handleProfilePictureChange = (e) => {
    if (e.target.files[0]) setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMatchDisplay('block');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('fullname', fullName);
    formData.append('gender', gender);
    formData.append('address', address);
    formData.append('dob', dob);
    formData.append('specialization', specialization.toLowerCase());
    formData.append('qualification', qualification);
    formData.append('yoe', yoe);
    formData.append('license_number', licenseNumber);
    formData.append('email', email);
    formData.append('phonenumber', phoneNumber);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    if (profilePicture) formData.append('profilepicture', profilePicture);

    fetch('https://backend.medapp.transev.site/doctor/signup', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.message === 'OTP sent to your email! Please verify.') {
          setIsOtpSent(true);
          setSuccessMessage('OTP sent to your email! Please verify.');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          alert(data.error || 'Error sending OTP');
        }
      })
      .catch(err => {
        setLoading(false);
        console.error('Signup error:', err);
        alert('Signup failed. Please try again.');
      });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchDisplay('block');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('fullname', fullName);
    formData.append('gender', gender);
    formData.append('address', address);
    formData.append('dob', dob);
    formData.append('specialization', specialization.toLowerCase());
    formData.append('qualification', qualification);
    formData.append('yoe', yoe);
    formData.append('license_number', licenseNumber);
    formData.append('email', email);
    formData.append('phonenumber', phoneNumber);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('otp', otp);
    if (profilePicture) formData.append('profilepicture', profilePicture);

    fetch('https://backend.medapp.transev.site/doctor/signup', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.message === 'Signup successful!') {
          setSuccessMessage('Signup successful!');
          setIsSignupComplete(true);
          setTimeout(() => {
            setSuccessMessage('');
            navigate('/manage-doctors');
          }, 2500);
        } else {
          alert('OTP verification failed! Please try again.');
        }
      })
      .catch(err => {
        setLoading(false);
        console.error('OTP verification error:', err);
        alert('OTP verification failed. Please try again.');
      });
  };

  return (
    <div className="signup-page">
      <div className="overlay"></div>
      <div className="signup-form-container">
        <h2>Create Doctor Account</h2>
        {successMessage && (
          <div className="success-popup">{successMessage}</div>
        )}
        <form onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit} className="signup-forms"style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
        
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Specialization</label>
              <select value={specialization} onChange={e => setSpecialization(e.target.value)} required>
                <option value="">Select specialization</option>
                {departments.map((dept) => (
                  <option key={dept.department_name} value={dept.department_name}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Qualification</label>
              <input type="text" value={qualification} onChange={e => setQualification(e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Years of Experience</label>
              <input type="number" value={yoe} onChange={e => setYoe(e.target.value)} required min="0" />
            </div>
            <div className="form-group">
              <label>License Number</label>
              <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Work Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
              />
              <div className="validation-message">{passwordValidationMessage}</div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <div className="validation-message" style={{ display: passwordMatchDisplay }}>
                Passwords do not match
              </div>
            </div>
          </div>

        
          {isOtpSent && !isSignupComplete && (
            <div className="form-row">
              <div className="form-group" style={{ flex: '1 1 100%' }}>
                <label>Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

        
          <div className="form-row">
            <div className="form-group" style={{ flex: '1 1 100%' }}>
              <label>Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
            </div>
          </div>

         <button
  type="submit"
  disabled={loading}
  style={{
    marginTop: '1.5rem',
    backgroundColor: loading ? '#bbb' : '#887700',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: 700,
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.3s ease',
  }}
>
  {loading ? <FaSpinner style={{ animation: 'spin 1s linear infinite', fontSize: '1.3rem' }} /> : (isOtpSent ? 'Verify OTP' : 'Sign Up')}
</button>

<p style={{ marginTop: '1rem', color: '#008000' }}>
  Already have an account?{' '}
  <NavLink to="/doctor-login" style={{ color: '#add8e6' }}>
    Login
  </NavLink>
</p>

        </form>
      </div>
    </div>
  );
}

export default DoctorSignupPage;
