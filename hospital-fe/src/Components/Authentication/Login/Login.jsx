// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate hook
// import './Login.css';

// function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();  // Initialize the useNavigate hook

//   // Handle form submission for login
//   const handleSubmit = (event) => {
//     event.preventDefault();

//     // Prepare the form data to be sent as multipart/form-data
//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('password', password);

//     // Send a POST request to the login endpoint
//     fetch('http://localhost:5000/patients/login', {
//       method: 'POST',
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // Check if login is successful
//         if (data.message === 'Login successful!') {
//           alert('Login successful!');
//           navigate('/patient-dashboard');  // Redirect to patient dashboard after successful login
//         } else {
//           alert('Login failed! Please check your credentials.');
//         }
//       })
//       .catch((error) => {
//         console.error('Error during login:', error);
//         alert('An error occurred during login. Please try again.');
//       });
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>Welcome Back! Please log in to your account</h1>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit}>
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
//             </button> {/* Added margin to the right of Login button */}
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


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
// import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode in new versions of jwt-decode
// import './Login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate(); // Initialize useNavigate for redirection

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('password', password);

//     try {
//       const response = await fetch('http://localhost:5000/patients/login', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       // Check if login was successful
//       if (!response.ok) {
//         throw new Error(data.message || 'Something went wrong');
//       }

//       // Store the access token in localStorage
//       localStorage.setItem('accessToken', data.access_token); // Store the access token

      

//       // After successful login, redirect to patient dashboard
//       navigate('/patient-dashboard'); // Redirect to patient-dashboard

//     } catch (error) {
//       console.error('Login error:', error);
//       setError(error.message); // Display the error message
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='background-image'>
//       <div className='card-login'>
//         <div className="card-header-login">
//           <h2>Login</h2>
//         </div>
//         <div className="card-body-login">
//           <form onSubmit={handleLogin}>
//             <div className="input">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input">
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="submit-container">
//               <button type="submit" disabled={loading}>
//                 {loading ? 'Loading...' : 'Login'}
//               </button>
//             </div>
//             {error && <p className="error-message">{error}</p>}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';  // Import Link and useNavigate hook
// import './Login.css';  // Import CSS for styling

// // Function for the Login page
// function LoginPage() {
//   const [email, setEmail] = useState('');  // State to hold the email
//   const [password, setPassword] = useState('');  // State to hold the password
//   const navigate = useNavigate();  // Initialize the useNavigate hook to navigate after login

//   // Handle form submission for login
//   const handleSubmit = (event) => {
//     event.preventDefault();  // Prevent the default form submission behavior

//     // Prepare the form data to be sent as multipart/form-data
//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('password', password);

//     // Send a POST request to the login endpoint
//     fetch('http://localhost:5000/patients/login', {
//       method: 'POST',
//       body: formData,
//     })
//       .then((response) => response.json())  // Parse the response as JSON
//       .then((data) => {
//         // Check if login is successful
//         if (data.message === 'Login successful!') {
//           alert('Login successful!');

//           // Store the access token in localStorage
//           localStorage.setItem('accessToken', data.access_token);

         

//           // Redirect to patient dashboard after successful login
//           navigate('/patient-dashboard');
//         } else {
//           alert('Login failed! Please check your credentials.');  // Show error if login fails
//         }
//       })
//       .catch((error) => {
//         console.error('Error during login:', error);
//         alert('An error occurred during login. Please try again.');  // Show error if any
//       });
//   };

//   return (
//     <div className="login-page">
//       <div className="login-card">
//         <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>Welcome Back! Please log in to your account</h1>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}  // Update email state
//               placeholder="Enter your email id"
//             />
//           </div>

//           <div className="input-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}  // Update password state
//               placeholder="Enter your password"
//             />
//           </div>

//           {/* Buttons placed side by side */}
//           <div className="button-group">
//             <button type="submit" className="login-button" style={{ marginRight: '10px' }}>
//               Login
//             </button>
//             {/* Link to sign-up page */}
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

// import React, { useState } from 'react';
// import { useNavigate,Link } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode'; // Correctly import jwt-decode
// import './Login.css';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('password', password);
  
//     try {
//       const response = await fetch('http://localhost:5000/patients/login', {
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

//       // Decode the JWT token and get the userId
//       const decodedToken = jwtDecode(accessToken);
//       const patientId = decodedToken.userid;  // Assuming 'userid' is the field in the JWT payload

//       // Store the patientId in localStorage for later use
//       localStorage.setItem('patientId', patientId);

//       // Redirect to the patient dashboard (or profile page)
//       navigate('/patient-dashboard'); // or wherever you want to redirect

//     } catch (error) {
//       console.error('Login error:', error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//        return (
//      <div className="login-page">
//        <div className="login-card">
//          <h1 style={{ fontSize: '24px', color: '#87CEEB' }}>Welcome Back! Please log in to your account</h1>

//          {/* Login Form */}
//          <form onSubmit={handleSubmit}>
//            <div className="input-group">
//              <label htmlFor="email">Email</label>
//             <input
//                type="email"
//               id="email"
//                value={email}
//               onChange={(event) => setEmail(event.target.value)}
//                placeholder="Enter your email id"
//             />
//            </div>
//            <div className="input-group">
//              <label htmlFor="password">Password</label>
//              <input
//                type="password"
//                id="password"
//                value={password}
//                onChange={(event) => setPassword(event.target.value)}
//                placeholder="Enter your password"
//             />
//           </div>

//           {/* Buttons placed side by side */}
//            <div className="button-group">
//              <button type="submit" className="login-button" style={{ marginRight: '10px' }}>
//                Login
//              </button> {/* Added margin to the right of Login button */}
//              <Link to="/signup">
//               <button type="button" className="signup-button">
//                  Sign Up
//                </button>
//              </Link>
//            </div>
//          </form>

//          {/* Forgot Password link */}
//          <div className="forgot-password">
//            <Link to="/password">Forgot Password?</Link>
//          </div>
//        </div>
//      </div>
//    );
//  }

// export default LoginPage;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correctly import jwt-decode with the correct case
import './Login.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:5000/patients/login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store the access token in localStorage
      const accessToken = data.token;
      localStorage.setItem('accessToken', accessToken);

      // // Decode the JWT token and get the userId
      // const decodedToken = jwtDecode(accessToken);  // Use jwtDecode (with uppercase D)
      // const patientId = decodedToken.userid;  // Assuming 'userid' is the field in the JWT payload

      // // Store the patientId in localStorage for later use
      // localStorage.setItem('patientId', patientId);

      // Redirect to the patient dashboard (or profile page)
      navigate('/patient-dashboard'); // or wherever you want to redirect

    } catch (error) {
      console.error('Login error:', error);
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

        {/* Login Form */}
        <form onSubmit={handleLogin}> {/* Fix: use handleLogin instead of handleSubmit */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email id"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {/* Buttons placed side by side */}
          <div className="button-group">
            <button type="submit" className="login-button" style={{ marginRight: '10px' }}>
              Login
            </button>
            <Link to="/signup">
              <button type="button" className="signup-button">
                Sign Up
              </button>
            </Link>
          </div>
        </form>

        {/* Forgot Password link */}
        <div className="forgot-password">
          <Link to="/password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
