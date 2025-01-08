import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaCalendar, FaEdit, FaTrash } from 'react-icons/fa'; 
import './DoctorAppointment.css';  // Custom styling for appointment management
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';

const DoctorAppointmentManagement = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: 'John Doe', date: '2025-01-10', time: '10:00 AM', status: 'Pending' },
    { id: 2, patientName: 'Jane Smith', date: '2025-01-12', time: '2:00 PM', status: 'Confirmed' },
  ]);

  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: '',
    time: '',
    status: 'Pending',
  });

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Open modal for creating a new appointment or editing an existing one
  const handleShow = (appointment = null) => {
    setEditingAppointment(appointment);
    setNewAppointment(appointment || { patientName: '', date: '', time: '', status: 'Pending' });
    setShowModal(true);
  };

  // Close modal
  const handleClose = () => setShowModal(false);

  // Handle input changes for creating or editing appointments
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new appointment
  const handleAddAppointment = () => {
    setAppointments((prevAppointments) => [
      ...prevAppointments,
      { ...newAppointment, id: prevAppointments.length + 1 },
    ]);
    setShowModal(false);
  };

  // Edit an existing appointment
  const handleEditAppointment = () => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === editingAppointment.id ? { ...editingAppointment, ...newAppointment } : appointment
      )
    );
    setShowModal(false);
  };

  // Delete an appointment
  const handleDeleteAppointment = (id) => {
    setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== id));
  };

  return (
    <div className="dashboard-container">
    {/* Navbar at the top */}
    <DoctorNavbar />
    
    <div className="dashboard-content">
      {/* Sidebar for navigation */}
      <Doctorsidebar />
    <div className="doctor-appointment-container">
      <h2>Manage Appointments</h2>
      <Button variant="primary" onClick={() => handleShow()}>Add Appointment</Button>

      <div className="appointment-list">
        <h3>Appointments</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.id}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.status}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShow(appointment)}><FaEdit /> Edit</Button>
                  <Button variant="danger" onClick={() => handleDeleteAppointment(appointment.id)}><FaTrash /> Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding or editing appointment */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAppointment ? 'Edit Appointment' : 'Add Appointment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPatientName">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter patient name"
                name="patientName"
                value={newAppointment.patientName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newAppointment.date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={newAppointment.time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newAppointment.status}
                onChange={handleChange}
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Cancelled</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={editingAppointment ? handleEditAppointment : handleAddAppointment}>
            {editingAppointment ? 'Save Changes' : 'Add Appointment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
    </div>
  );
};

export default DoctorAppointmentManagement;
