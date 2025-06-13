
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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

  // Fetch departments on mount
  useEffect(() => {
    fetch('http://192.168.0.106:5000/facilityops/getallfacility')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setDepartments(data.data);
        }
      })
      .catch(err => console.error('Error fetching departments:', err));
  }, []);

  // Password validation and match check
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

    const formData = new FormData();
    formData.append('fullname', fullName);
    formData.append('gender', gender);
    formData.append('address', address);
    formData.append('dob', dob);
    formData.append('specialization', specialization.toLowerCase()); // lowercase
    formData.append('qualification', qualification);
    formData.append('yoe', yoe);
    formData.append('license_number', licenseNumber);
    formData.append('email', email);
    formData.append('phonenumber', phoneNumber);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    if (profilePicture) formData.append('profilepicture', profilePicture);

    fetch('http://192.168.0.106:5000/doctor/signup', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'OTP sent to your email! Please verify.') {
          setIsOtpSent(true);
        } else {
          alert(data.error || 'Error sending OTP');
        }
      })
      .catch(err => console.error('Signup error:', err));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchDisplay('block');
      return;
    }

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

    fetch('http://192.168.0.106:5000/doctor/signup', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Signup successful!') {
          alert('Signup successful!');
          setIsSignupComplete(true);
          navigate('/manage-doctors');
        } else {
          alert('OTP verification failed! Please try again.');
        }
      })
      .catch(err => console.error('OTP verification error:', err));
  };

  return (
    <div className="loginn-page" style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <div className="signup-form">
        <h2>Create Doctor Account</h2>
        <form onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit}>
          {/* Full Name */}
          <label>Full Name</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />

          {/* Gender */}
          <label>Gender</label>
          <select value={gender} onChange={e => setGender(e.target.value)} required>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Address */}
          <label>Address</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} required />

          {/* DOB */}
          <label>Date of Birth</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} required />

          {/* Specialization (Dropdown) */}
          <label>Specialization</label>
          <select value={specialization} onChange={e => setSpecialization(e.target.value)} required>
            <option value="">Select specialization</option>
            {departments.map((dept) => (
              <option key={dept.department_name} value={dept.department_name}>
                {dept.department_name}
              </option>
            ))}
          </select>

          {/* Qualification */}
          <label>Qualification</label>
          <input type="text" value={qualification} onChange={e => setQualification(e.target.value)} required />

          {/* Years of Experience */}
          <label>Years of Experience</label>
          <input type="number" value={yoe} onChange={e => setYoe(e.target.value)} required min="0" />

          {/* License Number */}
          <label>License Number</label>
          <input type="text" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} required />

          {/* Email */}
          <label>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

          {/* Phone Number */}
          <label>Phone Number</label>
          <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />

          {/* Password */}
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="At least 6 characters"
          />
          <div style={{ color: 'red' }}>{passwordValidationMessage}</div>

          {/* Confirm Password */}
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <div style={{ color: 'red', display: passwordMatchDisplay }}>
            Passwords do not match
          </div>

          {/* OTP input (shown only if OTP sent and signup not complete) */}
          {isOtpSent && !isSignupComplete && (
            <>
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
            </>
          )}

          {/* Profile Picture */}
          <label>Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleProfilePictureChange} />

          <button type="submit" style={{ marginTop: '1rem' }}>
            {isOtpSent ? 'Verify OTP' : 'Sign Up'}
          </button>

          <p style={{ marginTop: '1rem' }}>
            Already have an account? <NavLink to="/doctor-login">Login</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default DoctorSignupPage;
