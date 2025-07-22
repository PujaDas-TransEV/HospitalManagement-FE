import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSpinner, FaTimes, FaSave } from 'react-icons/fa';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './DoctorAppointment.css';

const DoctorAppointmentManagement = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // Decode token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');
    try {
      const decoded = jwtDecode(token);
      if (decoded.doctorid) setDoctorId(decoded.doctorid);
      else navigate('/login');
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch appointment data
  useEffect(() => {
    if (!doctorId) return;
    const fetchData = async () => {
      setLoading(true);
      const formData = new FormData();
      formData.append('doctorid', doctorId);
      try {
        const response = await fetch('http://192.168.0.106:5000/getappoinmenthistory', {
          method: 'POST',
          body: formData,
        });
        const { data } = await response.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [doctorId]);

  const normalizeStatus = (status = '') => {
    const lower = status.toLowerCase();
    if (['applied', 'booked', 'confirmed'].includes(lower)) return 'Booked';
    if (lower === 'completed') return 'Completed';
    if (['cancelled', 'acancelled'].includes(lower)) return 'Cancelled';
    return status;
  };

  const normalizedAppointments = appointments.map(a => ({
    ...a,
    appoinmentstatus: normalizeStatus(a.appoinmentstatus),
  }));

  const filteredAppointments = normalizedAppointments.filter(a => {
    if (filterStatus === 'All') return true;
    return a.appoinmentstatus === filterStatus;
  });

  const openEditPopup = (appointment) => {
    setEditingAppointment(appointment);
    setEditStatus(appointment.appoinmentstatus);
  };

  const closeEdit = () => {
    setEditingAppointment(null);
    setEditStatus('');
  };

  const saveStatus = async () => {
    if (!editingAppointment) return;

    const formData = new FormData();
    formData.append('appoinid', editingAppointment.uid);
    formData.append('appoinmentstatus', editStatus);

    try {
      const res = await fetch('http://192.168.0.106:5000/update/appoinment', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (json.message) {
        setAppointments(prev =>
          prev.map(a =>
            a.uid === editingAppointment.uid
              ? { ...a, appoinmentstatus: editStatus }
              : a
          )
        );
        closeEdit();
        alert('Appointment updated successfully.');
      } else {
        alert('Update failed.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Server error');
    }
  };

  const deleteAppointment = async (uid) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    const formData = new FormData();
    formData.append('appoinid', uid);

    try {
      const res = await fetch('http://192.168.0.106:5000/ops/appoinmentdelete', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (json.message) {
        setAppointments(prev => prev.filter(a => a.uid !== uid));
        alert('Appointment deleted.');
      } else {
        alert('Delete failed.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Server error while deleting.');
    }
  };

  return (
    <div className="appointment-bg">
      <DoctorNavbar />
      <div className="dashboard-content-appointment">
        <DoctorSidebar />
        <div className="appointment-overlay">
          <div className="doctor-appointment-container">
            <h2 className="section-title">Manage Appointments</h2>

<div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px'
  }}
>
  {/* Filter Dropdown */}
  <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#2c3e50',
    backgroundColor: '#e0f2f1',
    padding: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    width: '240px'  // ⬅️ smaller fixed width
  }}
>

    <label htmlFor="statusFilter" style={{ flexShrink: 0 }}>
      Filter by Status:
    </label>
    <select
      id="statusFilter"
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      style={{
        padding: '5px 10px',
        borderRadius: '6px',
        border: '1px solid #009688',
        fontSize: '0.9rem',
        cursor: 'pointer',
        outline: 'none',
        backgroundColor: '#ffffff',
        color: '#004d40',
        flexGrow: 1,
        transition: 'border-color 0.3s ease',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#00796b')}
      onBlur={(e) => (e.target.style.borderColor = '#009688')}
    >
      <option value="All">All</option>
      <option value="Booked">Booked</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  </div>

  {/* Patient List by Slot Button */}
  <Button
    variant="info"
    onClick={() => navigate('/doctor/slot-patients')}
    style={{
      backgroundColor: '#009688',
      borderColor: '#00796b',
      fontWeight: 'bold',
      padding: '8px 16px',
      borderRadius: '6px',
      color: 'white',
      whiteSpace: 'nowrap',
      height: '42px',
    }}
  >
    Patient List by Slot
  </Button>
</div>

            {loading ? (
              <div className="loading-spinner"><FaSpinner className="spin" size={40} /></div>
            ) : filteredAppointments.length === 0 ? (
              <p>No appointments found.</p>
            ) : (
              <table className="appointment-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Created Date</th>
                    <th>Appointment Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(appt => (
                    <tr key={appt.uid}>
                      <td>{appt.uid}</td>
                      <td>{appt.patient_firstname} {appt.patient_lastname}</td>
                     <td>{new Date(appt.created_at).toLocaleString('en-IN', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Kolkata'
})}</td>
                      <td>{appt.appoinmenttime}</td>
                      <td>{appt.appoinmentstatus}</td>
                      <td>
                        <Button variant="warning" onClick={() => openEditPopup(appt)}>
                          <FaEdit />
                        </Button>{' '}
                        {appt.appoinmentstatus === 'Completed' && (
                          <Button variant="danger" onClick={() => deleteAppointment(appt.uid)}>
                            <FaTrash />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Edit Popup */}
            {editingAppointment && (
              <div className="popup-overlay" onClick={closeEdit}>
                <div className="popup-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#e0f7fa'}}>
                  <h3>Edit Appointment Status</h3>
                  <p><strong>ID:</strong> {editingAppointment.uid}</p>
                  <p><strong>Patient:</strong> {editingAppointment.patient_firstname} {editingAppointment.patient_lastname}</p>
                  <label>Status:</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option>Booked</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                  <div className="popup-buttons">
                    <Button variant="secondary" onClick={closeEdit}><FaTimes /> Cancel</Button>
                    <Button variant="primary" onClick={saveStatus}><FaSave /> Save</Button>
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
