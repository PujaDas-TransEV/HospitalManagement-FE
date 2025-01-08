import React, { useState } from 'react';
import './AppointmentManagement.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const AdminAppointmentManagement = () => {
  const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology'];
  const doctorsData = {
    Cardiology: [
      { id: 1, name: 'Dr. John Doe', available: true },
      { id: 2, name: 'Dr. Alice Smith', available: false },
    ],
    Neurology: [
      { id: 3, name: 'Dr. William Brown', available: true },
      { id: 4, name: 'Dr. Emma White', available: true },
    ],
    Orthopedics: [
      { id: 5, name: 'Dr. Robert Green', available: true },
    ],
    Dermatology: [
      { id: 6, name: 'Dr. Jessica Black', available: true },
    ],
  };

  const [appointments, setAppointments] = useState([
    { id: 1, patientName: 'John Smith', department: 'Cardiology', doctor: 'Dr. John Doe', date: '2025-01-15', time: '10:00 AM', status: 'Pending' },
    { id: 2, patientName: 'Jane Doe', department: 'Neurology', doctor: 'Dr. William Brown', date: '2025-01-16', time: '2:00 PM', status: 'Confirmed' },
  ]);
  
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    department: 'Cardiology',
    doctor: '',
    date: '',
    time: '',
    status: 'Pending',
  });

  const handleChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  const handleAddAppointment = () => {
    setAppointments([
      ...appointments,
      { ...newAppointment, id: appointments.length + 1 },
    ]);
    setNewAppointment({ patientName: '', department: 'Cardiology', doctor: '', date: '', time: '', status: 'Pending' });
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  const handleEditAppointment = (appointment) => {
    setNewAppointment(appointment);
  };

  return (
    <div className="dashboard-container">
      <AdminNavbar /> {/* Navbar for admin */}

      <div className="dashboard-content">
        <AdminSidebar /> {/* Sidebar for admin navigation */}

        <div className="admin-appointment-container">
          <h2 className="page-title">Admin Appointment Management</h2>

          <div className="appointment-form">
            <h3>{newAppointment.id ? 'Edit Appointment' : 'Add New Appointment'}</h3>
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={newAppointment.patientName}
              onChange={handleChange}
            />
            <select
              name="department"
              value={newAppointment.department}
              onChange={handleChange}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              name="doctor"
              value={newAppointment.doctor}
              onChange={handleChange}
            >
              {doctorsData[newAppointment.department]?.map((doctor) => (
                <option key={doctor.id} value={doctor.name}>
                  {doctor.name} ({doctor.available ? 'Available' : 'Not Available'})
                </option>
              ))}
            </select>
            <input
              type="date"
              name="date"
              value={newAppointment.date}
              onChange={handleChange}
            />
            <input
              type="time"
              name="time"
              value={newAppointment.time}
              onChange={handleChange}
            />
            <select
              name="status"
              value={newAppointment.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              className="add-btn"
              onClick={handleAddAppointment}
            >
              {newAppointment.id ? 'Save Appointment' : 'Add Appointment'}
            </button>
          </div>

          <div className="appointments-list">
            <h3>Appointments List</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th> {/* Added Appointment ID Column */}
                  <th>Patient Name</th>
                  <th>Department</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td> {/* Displaying Appointment ID */}
                    <td>{appointment.patientName}</td>
                    <td>{appointment.department}</td>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <button onClick={() => handleEditAppointment(appointment)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDeleteAppointment(appointment.id)} className="delete-btn">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentManagement;
