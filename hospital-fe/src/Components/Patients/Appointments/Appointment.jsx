
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Appointment.css';
// import PatientNavbar from '../Navbar/PatientNavbar';
// import PatientSidebar from '../Sidebar/PatientSidebar';


// const departments = [
//   { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
//   { id: 'neurology', name: 'Neurology', icon: '🧠' },
//   { id: 'orthopedics', name: 'Orthopedics', icon: '💪' },
//   { id: 'dermatology', name: 'Dermatology', icon: '🧴' },
//   { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
//   { id: 'surgery', name: 'Surgery', icon: '🔪' },
// ];

// const Appointment = () => {
//   const navigate = useNavigate(); // Use useNavigate from React Router v6

//   const handleDepartmentClick = (departmentId) => {
//     navigate(`/appointment/${departmentId}`); // Navigate to the department appointment page
//   };

//   return (
//     <div className="dashboard-container">
//     {/* Navbar at the top */}
//     <PatientNavbar />
    
//     <div className="dashboard-content">
//       {/* Sidebar for navigation */}
//       <PatientSidebar />
      
//     <div className="home-container">
//       <h2>Select Department</h2>
//       <div className="departments">
//         {departments.map((dept) => (
//           <div key={dept.id} className="department-card" onClick={() => handleDepartmentClick(dept.id)}>
//             <div className="department-icon">{dept.icon}</div>
//             <div className="department-name">{dept.name}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//     </div>
//     </div>
//   );
// };

// export default Appointment;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwtDecode for decoding JWT tokens
import './Appointment.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

// Dummy data for departments
const departments = [
  { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
  { id: 'neurology', name: 'Neurology', icon: '🧠' },
  { id: 'orthopedics', name: 'Orthopedics', icon: '💪' },
  { id: 'dermatology', name: 'Dermatology', icon: '🧴' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
  { id: 'surgery', name: 'Surgery', icon: '🔪' },
];

const Appointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login"); // Redirect if no token is found in localStorage
        return;
      }

      try {
        // Decode the access token to get patientId
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid;  // Assuming 'userid' is the key in your token

        setPatientId(patientId); // Set patientId from the decoded token
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate("/login"); // Redirect to login if token decoding fails
      }
    };

    fetchPatientProfile();
  }, [navigate]);

  useEffect(() => {
    if (patientId) {
      const formData = new FormData();
      formData.append('patientid', patientId); // Append patientId to form data

      // Fetch appointment details from the server
      fetch('http://localhost:5000/getappoinmentdetails', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Assuming the response data is nested inside the 'data' property
          const appointmentData = [data.data]; // Wrap in an array to display in table
          setAppointments(appointmentData);  // Set appointments state
          setLoading(false);
        })
        .catch((error) => {
          setError('Failed to fetch appointments');
          setLoading(false);
        });
    }
  }, [patientId]); // Re-fetch appointments when patientId changes

  const handleDepartmentClick = (departmentId) => {
    navigate(`/appointment/${departmentId}`); // Navigate to the department appointment page
  };

  return (
    <div className="dashboard-container">
      {/* Navbar at the top */}
      <PatientNavbar />

      <div className="dashboard-content">
        {/* Sidebar for navigation */}
        <PatientSidebar />

        <div className="home-container">
          <h2>Select Department</h2>
          <div className="departments">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="department-card"
                onClick={() => handleDepartmentClick(dept.id)}
              >
                <div className="department-icon">{dept.icon}</div>
                <div className="department-name">{dept.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment details section */}
        <div className="appointment-details-container">
          {loading ? (
            <div>Loading appointments...</div>
          ) : error ? (
            <div>{error}</div>
          ) : appointments.length > 0 ? (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Doctor Name</th>
                  <th>Appointment Time</th>
                  <th>Details</th>
                
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.uid}>
                    <td>
                      {appointment.patient_firstname} {appointment.patient_lastname}
                    </td>
                    <td>{appointment.doctor_fullname}</td>
                    <td>{appointment.appoinmenttime}</td>
                    <td>{appointment.appoinmentdetails}</td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No appointment details found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
