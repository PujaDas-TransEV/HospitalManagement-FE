// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Use navigate for redirection if needed
// import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the JWT token
// import './AdminProfile.css';
// import AdminNavbar from '../Adminnavbar/AdminNavbar';
// import AdminSidebar from '../Adminsidebar/AdminSidebar' ;// Import your custom CSS for styling

// const AdminProfilePage = () => {
//   const [adminDetails, setAdminDetails] = useState(null);  // Store fetched admin details
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);  // Store error message if any
//   const navigate = useNavigate();  // Navigate hook for redirection if needed

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage

//     if (!token) {
//       navigate('/admin/login'); // Redirect to login page if there's no token
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode(token);  // Decode the token
//       console.log('Decoded Token:', decodedToken); // Log the decoded token to inspect it

//       // Ensure that 'adminid' exists in the decoded token
//       const adminIdFromToken = decodedToken.adminid || decodedToken.userid || null;

//       if (!adminIdFromToken) {
//         throw new Error('Admin ID is missing from the token');
//       }

//       // Fetch the admin details using the adminId
//       fetchAdminDetails(adminIdFromToken);  // Call the function to fetch admin details

//     } catch (error) {
//       console.error('Error decoding token:', error);
//       navigate('/admin/login'); // Redirect to login if token is invalid or expired
//     }
//   }, [navigate]); // Empty dependency array ensures this effect runs only once

//   // Function to fetch admin details
//   const fetchAdminDetails = async (adminId) => {
//     try {
//       setLoading(true);

//       const formData = new FormData();
//       formData.append('adminid', adminId);  // Send adminId as part of the form data

//       const response = await fetch('http://192.168.0.106:5000/admin/getdetails', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       console.log('Backend Response:', data); // Log backend response to inspect it

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to fetch admin details');
//       }

//       setAdminDetails(data.data);  // Set the response data as the admin profile details
//     } catch (error) {
//       console.error('Error fetching admin details:', error);
//       setError(error.message);  // Set error message if fetching fails
//     } finally {
//       setLoading(false);  // End the loading state
//     }
//   };

//   // Render loading state or profile info
//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (error) {
//     return (
//       <div className="error">
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   if (!adminDetails) {
//     return <div className="error">No admin details available.</div>;  // Display this if no admin details were fetched
//   }

//   return (
//     <div className="dashboard-container">
//     <AdminNavbar /> {/* Navbar for admin */}

//     <div className="dashboard-content">
//       <AdminSidebar /> {/* Sidebar for admin navigation */}

//     <div className="profile-container">
//       <h1 className="profile-title">Admin Profile</h1>
//       <div className="profile-card">
//         <div className="profile-info">
//           <p><strong>Admin ID:</strong> {adminDetails.uid}</p></div>
//           <div className="profile-info"> <p><strong>Name:</strong> {adminDetails.name}</p></div>
//           <div className="profile-info"><p><strong>Email:</strong> {adminDetails.email}</p></div>
//           <div className="profile-info"></div> <p><strong>Role:</strong> {adminDetails.userrole}</p></div>
//         </div>
//         </div>
//         </div>

    
//   );
// };

// export default AdminProfilePage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { FaSpinner } from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const backgroundImageUrl = '../../Assests/background.jpg';  // Update this path accordingly

const AdminProfilePage = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const adminIdFromToken = decodedToken.adminid || decodedToken.userid || null;

      if (!adminIdFromToken) {
        throw new Error('Admin ID missing in token');
      }

      fetchAdminDetails(adminIdFromToken);
    } catch (err) {
      console.error('Token decode error:', err);
      navigate('/admin/login');
    }
  }, [navigate]);

  const fetchAdminDetails = async (adminId) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('adminid', adminId);

      const response = await fetch('http://192.168.0.106:5000/admin/getdetails', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch admin details');
      }

      setAdminDetails(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Spinner animation style keyframes
  const spinnerStyle = {
    animation: 'spin 1.2s linear infinite',
    fontSize: '4rem',
    marginBottom: '15px',
    color: 'white',
  };

  // Inject keyframes into document once (for spinner)
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    const keyframes =
      `@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }`;
    if (styleSheet) {
      const rules = Array.from(styleSheet.cssRules).map(rule => rule.cssText);
      if (!rules.includes(keyframes)) {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      }
    }
  }, []);

  if (loading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(20, 50, 70, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          zIndex: 9999,
          color: '#fff',
          fontSize: '1.2rem',
          fontWeight: 600,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <FaSpinner style={spinnerStyle} />
        <p>Loading admin profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#c0392b',
          fontSize: '1.3rem',
          fontWeight: 700,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!adminDetails) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#c0392b',
          fontSize: '1.3rem',
          fontWeight: 700,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <p>No admin details found.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#2c3e50',
      }}
    >
      <AdminNavbar />
      <div
        style={{
          display: 'flex',
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.85)',
          minHeight: 'calc(100vh - 60px)', // adjust if navbar height changes
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <AdminSidebar />

        <main
          style={{
            flex: 1,
            padding: '30px 40px',
            borderRadius: '12px',
            backgroundColor: '#fff',
            boxShadow: '0 6px 20px rgba(44, 62, 80, 0.15)',
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '30px',
              color: '#34495e',
            }}
          >
            Admin Profile
          </h1>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              fontSize: '1.2rem',
              color: '#34495e',
            }}
          >
            <div
              style={{
                backgroundColor: '#ecf0f1',
                padding: '15px 25px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                fontWeight: 600,
              }}
            >
              <strong>Admin ID:</strong> {adminDetails.uid}
            </div>
            <div
              style={{
                backgroundColor: '#ecf0f1',
                padding: '15px 25px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                fontWeight: 600,
              }}
            >
              <strong>Name:</strong> {adminDetails.name}
            </div>
            <div
              style={{
                backgroundColor: '#ecf0f1',
                padding: '15px 25px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                fontWeight: 600,
              }}
            >
              <strong>Email:</strong> {adminDetails.email}
            </div>
            <div
              style={{
                backgroundColor: '#ecf0f1',
                padding: '15px 25px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                fontWeight: 600,
              }}
            >
              <strong>Role:</strong> {adminDetails.userrole}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfilePage;
