// import React, { useState, useEffect } from 'react';
// import './DoctorSignup.css'; // Make sure to add the corresponding CSS for styling
// import { NavLink } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

// function DoctorSignupPage() {
//   const navigate = useNavigate();

//   const [fullName, setFullName] = useState('');
//   const [gender, setGender] = useState('');
//   const [address, setAddress] = useState('');
//   const [dob, setDob] = useState('');
//   const [specialization, setSpecialization] = useState('');
//   const [qualification, setQualification] = useState('');
//   const [yoe, setYoe] = useState('');
//   const [licenseNumber, setLicenseNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [otp, setOtp] = useState('');
//   const [passwordMatchDisplay, setPasswordMatchDisplay] = useState('none');
//   const [passwordValidationMessage, setPasswordValidationMessage] = useState('');
//   const [isOtpSent, setIsOtpSent] = useState(false); // Flag to check if OTP is sent
//   const [isSignupComplete, setIsSignupComplete] = useState(false); // Flag to check if signup is complete
//   const [profilePicture, setProfilePicture] = useState(null); // State for the profile picture

//   // Handle form submission for doctor signup (send OTP)
//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // Validate if password and confirm password match
//     if (password !== confirmPassword) {
//       setPasswordMatchDisplay('block');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('fullname', fullName);
//     formData.append('gender', gender);
//     formData.append('address', address);
//     formData.append('dob', dob);
//     formData.append('specialization', specialization);
//     formData.append('qualification', qualification);
//     formData.append('yoe', yoe);
//     formData.append('license_number', licenseNumber);
//     formData.append('email', email);
//     formData.append('phonenumber', phoneNumber);
//     formData.append('password', password);
//     formData.append('confirm_password', confirmPassword);

//     // If a profile picture is selected, append it to the FormData
//     if (profilePicture) {
//       formData.append('profilepicture', profilePicture);
//     }

//     // Send the form data to the backend to send OTP
//     fetch('http://localhost:5000/doctor/signup', {
//       method: 'POST',
//       body: formData,
//     })
//       .then(response => response.json())
//       .then(data => {
//         // Ensure backend responds with OTP sent confirmation
//         if (data.message === 'OTP sent to your email! Please verify.') {
//           setIsOtpSent(true); // OTP sent successfully, show OTP field
//         } else {
//           console.error(data.errors || data.error);
//         }
//       })
//       .catch(error => {
//         console.error('Error during signup:', error);
//       });
//   };

//   // Handle OTP verification after signup (when OTP is entered)
//   const handleVerifyOtp = (event) => {
//     event.preventDefault();

//     // Validate if password and confirm password match again before sending data
//     if (password !== confirmPassword) {
//       setPasswordMatchDisplay('block');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('fullname', fullName);
//     formData.append('gender', gender);
//     formData.append('address', address);
//     formData.append('dob', dob);
//     formData.append('specialization', specialization);
//     formData.append('qualification', qualification);
//     formData.append('yoe', yoe);
//     formData.append('license_number', licenseNumber);
//     formData.append('email', email);
//     formData.append('phonenumber', phoneNumber);
//     formData.append('password', password);
//     formData.append('confirm_password', confirmPassword);
//     formData.append('otp', otp);

//     // If a profile picture is selected, append it to the FormData
//     if (profilePicture) {
//       formData.append('profilepicture', profilePicture);
//     }

