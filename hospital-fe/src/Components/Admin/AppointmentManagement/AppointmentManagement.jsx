import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { FaEdit, FaTrashAlt, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import './AppointmentManagement.css';
import { Button } from 'react-bootstrap';
const iconMap = {
  Cardiology: '❤️',
  Neurology: '🧠',
  Orthopedics: '🦴',
  Dermatology: '🧴',
  Pediatrics: '👶',
  Surgery: '🔪',
};

// Capitalize helper (safe version)
const capitalize = (str) =>
  typeof str === 'string' && str.length > 0
    ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    : '';

// Status mapping
const statusDisplayMap = {
  applied: 'Booked',
  booked: 'Booked',
  confirmed: 'Booked',
  completed: 'Completed',
  cancelled: 'Cancelled',
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
  const [filterStatus, setFilterStatus] = useState('All');

  // Auth
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

  // Fetch data
  useEffect(() => {
    Promise.all([
      fetch('http://192.168.0.106:5000/facilityops/getallfacility').then(r => r.json()),
      fetch('http://192.168.0.106:5000/getallappoinment').then(r => r.json())
    ])
      .then(([deptData, apptData]) => {
        setDepartments(deptData.data || []);
        const sortedAppointments = (apptData.data || []).sort((a, b) =>
          new Date(b.appoinmenttime) - new Date(a.appoinmenttime)
        );
        setAppointments(sortedAppointments);
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

  const isPastAppointmentTime = (apptTimeStr) => {
    const now = new Date();
    const apptTime = new Date(apptTimeStr);
    return apptTime <= now;
  };

  const saveEdit = e => {
    e.preventDefault();
    const { uid, appoinmenttime, appoinmentdetails, appoinmentstatus } = selectedAppointment;

    if (
      appoinmentstatus.toLowerCase() === 'completed' &&
      !isPastAppointmentTime(appoinmenttime)
    ) {
      alert('Cannot mark appointment as Completed before the scheduled date and time.');
      return;
    }

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

  const filteredAppointments = appointments.filter(appt => {
    const matchDept = selectedDept ? appt.department_uid === selectedDept : true;
    const displayStatus = statusDisplayMap[appt.appoinmentstatus?.toLowerCase()] || capitalize(appt.appoinmentstatus);
    const matchStatus = filterStatus === 'All' ? true : displayStatus === filterStatus;
    return matchDept && matchStatus;
  });

  return (
    <div className="dashboard-container appointment-admin">
      <AdminNavbar />
      <div className="dashboard-content">
        <AdminSidebar />

        <div className="appointment-admin__content">
          {loading ? (
            <div className="full-loading-spinner">
              <FaSpinner className="spin large" />
            </div>
          ) : (
            <>
              <div className="appointment-admin__inner">
                <h2>Manage Appointments</h2>

                <section className="dept-select">
                  <h3>Select Department For Appointment Booking</h3>
                  <div className="departments-container">
                    {departments.length === 0 ? (
                      <p>No departments available</p>
                    ) : (
                      departments.map(dept => (
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

                <section className="filter-section" style={{ marginTop: '20px' }}>
                  <label htmlFor="statusFilter" style={{ marginRight: '10px' }}>Filter by status:</label>
                  <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: '6px 12px', fontSize: '16px' }}
                  >
                    <option value="All">All</option>
                    <option value="Booked">Booked</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </section>
 <Button
    variant="info"
    onClick={() => navigate('/admin/doctor/slot-patients')}
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
   Doctor Wise Patient List by Slot
  </Button>
                <section className="appt-list" style={{ marginTop: '20px' }}>
                  <h3>Appointments</h3>
                  {filteredAppointments.length === 0 ? (
                    <p>No appointments found.</p>
                  ) : (
                    <div className="appt-cards">
                      {filteredAppointments.map(a => {
                        const displayStatus = statusDisplayMap[a.appoinmentstatus?.toLowerCase()] || capitalize(a.appoinmentstatus);
                        return (
                          <div key={a.uid} className="appt-card">
                            <div><strong>Doctor Name:</strong> {capitalize(a.doctor_fullname) || 'N/A'}</div>
                            <div><strong>Specialization:</strong> {capitalize(a.doctor_specialization)}</div>
                            <div><strong>Patient Name:</strong> {capitalize(a.patient_firstname)} {capitalize(a.patient_lastname)}</div>
                            <div><strong> Appointment Time:</strong> {a.appoinmenttime}</div>
                            <div><strong>Details:</strong> {a.appoinmentdetails}</div>
                            <div><strong>Status:</strong> {displayStatus}</div>
                            <div className="actions" style={{ marginTop: '10px' }}>
                              <FaEdit className="btn-editt" onClick={() => openEdit(a)} style={{ cursor: 'pointer', marginRight: '10px' }} />
                              {displayStatus === 'Completed' && (
                                <FaTrashAlt className="btn-deletee" onClick={() => deleteAppt(a.uid)} style={{ cursor: 'pointer' }} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              {isEditing && selectedAppointment && (
                <div className="edit-modal">
                  <form
                    onSubmit={saveEdit}
                    className="modal-form"
                    style={{
                      backgroundColor: "#e0f7fa",
                      padding: "20px",
                      borderRadius: "8px",
                    }}
                  >
                    <h3>Edit Appointment</h3>
                    <label>ID</label>
                    <input type="text" value={selectedAppointment.uid} readOnly />
                    <label>Time</label>
                    <input
                      name="appoinmenttime"
                      type="datetime-local"
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
                      <option value={selectedAppointment.appoinmentstatus}>
                        {statusDisplayMap[selectedAppointment.appoinmentstatus?.toLowerCase()] || capitalize(selectedAppointment.appoinmentstatus)}
                      </option>
                      {['booked', 'completed', 'cancelled']
                        .filter(status => status !== selectedAppointment.appoinmentstatus?.toLowerCase())
                        .map(status => (
                          <option key={status} value={status}>
                            {capitalize(status)}
                          </option>
                        ))}
                    </select>

                    <div className="modal-actions" style={{ marginTop: '15px' }}>
                      <button type="submit" title="Save"><FaSave /></button>
                      <button type="button" onClick={closeEdit} title="Cancel"><FaTimes /> </button>
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
