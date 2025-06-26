
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import './DoctorAppointment.css';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';
import {jwtDecode}from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaSave } from 'react-icons/fa';
const DoctorAppointmentManagement = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [doctorId, setDoctorId] = useState(null);

  // Get doctor ID from token
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(accessToken);
      if (decodedToken?.doctorid) {
        setDoctorId(decodedToken.doctorid);
      } else {
        console.error('Token does not contain doctorid.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Fetch appointments
  useEffect(() => {
    if (!doctorId) return;

    const fetchAppointments = async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append('doctorid', doctorId);

      try {
        const res = await fetch('http://192.168.0.106:5000/getappoinmenthistory', {
          method: 'POST',
          body: formData,
        });

        const result = await res.json();
        const fetchedAppointments = Array.isArray(result.data) ? result.data : [];
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // Open edit popup with selected appointment
  const openEditPopup = (appointment) => {
    setEditingAppointment(appointment);
    setEditStatus(appointment.appoinmentstatus || 'Pending');
  };

  // Close edit popup
  const closeEditPopup = () => {
    setEditingAppointment(null);
    setEditStatus('');
  };

  // Handle status change in popup
  const handleStatusChange = (e) => {
    setEditStatus(e.target.value);
  };

  // Save edited status
  const saveEditedStatus = async () => {
    if (!editingAppointment?.uid) return;

    const formData = new FormData();
    formData.append('appoinid', editingAppointment.uid);
    formData.append('appoinmentstatus', editStatus);

    try {
      const response = await fetch('http://192.168.0.106:5000/update/appoinment', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.message) {
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.uid === editingAppointment.uid
              ? { ...appt, appoinmentstatus: editStatus }
              : appt
          )
        );
        alert('Appointment updated successfully');
        closeEditPopup();
      } else {
        alert('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Error updating appointment');
    }
  };

  // Cancel appointment function remains the same
 const handleCancelAppointment = async (appoinid) => {
  if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

  try {
    const formData = new FormData();
    formData.append('appoinid', appoinid);

    const response = await fetch('http://192.168.0.106:5000/ops/appoinmentdelete', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.status === 200 && data.message) {
      setAppointments((prev) => prev.filter((appt) => appt.uid !== appoinid));
      alert('Appointment deleted successfully');
    } else {
      alert('Failed to cancel appointment');
    }
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    alert('Error cancelling appointment');
  }
};


  return (
    <div className="appointment-bg">
      <DoctorNavbar />
      <div className="dashboard-content-appointment">
        <Doctorsidebar />
        <div className="appointment-overlay">
          <div className="doctor-appointment-container">
            <h2 className="section-title">Manage Appointments</h2>

            {loading ? (
              <div className="loading-spinner" aria-label="Loading appointments">
                <FaSpinner size={48} className="spin" />
              </div>
            ) : appointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <>
                {/* Table for desktop */}
                <div className="appointment-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Appointment ID</th>
                        <th>Patient Name</th>
                        <th>Date and Time</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appointment) =>
                        appointment?.uid ? (
                          <tr key={appointment.uid}>
                            <td>{appointment.uid}</td>
                            <td>
                              {appointment.patient_firstname} {appointment.patient_lastname}
                            </td>
                            <td>
                              {appointment.appoinmentdate} {appointment.appoinmenttime}
                            </td>
                            <td>{appointment.appoinmentstatus}</td>
                            <td>
                              <Button
                                variant="warning"
                                onClick={() => openEditPopup(appointment)}
                                aria-label={`Edit appointment ${appointment.uid}`}
                                className="btn-icon"
                              >
                                <FaEdit />
                              </Button>{' '}
                              <Button
                                variant="danger"
                                onClick={() => handleCancelAppointment(appointment.uid)}
                                aria-label={`Delete appointment ${appointment.uid}`}
                                className="btn-icon"
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ) : null
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Cards for mobile */}
                <div className="appointment-cards" aria-label="Appointment cards">
                  {appointments.map((appointment) => (
                    appointment?.uid && (
                      <div className="appointment-card" key={appointment.uid}>
                        <h3 className="card-title">
                          Appointment ID: {appointment.uid}
                        </h3>
                        <p>
                          <strong>Patient:</strong> {appointment.patient_firstname} {appointment.patient_lastname}
                        </p>
                        <p>
                          <strong>Date:</strong> {appointment.appoinmentdate}
                        </p>
                        <p>
                          <strong>Time:</strong> {appointment.appoinmenttime}
                        </p>
                        <p>
                          <strong>Status:</strong> {appointment.appoinmentstatus}
                        </p>
                        <div>
                          <Button
                            variant="warning"
                            onClick={() => openEditPopup(appointment)}
                            aria-label={`Edit appointment ${appointment.uid}`}
                            className="btn-icon"
                            size="sm"
                            style={{ marginRight: '10px' }}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleCancelAppointment(appointment.uid)}
                            aria-label={`Delete appointment ${appointment.uid}`}
                            className="btn-icon"
                            size="sm"
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </>
            )}

            {/* Edit Popup (centered) */}
            {editingAppointment && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 9999,
                }}
                onClick={closeEditPopup} // close if clicking outside popup
                aria-modal="true"
                role="dialog"
                aria-labelledby="edit-popup-title"
              >
                <div
                  style={{
                    backgroundColor: '#e0f7fa',
                    padding: '20px',
                    borderRadius: '8px',
                    minWidth: '320px',
                    maxWidth: '90%',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside popup
                >
                 
                  <h3
  id="edit-popup-title"
  style={{
    marginBottom: '1rem',
    color: '#2c3e50',        // Dark blue-ish color for title
    fontWeight: '700',
    fontSize: '1.8rem',
  }}
>
  Edit Appointment Status
</h3>

<p
  style={{
    color: '#34495e',        // Slightly lighter dark text
    marginBottom: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
  }}
>
  <strong style={{ color: '#2c3e50' }}>Appointment ID:</strong> {editingAppointment.uid}
</p>

<p
  style={{
    color: '#34495e',
    marginBottom: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
  }}
>
  <strong style={{ color: '#2c3e50' }}>Patient Name:</strong>{' '}
  {editingAppointment.patient_firstname} {editingAppointment.patient_lastname}
</p>

<label
  htmlFor="status-select"
  style={{
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '1rem',
  }}
>
  Status:
</label>

                  <select
                    id="status-select"
                    value={editStatus}
                    onChange={handleStatusChange}
                    style={{ width: '100%', padding: '8px', marginBottom: '1rem' }}
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Cancelled</option>
                    <option>Completed</option>
                  </select>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="links" onClick={closeEditPopup} style={{ padding: 0 }}>
  <FaTimes color="red" size={30} />
</Button>
<Button variant="links" onClick={saveEditedStatus} style={{ padding: 0, marginLeft: '10px' }}>
  <FaSave color="green" size={30} />
</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentManagement;
