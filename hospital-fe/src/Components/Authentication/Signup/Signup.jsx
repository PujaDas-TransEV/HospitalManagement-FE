import React, { useState } from 'react';
import './Signup.css';
import { NavLink, useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    address: '',
    age: '',
    phonenumber: '',
    email: '',
    password: '',
    confirm_password: '',
    otp: '',
  });

  const [passwordMatchDisplay, setPasswordMatchDisplay] = useState('none');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'password' || e.target.name === 'confirm_password') {
      // Hide password mismatch message on input change
      setPasswordMatchDisplay('none');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setPasswordMatchDisplay('block');
      return;
    }

    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'otp') payload.append(key, value);
    });

    fetch('http://192.168.0.106:5000/patients/signup', {
      method: 'POST',
      body: payload,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.message === 'OTP sent to your email! Please verify.') {
          setIsOtpSent(true);
        } else {
          alert(data.error || 'Signup failed');
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('Signup error:', err);
      });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setPasswordMatchDisplay('block');
      return;
    }

    setLoading(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    fetch('http://192.168.0.106:5000/patients/signup', {
      method: 'POST',
      body: payload,
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.message === 'Signup successful!') {
          alert('Signup Successful!');
          setIsSignupComplete(true);
          navigate('/login');
        } else {
          alert(data.error || 'OTP verification failed');
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('OTP verification error:', err);
      });
  };

  return (
    <div id="signUpBody">
      <div className="greenLayer"></div>
      <div
        className="signup-form"
        style={{
          backgroundColor: '#d0f0fd',
          maxWidth: '900px',
          width: '95%',
          padding: '40px',
          borderRadius: '10px',
        }}
      >
        <h2>Create An Account</h2>
        <form
          id="signUpform"
          onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit}
          style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}
        >
          <div className="form-row">
            <div className="form-floating col">
              <label>
                First Name <span className="required-star">*</span>
              </label>
              <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} required />
            </div>
            <div className="form-floating col">
              <label>
                Last Name <span className="required-star">*</span>
              </label>
              <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-floating col">
              <label>
                Gender <span className="required-star">*</span>
              </label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-floating col">
              <label>
                Address <span className="required-star">*</span>
              </label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-floating col">
              <label>
                Age <span className="required-star">*</span>
              </label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="form-floating col">
              <label>
                Phone Number <span className="required-star">*</span>
              </label>
              <input type="text" name="phonenumber" value={formData.phonenumber} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-floating col">
              <label>
                Email <span className="required-star">*</span>
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-floating col">
              <label>
                Password <span className="required-star">*</span>
              </label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-floating col">
              <label>
                Confirm Password <span className="required-star">*</span>
              </label>
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mx-2 text-danger" style={{ display: passwordMatchDisplay }}>
            Passwords do not match
          </div>

          {isOtpSent && !isSignupComplete && (
            <div className="form-floating mt-3 col-12 mx-2">
              <label>
                Enter OTP <span className="required-star">*</span>
              </label>
              <input type="text" name="otp" value={formData.otp} onChange={handleChange} required />
            </div>
          )}

          <button
            id="signUp"
            type="submit"
            style={{
              padding: '10px 20px',
              color: 'white',
              backgroundColor: '#048c7f',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '180px',
              margin: '0 auto',
              display: 'block',
              position: 'relative',
            }}
            disabled={loading}
          >
            {loading ? (
              <div
                style={{
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto',
                }}
              />
            ) : isOtpSent ? (
              'Verify OTP'
            ) : (
              'Sign Up'
            )}
          </button>

          <div
            className="text-center mt-2"
            style={{ textAlign: 'center', marginTop: '15px' }}
          >
            Already have an account?{' '}
            <NavLink
              to="/login"
              style={{
                color: '#045d58',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Sign In
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
