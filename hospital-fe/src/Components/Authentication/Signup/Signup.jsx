
import React, { useState, useEffect } from 'react';
import './Signup.css';
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
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSignupComplete, setIsSignupComplete] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchDisplay('block');
      return;
    }

    const formData = new FormData();
    formData.append('name', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);

    fetch('http://192.168.0.106:5000/patients/signup', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'OTP sent to your email! Please verify.') {
          setIsOtpSent(true);
        } else {
          console.error(data.errors || data.error);
        }
      })
      .catch(error => {
        console.error('Error during signup:', error);
      });
  };

  const handleVerifyOtp = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatchDisplay('block');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm_password', confirmPassword);
    formData.append('otp', otp);

    fetch('http://192.168.0.106:5000/patients/signup', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Signup successful!') {
          alert('Signup Successful!');
          setIsSignupComplete(true);
          navigate('/login');
        } else {
          alert('OTP verification failed! Please try again.');
        }
      })
      .catch(error => {
        console.error('Error during OTP verification:', error);
      });
  };

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

  return (
    <div id="signUpBody">
      <div className="greenLayer"></div> {/* Optional overlay */}
    <div className="signup-form" style={{ backgroundColor: '#d0f0fd' }}>

        <h2>Create An Account</h2>
        <form id="signUpform" name="signUpform" onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit} style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
          {/* Full Name (optional) */}
          {/* <div className="form-floating mt-3 col-12 mx-2">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Full name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="form-control"
              required
            />
          </div> */}

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

          <div className="mx-2 text-danger" style={{ display: passwordMatchDisplay }}>
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

          {/* <div className="text-center mt-3">
            <button id="signUp" type="submit">
              {isOtpSent ? 'Verify OTP' : 'Sign Up'}
            </button>
          </div> */}
          <div className="text-center mt-3">
  <button
    id="signUp"
    type="submit"
    style={{
      backgroundColor: '#30cfcf',
      width: '200px',       // Adjust width as needed
      color: 'black',       // Optional: better contrast on light bg
      border: 'none',
      borderRadius: '5px',
      padding: '12px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }}
  >
    {isOtpSent ? 'Verify OTP' : 'Sign Up'}
  </button>
</div>


          <div className="text-center mt-2">
            Already have an account? <NavLink to="/login">Sign In</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
