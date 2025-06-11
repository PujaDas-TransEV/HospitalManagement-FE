import React, { useState, useEffect } from 'react';
import './SuperAdminSignup.css';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordMatchDisplay, setPasswordMatchDisplay] = useState('none');
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); // Flag to check if OTP is sent
  const [isSignupComplete, setIsSignupComplete] = useState(false); // Flag to check if signup is complete

  // Handle form submission for super admin signup (send OTP)
  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate if password and confirm password match
    if (password !== confirmPassword) {
      setPasswordMatchDisplay('block');
      return;
    }

    const formData = new FormData();
    formData.append('name', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);

    // Send the form data to the backend to send OTP for super admin signup
    fetch('http://192.168.0.106:5000/superadmin/signup', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        // Ensure backend responds with OTP sent confirmation
        if (data.message === 'OTP sent to your email! Please verify.') {
          setIsOtpSent(true); // OTP sent successfully, show OTP field
        } else {
          console.error(data.errors || data.error);
        }
      })
      .catch(error => {
        console.error('Error during super admin signup:', error);
      });
  };

  // Handle OTP verification after super admin signup (when OTP is entered)
  const handleVerifyOtp = (event) => {
    event.preventDefault();

    // Validate if password and confirm password match again before sending data
    if (password !== confirmPassword) {
      setPasswordMatchDisplay('block');
      return;
    }

    const formData = new FormData();
    formData.append('name', fullName); // Add name to formData
    formData.append('email', email); // Reuse email from state
    formData.append('password', password); // Reuse password from state
    formData.append('confirm_password', confirmPassword); // Reuse confirm password from state
    formData.append('otp', otp); // OTP entered by the user

    // Send the OTP for verification along with the other details (name, email, password, confirm_password) to the backend
    fetch('http://192.168.0.106:5000/superadmin/signup', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Signup successful!') {
          alert('Signup Successful!');
          setIsSignupComplete(true);
          navigate('/login'); // Navigate to homepage or login page after successful signup
        } else {
          alert('OTP verification failed! Please try again.');
        }
      })
      .catch(error => {
        console.error('Error during OTP verification for super admin:', error);
      });
  };

  // Effect to handle password validation and matching
  useEffect(() => {
    if (password.length > 0 && password?.trim()?.length <= 6) {
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

  return (
    <div id="SuperadminsignUpBody">
      <div id="SuperadminsignUpBG">
        <div className="greenLayer"></div>
      </div>
      <div className="signup-form">
        <h2>Create An Account</h2>
        <form id="signUpform" name="signUpform" onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit}>
          <div className="d-flex flex-row mt-5">
            <div className="col-6 form-floating mx-2">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                placeholder="Full name"
                value={fullName}
                required
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>
          </div>
          <div className="form-floating mt-3 col-12 mx-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="form-floating mt-3 col-12 mx-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-control"
              required
              placeholder="password"
            />
          </div>
          <div className="mx-2 text-danger">{passwordValidationMessage}</div>
          <div className="form-floating mt-3 col-12 mx-2">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="form-control"
              required
              placeholder="confirm password"
            />
          </div>
          <div className="mx-2 text-danger" style={{ display: `${passwordMatchDisplay}` }}>
            Passwords do not match
          </div>

          {isOtpSent && !isSignupComplete && (
            <div className="form-floating mt-3 col-12 mx-2">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                className="form-control"
                required
                placeholder="Enter OTP"
              />
            </div>
          )}

          <div className="text-center">
            <button id="signUp" type="submit">
              {isOtpSent ? 'Verify OTP' : 'Sign Up'}
            </button>
          </div>
          <div className="text-center">
            Already have an account? <NavLink to="/super/admin/login">Sign In</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
