
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Appointment.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const Appointment = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [departments, setDepartments] = useState([]); // ✅ dynamic departments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // 🔄 Fetch patient ID from token
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    try {
      const decodedToken = jwtDecode(accessToken);
      setPatientId(decodedToken.userid);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // 🔄 Fetch appointments
  useEffect(() => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('patientid', patientId);

    fetch('http://192.168.0.106:5000/getappoinmenthistory', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const appointmentData = Array.isArray(data.data) ? data.data : [data.data];
        setAppointments(appointmentData.filter(Boolean));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch appointments');
        setLoading(false);
      });

    fetch('http://192.168.0.106:5000/getappoinmentdetails', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        const upcomingData = Array.isArray(data.data) ? data.data : [data.data];
        setUpcomingAppointments(upcomingData.filter(Boolean));
      })
      .catch(() => {
        setError('Failed to fetch upcoming appointments');
      });
  }, [patientId]);

  // ✅ Fetch departments dynamically
  useEffect(() => {
    fetch('http://192.168.0.106:5000/facilityops/getallfacility')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const departmentsWithIcons = data.data.map((dept, index) => ({
            ...dept,
            id: dept.department_name.toLowerCase(),
            name: dept.department_name,
            icon: assignDepartmentIcon(dept.department_name, index),
          }));
          setDepartments(departmentsWithIcons);
        }
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
      });
  }, []);

  // 🎯 Icon assignment logic
  const assignDepartmentIcon = (name, index) => {
    const iconMap = {
      Cardiology: '❤️',
      Neurology: '🧠',
      Orthopedics: '💪',
      Dermatology: '🧴',
      Pediatrics: '👶',
      Surgery: '🔪',
    };
    const fallbackIcons = ['🏥', '🩺', '🔬', '💊', '📋', '🧬'];
    return iconMap[name] || fallbackIcons[index % fallbackIcons.length];
  };

  const handleDepartmentClick = (departmentId) => {
    navigate(`/appointment/${departmentId}`);
  };

  const handleDeleteAppointment = (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    const formData = new FormData();
    formData.append('appoinid', appointmentId);

    fetch('http://192.168.0.106:5000/ops/appoinmentdelete', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setAppointments((prev) => prev.filter((a) => a.uid !== appointmentId));
          setUpcomingAppointments((prev) => prev.filter((a) => a.uid !== appointmentId));
        } else {
          alert('Failed to delete appointment');
        }
      })
      .catch(() => alert('Failed to delete appointment'));
  };

  const handleEditAppointment = (appointment) => {
    setIsEditing(true);
    setCurrentAppointment({ ...appointment });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('appoinid', currentAppointment.uid);
    formData.append('appoinmenttime', currentAppointment.appoinmenttime);
    formData.append('appointmentdetails', currentAppointment.appoinmentdetails);

    fetch('http://192.168.0.106:5000/update/appoinment', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert('Appointment updated successfully');
          setAppointments((prev) =>
            prev.map((a) => (a.uid === currentAppointment.uid ? currentAppointment : a))
          );
          setUpcomingAppointments((prev) =>
            prev.map((a) => (a.uid === currentAppointment.uid ? currentAppointment : a))
          );
        } else {
          alert('Failed to update appointment');
        }
        setIsEditing(false);
        setCurrentAppointment(null);
      })
      .catch(() => alert('Failed to update appointment'));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const renderAppointmentTable = (appointmentsList) => {
    if (!appointmentsList || appointmentsList.length === 0) {
      return <div>No appointments found.</div>;
    }

    return (
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Appointment Time</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointmentsList.map(
            (appointment) =>
              appointment && (
                <tr key={appointment.uid}>
                  <td>{appointment.uid}</td>
                  <td>{appointment.patient_firstname} {appointment.patient_lastname}</td>
                  <td>{appointment.doctor_fullname}</td>
                  <td>{appointment.appoinmenttime}</td>
                  <td>{appointment.appoinmentdetails}</td>
                  <td>
                    <button onClick={() => handleEditAppointment(appointment)}>Edit</button>
                    <button onClick={() => handleDeleteAppointment(appointment.uid)}>Delete</button>
                  </td>
                </tr>
              )
          )}
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

          {isEditing && currentAppointment && (
            <div className="edit-appointment-form">
              <h3>Edit Appointment</h3>
              <form onSubmit={handleSubmitEdit}>
                <label>Appointment Time:</label>
                <input
                  type="datetime-local"
                  name="appoinmenttime"
                  value={currentAppointment.appoinmenttime}
                  onChange={handleInputChange}
                  required
                />
                <label>Details:</label>
                <textarea
                  name="appoinmentdetails"
                  value={currentAppointment.appoinmentdetails}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
                <button type="submit">Update</button>
                <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
              </form>
            </div>
          )}

          <div className="appointment-details-container">
            <h3>Upcoming Appointments</h3>
            {loading ? <div>Loading...</div> : error ? <div>{error}</div> : renderAppointmentTable(upcomingAppointments)}
          </div>

          <div className="appointment-details-container">
            <h3>All Appointments</h3>
            {loading ? <div>Loading...</div> : error ? <div>{error}</div> : renderAppointmentTable(appointments)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
