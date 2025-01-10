import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode for decoding JWT tokens
import './Appointment.css'; // Ensure you have your CSS styles here
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
  const [upcomingAppointments, setUpcomingAppointments] = useState([]); // To store upcoming appointments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // For toggling the edit form
  const [currentAppointment, setCurrentAppointment] = useState(null); // For holding current appointment data

  // Fetch patient profile from localStorage and decode the token
  useEffect(() => {
    const fetchPatientProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        navigate('/login'); // Redirect if no token is found in localStorage
        return;
      }

      try {
        // Decode the access token to get patientId
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid;  // Assuming 'userid' is the key in your token

        setPatientId(patientId); // Set patientId from the decoded token
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login'); // Redirect to login if token decoding fails
      }
    };

    fetchPatientProfile();
  }, [navigate]);

  // Fetch appointments when patientId is available
  useEffect(() => {
    if (patientId) {
      // Fetch all appointments
      const formData = new FormData();
      formData.append('patientid', patientId); // Append patientId to form data

      // Fetch all appointments from the server (this was previously handled)
      fetch('http://localhost:5000/getappoinmenthistory', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const appointmentData = Array.isArray(data.data) ? data.data : [data.data]; // Handle both array and object response structures
          setAppointments(appointmentData); // Set all appointments
          setLoading(false);
        })
        .catch((error) => {
          setError('Failed to fetch appointments');
          setLoading(false);
        });

      // Fetch upcoming appointments
      fetch('http://localhost:5000/getappoinmentdetails', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const upcomingAppointmentData = Array.isArray(data.data) ? data.data : [data.data];
          setUpcomingAppointments(upcomingAppointmentData); // Set upcoming appointments
        })
        .catch((error) => {
          setError('Failed to fetch upcoming appointments');
          setLoading(false);
        });
    }
  }, [patientId]); // Re-fetch appointments when patientId changes

  // Navigate to the department appointment page
  const handleDepartmentClick = (departmentId) => {
    navigate(`/appointment/${departmentId}`);
  };

  // Handle appointment deletion
  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const formData = new FormData();
      formData.append('appoinid', appointmentId); // Pass appointmentId as 'appoinid'

      // Delete appointment from the server
      fetch('http://localhost:5000/ops/appoinmentdelete', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Delete response:', data); // Debugging line

          if (data.success) {
            // Ensure we're deleting the correct appointment
            console.log('Deleting appointment with ID:', appointmentId);

            // Remove the deleted appointment from the state
            setAppointments((prevAppointments) =>
              prevAppointments.filter((appointment) => appointment.uid !== appointmentId)
            );
            setUpcomingAppointments((prevUpcomingAppointments) =>
              prevUpcomingAppointments.filter((appointment) => appointment.uid !== appointmentId)
            );
          } else {
            alert('Appointment Delete Successfully');
          }
        })
        .catch((error) => {
          console.error('Error deleting appointment:', error);
          alert('Failed to delete the appointment');
        });
    }
  };

  // Start editing the appointment (populate the form with current details)
  const handleEditAppointment = (appointment) => {
    setIsEditing(true);
    setCurrentAppointment(appointment); // Set current appointment data for editing
  };

  // Submit the edited appointment details
  const handleSubmitEdit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('appoinid', currentAppointment.uid); // Add the appointment ID
    formData.append('appoinmenttime', currentAppointment.appoinmenttime);
    formData.append('appointmentdetails', currentAppointment.appointmentdetails);

    // Send the updated data to the server
    fetch('http://localhost:5000/update/appoinment', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Appointment updated successfully');
          
          // Update the state with the updated appointment
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.uid === currentAppointment.uid ? { ...appointment, ...currentAppointment } : appointment
            )
          );

          setUpcomingAppointments((prevUpcomingAppointments) =>
            prevUpcomingAppointments.map((appointment) =>
              appointment.uid === currentAppointment.uid ? { ...appointment, ...currentAppointment } : appointment
            )
          );
        } else {
          alert('Appointment updated successfully');
        }
        setIsEditing(false); // Hide the edit form
        setCurrentAppointment(null);
      })
      .catch((error) => {
        console.error('Error updating appointment:', error);
        alert('Failed to update the appointment');
      });
  };

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  // Render the appointments table
  const renderAppointmentTable = (appointments) => {
    if (!appointments || appointments.length === 0) {
      return <div>No appointments found.</div>; // This message will be shown if no appointments exist
    }

    return (
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Appointment ID</th> {/* Added column for Appointment ID */}
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Appointment Time</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            // Make sure the appointment data is valid before accessing its properties
            appointment && appointment.patient_firstname && appointment.patient_lastname && (
              <tr key={appointment.uid}>
                <td>{appointment.uid}</td> {/* Display Appointment ID (uid) */}
                <td>
                  {appointment.patient_firstname} {appointment.patient_lastname}
                </td>
                <td>{appointment.doctor_fullname}</td>
                <td>{appointment.appoinmenttime}</td>
                <td>{appointment.appoinmentdetails}</td>
                <td>
                  <button onClick={() => handleEditAppointment(appointment)}>Edit</button>
                  <button onClick={() => handleDeleteAppointment(appointment.uid)}>Delete</button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dashboard-container">
      <PatientNavbar />

      <div className="dashboard-content">
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

        {/* Edit Appointment Form */}
        {isEditing && currentAppointment && (
          <div className="edit-appointment-form">
            <h3>Edit Appointment</h3>
            <form onSubmit={handleSubmitEdit}>
              <div>
                <label>Appointment Time:</label>
                <input
                  type="datetime-local"
                  name="appoinmenttime"
                  value={currentAppointment.appoinmenttime}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Details:</label>
                <textarea
                  name="appointmentdetails"
                  value={currentAppointment.appointmentdetails}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Update Appointment</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Upcoming Appointments Section */}
        <div className="appointment-details-container">
          <h3>Upcoming Appointments</h3>
          {loading ? (
            <div>Loading appointments...</div>
          ) : error ? (
            <div>{error}</div>
          ) : upcomingAppointments.length === 0 ? (
            <div>No upcoming appointments found.</div> // Message for no upcoming appointments
          ) : (
            renderAppointmentTable(upcomingAppointments)
          )}
        </div>

        {/* All Appointments Section */}
        <div className="appointment-details-container">
          <h3>All Appointments</h3>
          {loading ? (
            <div>Loading appointments...</div>
          ) : error ? (
            <div>{error}</div>
          ) : appointments.length === 0 ? (
            <div>No appointments found.</div> // Message for no appointments
          ) : (
            renderAppointmentTable(appointments)
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
