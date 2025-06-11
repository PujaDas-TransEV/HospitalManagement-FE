// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import {jwtDecode} from 'jwt-decode'; // Correctly import jwt-decode with the correct case
// import './Login.css';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault(); // Prevent form submission

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('password', password);

//     try {
//       const response = await fetch('http://192.168.0.105:5000/patients/login', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Something went wrong');
//       }

//       // Store the access token in localStorage
//       const accessToken = data.token;
//       localStorage.setItem('accessToken', accessToken);

//       // // Decode the JWT token and get the userId
//       // const decodedToken = jwtDecode(accessToken);  // Use jwtDecode (with uppercase D)
//       // const patientId = decodedToken.userid;  // Assuming 'userid' is the field in the JWT payload

//       // // Store the patientId in localStorage for later use
//       // localStorage.setItem('patientId', patientId);

//       // Redirect to the patient dashboard (or profile page)
//       navigate('/patient-dashboard'); // or wherever you want to redirect

//     } catch (error) {
//       console.error('Login error:', error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>
//           Welcome Back! Please log in to your account
//         </h1>

//         {/* Login Form */}
//         <form onSubmit={handleLogin}> {/* Fix: use handleLogin instead of handleSubmit */}
//           <div className="input-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               placeholder="Enter your email id"
//             />
//           </div>
//           <div className="input-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               placeholder="Enter your password"
//             />
//           </div>

//           {/* Buttons placed side by side */}
//           <div className="button-group">
//             <button type="submit" className="login-button" style={{ marginRight: '10px' }}>
//               Login
//             </button>
//             <Link to="/signup">
//               <button type="button" className="signup-button">
//                 Sign Up
//               </button>
//             </Link>
//           </div>
//         </form>

//         {/* Forgot Password link */}
//         <div className="forgot-password">
//           <Link to="/password">Forgot Password?</Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure this package is installed
import './Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://192.168.0.105:5000/patients/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // ✅ Store the access token
      const accessToken = data.token;
      localStorage.setItem('accessToken', accessToken);

      // ✅ Decode the token
      const decodedToken = jwtDecode(accessToken);
      console.log('✅ Decoded JWT:', decodedToken);

      // ✅ Extract and store patient ID
      const patientId = decodedToken.userid || decodedToken.patientId || decodedToken.id;
      if (patientId) {
        localStorage.setItem('patientId', patientId);
        console.log('✅ Patient ID from token:', patientId);
      } else {
        console.warn('⚠️ No patient ID found in token');
      }

      // ✅ Navigate to dashboard
      navigate('/patient-dashboard');

    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>
          Welcome Back! Please log in to your account
        </h1>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="login-button" style={{ marginRight: '10px' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <Link to="/signup">
              <button type="button" className="signup-button">
                Sign Up
              </button>
            </Link>
          </div>
        </form>

        <div className="forgot-password">
          <Link to="/password">Forgot Password?</Link>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
