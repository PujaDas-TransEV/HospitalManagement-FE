// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode'; // Import jwtDecode to decode the token
// import './Medical.css';  // Make sure your CSS file is correctly linked
// import PatientNavbar from '../Navbar/PatientNavbar';  // Assuming your Navbar component
// import PatientSidebar from '../Sidebar/PatientSidebar';  // Assuming your Sidebar component

// const PatientMedicalHistoryPage = () => {
//   const navigate = useNavigate();
//   const [patientDetails, setPatientDetails] = useState(null);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isFetching, setIsFetching] = useState(false);
//   const [patientId, setPatientId] = useState(null);

//   // Fetch patient profile from localStorage and decode the token to get patientId
//   useEffect(() => {
//     const fetchPatientProfile = async () => {
//       const accessToken = localStorage.getItem('accessToken');

//       if (!accessToken) {
//         navigate('/login'); // Redirect to login page if no token is found
//         return;
//       }

//       try {
//         // Decode the access token to get patientId
//         const decodedToken = jwtDecode(accessToken);
//         const patientId = decodedToken.userid;  // Assuming 'userid' is the key in your token

//         setPatientId(patientId);  // Set patientId
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         navigate('/login');  // Redirect to login if token decoding fails
//       }
//     };

//     fetchPatientProfile();
//   }, [navigate]);

//   // Fetch patient details using patientId
//   useEffect(() => {
//     if (patientId) {
//       setIsFetching(true);
//       const formData = new FormData();
//       formData.append('patientid', patientId);

//       // Send a POST request to fetch patient admission details
//       fetch('http://localhost:5000/ops/patientadmitstatus', {
//         method: 'POST',
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.data) {
//             setPatientDetails(data.data); // Set patient details from the response
//             setSuccessMessage(data.message); // Set success message
//           } else {
//             setErrorMessage('No admission details found for this patient');
//           }
//           setIsFetching(false);
//         })
//         .catch((error) => {
//           console.error('Error fetching patient details:', error);
//           setErrorMessage('Failed to fetch patient details');
//           setIsFetching(false);
//         });
//     }
//   }, [patientId]); // Fetch patient details when patientId is set

//   return (
//     <div className="dashboard-container">
//       <PatientNavbar />
//       <div className="dashboard-content">
//         <PatientSidebar />

//         <div className="container">
//           <h2 className="page-title">Patient Medical History</h2>

//           {/* Display Error or Success Messages */}
//           {errorMessage && <div className="error">{errorMessage}</div>}
//           {successMessage && <div className="success">{successMessage}</div>}

//           {/* Button to trigger fetching of patient admission details */}
//           <div className="fetch-details-btn">
//             <button
//               onClick={() => {}}
//               className="btn"
//               disabled={isFetching} // Disable button while fetching
//             >
//               {isFetching ? 'Fetching...' : 'View Admission Details'}
//             </button>
//           </div>

//           {/* Display Patient Admission Details */}
//           {patientDetails ? (
//             <div className="patient-details">
//               <h3>Patient Details</h3>
//               <p><strong>Name:</strong> {patientDetails.patientfirstname}</p>
//               <p><strong>Age:</strong> {patientDetails.patientage}</p>
//               <p><strong>Email:</strong> {patientDetails.patientemail}</p>
//               <p><strong>Gender:</strong> {patientDetails.patientgender}</p>
//               <p><strong>Phone Number:</strong> {patientDetails.patientphoneno}</p>
//               <p><strong>Admission Status:</strong> {patientDetails.admitstatus}</p>
//               <p><strong>Ward Name:</strong> {patientDetails.wardname}</p>
//               <p><strong>Ward Email:</strong> {patientDetails.wardemail}</p>
//               <p><strong>Room Number:</strong> {patientDetails.room_number}</p>
//               <p><strong>Room Type:</strong> {patientDetails.room_type}</p>
//             </div>
//           ) : (
//             <div className="no-patient-details">
//               <p>No admission details found for this patient.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientMedicalHistoryPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Medical.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const PatientMedicalHistoryPage = () => {
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        navigate('/login'); 
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid;
        setPatientId(patientId);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    };

    fetchPatientProfile();
  }, [navigate]);

  useEffect(() => {
    if (patientId) {
      setIsFetching(true);
      const formData = new FormData();
      formData.append('patientid', patientId);

      fetch('http://localhost:5000/ops/patientadmitstatus', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.data) {
            setPatientDetails(data.data);
            setSuccessMessage(data.message);
          } else {
            setErrorMessage('No admission details found for this patient');
          }
          setIsFetching(false);
        })
        .catch((error) => {
          console.error('Error fetching patient details:', error);
          setErrorMessage('Failed to fetch patient details');
          setIsFetching(false);
        });
    }
  }, [patientId]);

  return (
    <div className="dashboard-container">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />

        <div className="container">
          <h2 className="page-title">Patient Medical History</h2>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <div className="patient-details-card">
            {patientDetails ? (
              <>
                <h3>Patient Details</h3>
                <p><strong>Name:</strong> {patientDetails.patientfirstname}</p>
                <p><strong>Age:</strong> {patientDetails.patientage}</p>
                <p><strong>Email:</strong> {patientDetails.patientemail}</p>
                <p><strong>Gender:</strong> {patientDetails.patientgender}</p>
                <p><strong>Phone Number:</strong> {patientDetails.patientphoneno}</p>
                <p><strong>Admission Status:</strong> {patientDetails.admitstatus}</p>
                <p><strong>Ward Name:</strong> {patientDetails.wardname}</p>
                <p><strong>Ward Email:</strong> {patientDetails.wardemail}</p>
                <p><strong>Room Number:</strong> {patientDetails.room_number}</p>
                <p><strong>Room Type:</strong> {patientDetails.room_type}</p>
              </>
            ) : (
              <div className="no-patient-details">
                <p>No admission details found for this patient.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientMedicalHistoryPage;
