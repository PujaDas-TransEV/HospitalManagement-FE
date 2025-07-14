import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import {
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaTimes
} from 'react-icons/fa';
import './Appointment.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const Appointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(null);
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setPatientId(jwtDecode(token).userid);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('patientid', patientId);

    Promise.all([
      fetch('http://192.168.0.106:5000/getappoinmenthistory', { method: 'POST', body: fd }).then(res => res.json()),
      fetch('http://192.168.0.106:5000/getappoinmentdetails', { method: 'POST', body: fd }).then(res => res.json())
    ])
      .then(([histData, upcData]) => {
        const histArr = Array.isArray(histData.data) ? histData.data : [histData.data].filter(Boolean);
        const upcArr = Array.isArray(upcData.data) ? upcData.data : [upcData.data].filter(Boolean);
        setAppointments(histArr);
        setUpcoming(upcArr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [patientId]);

  useEffect(() => {
    fetch('http://192.168.0.106:5000/facilityops/getallfacility')
      .then(res => res.json())
      .then(data => {
        const mapIcon = {
          Cardiology: '❤️',
          Neurology: '🧠',
          Orthopedics: '💪',
          Dermatology: '🧴',
          Pediatrics: '👶',
          Surgery: '🔪'
        };
        const depts = (data?.data || []).map(d => ({
          id: d.department_name.toLowerCase(),
          name: d.department_name,
          icon: mapIcon[d.department_name] || '🏥'
        }));
        setDepartments(depts);
      })
      .catch(() => {});
  }, []);

  const showPopup = (type, msg) => {
    setPopup({ type, msg });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleDelete = uid => {
    if (!window.confirm('Delete this appointment?')) return;
    setActionLoading(true);
    const fd = new FormData();
    fd.append('appoinid', uid);

    fetch('http://192.168.0.106:5000/ops/appoinmentdelete', { method: 'POST', body: fd })
      .then(res => res.json())
      .then(() => {
        setAppointments(prev => prev.filter(a => a.uid !== uid));
        setUpcoming(prev => prev.filter(a => a.uid !== uid));
        showPopup('success', 'Appointment deleted');
      })
      .catch(() => showPopup('error', 'Delete failed'))
      .finally(() => setActionLoading(false));
  };

  const handleEdit = appt => {
    setIsEditing(true);
    setCurrent({ ...appt });
  };

  const submitEdit = e => {
    e.preventDefault();
    setActionLoading(true);
    const fd = new FormData();
    fd.append('appoinid', current.uid);
    fd.append('appoinmenttime', current.appoinmenttime);
    fd.append('appointmentdetails', current.appoinmentdetails);

    fetch('http://192.168.0.106:5000/update/appoinment', { method: 'POST', body: fd })
      .then(res => res.json())
      .then(() => {
        setAppointments(prev => prev.map(a => a.uid === current.uid ? current : a));
        setUpcoming(prev => prev.map(a => a.uid === current.uid ? current : a));
        showPopup('success', 'Appointment updated');
      })
      .catch(() => showPopup('error', 'Update failed'))
      .finally(() => {
        setActionLoading(false);
        setIsEditing(false);
      });
  };

  return (
    <div className="dashboard-container-appointment">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
        <main className="appointment-main" style={{ backgroundColor: '#f0f7ff'}}>
          <h2>Select Department For Appointment Booking</h2>

          <section className="departments">
            {departments.map(d => (
              <div
                key={d.id}
                className="dept-card"
                onClick={() => navigate(`/appointment/${d.id}`)}
                tabIndex={0}
                role="button"
                onKeyPress={e => e.key === 'Enter' && navigate(`/appointment/${d.id}`)}
              >
                <div className="dept-icon">{d.icon}</div>
                <div className="dept-name">{d.name}</div>
              </div>
            ))}
          </section>

          {loading && (
            <div className="modal-overlay-appointment">
              <div className="modal-content-appointment"  style={{ backgroundColor: '#e0f7fa'}}>
                <FaSpinner className="spin large" />
                <p>Loading appointments...</p>
              </div>
            </div>
          )}

          {!loading && (
            <>
              {isEditing && (
                <section className="edit-form">
                  <h3>Edit Appointment</h3>
                  <form onSubmit={submitEdit} style={{ backgroundColor: '#e0f7fa'}}>
                    <label htmlFor="appt-time">Time:</label>
                    <input
                      id="appt-time"
                      type="datetime-local"
                      value={current.appoinmenttime}
                      onChange={e => setCurrent({ ...current, appoinmenttime: e.target.value })}
                      required
                    />
                    <label htmlFor="appt-details">Details:</label>
                    <textarea
                      id="appt-details"
                      rows="3"
                      value={current.appoinmentdetails}
                      onChange={e => setCurrent({ ...current, appoinmentdetails: e.target.value })}
                      required
                    />
                    {/* <div className="edit-buttons">
                      <button type="submit" disabled={actionLoading}>
                        {actionLoading ? <FaSpinner className="spin" /> : 'Update'}
                      </button>
                      <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div> */}
                    <div className="edit-buttons">
  <button type="submit" disabled={actionLoading} >
    {actionLoading ? (
      <FaSpinner className="spin" />
    ) : (
      <>
        <FaEdit style={{ color: 'yellow', marginRight: '6px' }} />
       
      </>
    )}
  </button>
  <button type="button" onClick={() => setIsEditing(false)}>
    <FaTimes style={{ color: 'red', marginRight: '6px' }} />
    
  </button>
</div>

                  </form>
                </section>
              )}

              <section className="appointments-container">
                <aside className="upcoming-section">
                  <h3>Upcoming Appointments</h3>
                  {upcoming.length === 0 ? (
                    <p>No upcoming appointments</p>
                  ) : (
                    upcoming.map(a => (
                      <article key={a.uid} className="upcoming-card" style={{ backgroundColor: '#fff9c4' }}>
                        <div className="upcoming-info">
                          <time>{new Date(a.appoinmenttime).toLocaleString()}</time>
                          <p>with <strong>{a.doctor_fullname}</strong></p>
                        </div>
                        <div className="upcoming-actions">
                          <button
                            className="btn-icon"
                            onClick={() => handleEdit(a)}
                            title="Edit appointment"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </aside>

                <section className="history-section">
                  <h3>Appointment History</h3>
                
                  <table className="history-tables" style={{ width: '100%' }}>
  <thead>
    <tr>
      <th className="history-table" style={{ backgroundColor: '#87CEEB' }}>ID</th>
      <th style={{ backgroundColor: '#87CEEB' }}>Time</th>
      <th style={{ backgroundColor: '#87CEEB' }}>Doctor</th>
      <th style={{ backgroundColor: '#87CEEB' }}>Details</th>
      <th style={{ backgroundColor: '#87CEEB' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {appointments.length === 0 ? (
      <tr>
        <td
          colSpan="5"
          style={{
            textAlign: 'center',
            padding: '50px 20px',
            fontSize: '1.5rem',
            color: '#555',
            backgroundColor: '#e8f6fc', 
            fontWeight: '500',
            letterSpacing: '0.5px'
          }}
        >
          📅 No Appointment History Found
        </td>
      </tr>
    ) : (
      appointments.map(a => (
        <tr key={a.uid}>
          <td data-label="ID">{a.uid}</td>
          <td data-label="Time">{new Date(a.appoinmenttime).toLocaleString()}</td>
          <td data-label="Doctor">{a.doctor_fullname}</td>
          <td data-label="Details">{a.appoinmentdetails}</td>
          <td data-label="Actions" className="action-buttons">
            <button className="btnn-iconn" onClick={() => handleEdit(a)} title="Edit">
              <FaEdit />
            </button>
            <button
              className="btn-icon btn-deletee"
              onClick={() => handleDelete(a.uid)}
              disabled={actionLoading}
              title="Delete"
            >
              <FaTrash />
            </button>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

                </section>
              </section>
            </>
          )}
        </main>
      </div>

      {popup && (
        <div className={`popup ${popup.type}`}>
          {popup.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{popup.msg}</span>
        </div>
      )}
    </div>
  );
};

export default Appointment;
