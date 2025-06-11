
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './DoctorAppointment.css';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const DoctorAppointmentManagement = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: '',
    time: '',
    status: 'Pending',
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleShow = (appointment) => {
    if (!appointment) return;

    setEditingAppointment(appointment);
    setNewAppointment({
      patientName: `${appointment.patient_firstname} ${appointment.patient_lastname}`,
      date: appointment.appoinmentdate,
      time: appointment.appoinmenttime,
      status: appointment.appoinmentstatus,
    });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAppointment = async () => {
    if (!editingAppointment?.uid) return;

    const formData = new FormData();
    formData.append('appoinid', editingAppointment.uid);
    formData.append('appoinmentstatus', newAppointment.status);

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
              ? { ...appt, appoinmentstatus: newAppointment.status }
              : appt
          )
        );
        setShowModal(false);
      } else {
        alert('Failed to update appointment');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

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
      if (data.success) {
        setAppointments((prev) => prev.filter((appt) => appt.uid !== appoinid));
      } else {
        alert('Failed to cancel appointment');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <DoctorNavbar />
      <div className="dashboard-content">
        <Doctorsidebar />
        <div className="doctor-appointment-container">
          <h2>Manage Appointments</h2>
          <div className="appointment-list">
            <h3>Appointments</h3>
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
                {appointments.length > 0 ? (
                  appointments.map((appointment) =>
                    appointment?.uid ? (
                      <tr key={appointment.uid}>
                        <td>{appointment.uid}</td>
                        <td>
                          {appointment.patient_firstname} {appointment.patient_lastname}
                        </td>
                        <td>{appointment.appoinmenttime}</td>
                        <td>{appointment.appoinmentstatus}</td>
                        <td>
                          <Button
                            variant="warning"
                            onClick={() => handleShow(appointment)}
                            style={{ marginRight: '10px' }}
                          >
                            <FaEdit /> Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleCancelAppointment(appointment.uid)}
                          >
                            <FaTrash /> Delete
                          </Button>
                        </td>
                      </tr>
                    ) : null
                  )
                ) : (
                  <tr>
                    <td colSpan="5">No appointments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Appointment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formAppointmentId">
                  <Form.Label>Appointment ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={editingAppointment?.uid || ''}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formPatientName">
                  <Form.Label>Patient Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newAppointment.patientName}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formDate">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newAppointment.date}
                    onChange={handleChange}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formTime">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={newAppointment.time}
                    onChange={handleChange}
                    disabled
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
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleEditAppointment}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentManagement;