//     // Send the OTP for verification along with the other details (name, email, password, confirm_password) to the backend
//     fetch('http://localhost:5000/doctor/signup', {
//       method: 'POST',
//       body: formData,
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (data.message === 'Signup successful!') {
//           alert('Signup Successful!');
//           setIsSignupComplete(true);
//           navigate('/manage-doctors'); // Navigate to doctor login page after successful signup
//         } else {
//           alert('OTP verification failed! Please try again.');
//         }
//       })
//       .catch(error => {
//         console.error('Error during OTP verification:', error);
//       });
//   };

//   // Effect to handle password validation and matching
//   useEffect(() => {
//     if (password.length > 0 && password?.trim()?.length <= 6) {
//       setPasswordValidationMessage('Password length must be greater than 6 characters');
//     } else {
//       setPasswordValidationMessage('');
//     }

//     if (password === confirmPassword) {
//       setPasswordMatchDisplay('none');
//     } else {
//       setPasswordMatchDisplay('block');
//     }
//   }, [password, confirmPassword]);

//   // Handle profile picture change
//   const handleProfilePictureChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setProfilePicture(file);
//     }
//   };

//   return (
//     // <div id="doctorSignUpBody">
//     //   <div id="doctorSignUpBG">
//     //     <div className="greenLayer"></div>
//     //   </div>
//     <div className="login-page">
     
//       <div className="signup-form">
//         <h2>Create Doctor Account</h2>
//         <form id="doctorSignUpform" name="doctorSignUpform" onSubmit={isOtpSent ? handleVerifyOtp : handleSubmit}>
//           {/* Full Name */}
//           <div className="d-flex flex-row mt-5">
//             <div className="col-6 form-floating mx-2">
//               <label htmlFor="fullName">Full Name</label>
//               <input
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 className="form-control"
//                 placeholder="Full name"
//                 value={fullName}
//                 required
//                 onChange={(event) => setFullName(event.target.value)}
//               />
//             </div>
//           </div>

//           {/* Gender */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="gender">Gender</label>
//             <select
//               id="gender"
//               name="gender"
//               className="form-control"
//               value={gender}
//               onChange={(event) => setGender(event.target.value)}
//               required
//             >
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           {/* Address */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="address">Address</label>
//             <input
//               type="text"
//               id="address"
//               name="address"
//               className="form-control"
//               value={address}
//               onChange={(event) => setAddress(event.target.value)}
//               required
//             />
//           </div>

//           {/* Date of Birth */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="dob">Date of Birth</label>
//             <input
//               type="date"
//               id="dob"
//               name="dob"
//               className="form-control"
//               value={dob}
//               onChange={(event) => setDob(event.target.value)}
//               required
//             />
//           </div>

//           {/* Specialization */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="specialization">Specialization</label>
//             <input
//               type="text"
//               id="specialization"
//               name="specialization"
//               className="form-control"
//               value={specialization}
//               onChange={(event) => setSpecialization(event.target.value)}
//               required
//             />
//           </div>

//           {/* Qualification */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="qualification">Qualification</label>
//             <input
//               type="text"
//               id="qualification"
//               name="qualification"
//               className="form-control"
//               value={qualification}
//               onChange={(event) => setQualification(event.target.value)}
//               required
//             />
//           </div>

//           {/* Years of Experience */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="yoe">Years of Experience</label>
//             <input
//               type="number"
//               id="yoe"
//               name="yoe"
//               className="form-control"
//               value={yoe}
//               onChange={(event) => setYoe(event.target.value)}
//               required
//             />
//           </div>

//           {/* License Number */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="licenseNumber">License Number</label>
//             <input
//               type="text"
//               id="licenseNumber"
//               name="licenseNumber"
//               className="form-control"
//               value={licenseNumber}
//               onChange={(event) => setLicenseNumber(event.target.value)}
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               className="form-control"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               required
//             />
//           </div>

//           {/* Phone Number */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="phoneNumber">Phone Number</label>
//             <input
//               type="text"
//               id="phoneNumber"
//               name="phoneNumber"
//               className="form-control"
//               value={phoneNumber}
//               onChange={(event) => setPhoneNumber(event.target.value)}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               className="form-control"
//               required
//               placeholder="password"
//             />
//           </div>
//           <div className="mx-2 text-danger">{passwordValidationMessage}</div>

//           {/* Confirm Password */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={confirmPassword}
//               onChange={(event) => setConfirmPassword(event.target.value)}
//               className="form-control"
//               required
//               placeholder="confirm password"
//             />
//           </div>
//           <div className="mx-2 text-danger" style={{ display: `${passwordMatchDisplay}` }}>
//             Passwords do not match
//           </div>

//           {/* OTP Field */}
//           {isOtpSent && !isSignupComplete && (
//             <div className="form-floating mt-3 col-12 mx-2">
//               <label htmlFor="otp">Enter OTP</label>
//               <input
//                 type="text"
//                 id="otp"
//                 name="otp"
//                 value={otp}
//                 onChange={(event) => setOtp(event.target.value)}
//                 className="form-control"
//                 required
//                 placeholder="Enter OTP"
//               />
//             </div>
//           )}

//           {/* Profile Picture */}
//           <div className="form-floating mt-3 col-12 mx-2">
//             <label htmlFor="profilePicture">Profile Picture</label>
//             <input
//               type="file"
//               id="profilePicture"
//               name="profilePicture"
//               onChange={handleProfilePictureChange}
//               className="form-control"
//             />
//           </div>

//           {/* Submit Button */}
//           <div className="text-center">
//             <button id="doctorSignUp" type="submit">
//               {isOtpSent ? 'Verify OTP' : 'Sign Up'}
//             </button>
//           </div>

//           <div className="text-center">
//             Already have an account? <NavLink to="/doctor/login">Login</NavLink>
//           </div>
//         </form>
//       </div>
//     </div>
 
//   );
// }

// export default DoctorSignupPage;
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
    fetch('http://localhost:5000/facilityops/getallfacility')
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

    fetch('http://localhost:5000/doctor/signup', {
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

    fetch('http://localhost:5000/doctor/signup', {
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
    <div className="login-page" style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
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
            placeholder="At least 7 characters"
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
            Already have an account? <NavLink to="/doctor/login">Login</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}

export default DoctorSignupPage;
