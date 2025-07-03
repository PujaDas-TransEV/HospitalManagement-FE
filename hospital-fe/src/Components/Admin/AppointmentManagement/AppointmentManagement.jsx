import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { FaEdit, FaTrashAlt, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import './AppointmentManagement.css';

const iconMap = {
  Cardiology: '❤️',
  Neurology: '🧠',
  Orthopedics: '🦴',
  Dermatology: '🧴',
  Pediatrics: '👶',
  Surgery: '🔪',
};

const AdminAppointments = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState(departmentId || '');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/admin/login');
    try {
      const { userid } = jwtDecode(token);
      console.log('Admin ID:', userid);
    } catch {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Load departments and appointments in parallel
  useEffect(() => {
    Promise.all([
      fetch('http://192.168.0.106:5000/facilityops/getallfacility').then(r => r.json()),
      fetch('http://192.168.0.106:5000/getallappoinment').then(r => r.json())
    ])
      .then(([deptData, apptData]) => {
        setDepartments(deptData.data || []);
        setAppointments(apptData.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDept = uid => {
    setSelectedDept(uid);
    navigate(`/admin/appointments/${uid}`);
  };

  const openEdit = appt => {
    setSelectedAppointment(appt);
    setIsEditing(true);
  };

  const closeEdit = () => {
    setSelectedAppointment(null);
    setIsEditing(false);
  };

  const saveEdit = e => {
    e.preventDefault();
    const { uid, appoinmenttime, appoinmentdetails, appoinmentstatus } = selectedAppointment;
    const fm = new FormData();
    fm.append('appoinid', uid);
    fm.append('appoinmenttime', appoinmenttime);
    fm.append('appoinmentdetails', appoinmentdetails);
    fm.append('appoinmentstatus', appoinmentstatus);

    fetch('http://192.168.0.106:5000/update/appoinment', { method: 'POST', body: fm })
      .then(r => r.json())
      .then(d => {
        if (d.message) {
          setAppointments(prev =>
            prev.map(a => (a.uid === uid ? selectedAppointment : a))
          );
          alert('Updated successfully');
          closeEdit();
        } else throw new Error();
      })
      .catch(() => alert('Update failed'));
  };

  const deleteAppt = uid => {
    if (!window.confirm('Delete this appointment?')) return;
    const fm = new FormData();
    fm.append('appoinid', uid);
    fetch('http://192.168.0.106:5000/ops/appoinmentdelete', { method: 'POST', body: fm })
      .then(r => r.json())
      .then(d => {
        if (d.message) {
          setAppointments(prev => prev.filter(a => a.uid !== uid));
          alert('Deleted successfully');
        } else throw new Error();
      })
      .catch(() => alert('Delete failed'));
  };

  return (
    <div className="dashboard-container appointment-admin">
      <AdminNavbar />
      <div className="dashboard-content">
        <AdminSidebar />

        <div className="appointment-admin__content">
          {loading ? (
            <div className="full-loading-spinner">
              <FaSpinner className="spin large" />
              {/* <p>Loading data...</p> */}
            </div>
          ) : (
            <>
              <div className="appointment-admin__overlay" />

              <div className="appointment-admin__inner">
                <h2>Manage Appointments</h2>

                <section className="dept-select">
                  <h3>Select Department For Appointment Booking</h3>
                  <div className="departments-container">
                    {departments.length === 0 ? (
                      <p>No departments available</p>
                    ) : (
                      departments.map((dept) => (
                        <div
                          key={dept.uid}
                          className={`department-card ${selectedDept === dept.uid ? 'active' : ''}`}
                          onClick={() => handleDept(dept.uid)}
                        >
                          <span className="icon">{iconMap[dept.department_name] || '🏥'}</span>
                          <span className="name">{dept.department_name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="appt-list">
                  <h3>All Appointments</h3>
                  {appointments.length === 0 ? (
                    <p>No appointments found.</p>
                  ) : (
                    <div className="appt-cards">
                      {appointments.map(a => (
                        <div key={a.uid} className="appt-card">
                          <div><strong>{a.uid}</strong></div>
                          <div><em>{a.doctor_specialization || 'N/A'}</em></div>
                          <div>{a.patient_firstname} {a.patient_lastname}</div>
                          <div>{a.appoinmenttime}</div>
                          <div>{a.appoinmentdetails}</div>
                          <div>Status: {a.appoinmentstatus}</div>
                          <div className="actions">
                            <FaEdit className="btn-edit" onClick={() => openEdit(a)} />
                            <FaTrashAlt className="btn-delete" onClick={() => deleteAppt(a.uid)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {isEditing && (
                <div className="edit-modal">
                  <form onSubmit={saveEdit} className="modal-form" style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px",
        }}>
                    <h3>Edit Appointment</h3>
                    <label>ID</label>
                    <input type="text" value={selectedAppointment.uid} readOnly />
                    <label>Time</label>
                    <input
                      name="appoinmenttime"
                      value={selectedAppointment.appoinmenttime}
                      onChange={e =>
                        setSelectedAppointment({ ...selectedAppointment, appoinmenttime: e.target.value })
                      }
                    />
                    <label>Details</label>
                    <input
                      name="appoinmentdetails"
                      value={selectedAppointment.appoinmentdetails}
                      onChange={e =>
                        setSelectedAppointment({ ...selectedAppointment, appoinmentdetails: e.target.value })
                      }
                    />
                   
                    <label>Status</label>
<select
  name="appoinmentstatus"
  value={selectedAppointment.appoinmentstatus}
  onChange={e =>
    setSelectedAppointment({ ...selectedAppointment, appoinmentstatus: e.target.value })
  }
>
  {/* First option is the current status */}
  <option value={selectedAppointment.appoinmentstatus}>
    {selectedAppointment.appoinmentstatus}
  </option>

  {/* Other options excluding the current status */}
  {['Confirmed', 'Completed', 'Cancelled']
    .filter(status => status !== selectedAppointment.appoinmentstatus)
    .map(status => (
      <option key={status} value={status}>
        {status}
      </option>
    ))}
</select>

                    <div className="modal-actions">
                      <button type="submit"><FaSave /></button>
                      <button type="button" onClick={closeEdit}><FaTimes /> </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
