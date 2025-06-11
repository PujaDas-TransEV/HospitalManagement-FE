
import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './DoctorAppointment.css';  // Custom styling for appointment management
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar'; // Corrected import for DoctorNavbar
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';
import { jwtDecode } from 'jwt-decode'; // Ensure jwt-decode is installed
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const DoctorAppointmentManagement = () => {
  const navigate = useNavigate(); // Use the navigate hook
  const [appointments, setAppointments] = useState([]); // State to store appointments fetched from API
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: '',
    time: '',
    status: 'Pending',
  });
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [doctorId, setDoctorId] = useState(null); // Store doctorId here

  // Fetch doctorId from the access token and decode it
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const accessToken = localStorage.getItem('accessToken'); // Get the token from localStorage

      if (!accessToken) {
        navigate('/login'); // Redirect if no token is found in localStorage
        return;
      }

      try {
        // Decode the access token to get doctorId (assuming 'doctorid' is the key in your token)
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid; // Adjust the key name based on your token structure

        setDoctorId(doctorId); // Set doctorId from the decoded token
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login'); // Redirect to login if token decoding fails
      }
    };

    fetchDoctorProfile();
  }, [navigate]); // Ensure that `navigate` is included in the dependency array

  // Fetch appointments when doctorId is available
  useEffect(() => {
    if (doctorId) {
      // Fetch all appointments for the doctor
      const formData = new FormData();
      formData.append('doctorid', doctorId); // Append doctorId to form data

      fetch('http://192.168.0.105:5000/getappoinmenthistory', {
        method: 'POST',
        body: formData, // Send the form data with doctorId
      })
        .then((response) => response.json())
        .then((data) => {
          const appointmentData = Array.isArray(data.data) ? data.data : [data.data]; // Handle both array and object response structures
          setAppointments(appointmentData); // Set all appointments
        })
        .catch((error) => {
          console.error('Error fetching appointments:', error);
        });
    }
  }, [doctorId]); // Re-fetch appointments whenever doctorId changes

  // Open modal for editing an existing appointment
  const handleShow = (appointment = null) => {
    setEditingAppointment(appointment);
    setNewAppointment({
      patientName: `${appointment.patient_firstname} ${appointment.patient_lastname}`, // Set patient name
      date: appointment.appoinmentdate, // Set appointment date
      time: appointment.appoinmenttime, // Set appointment time
      status: appointment.appoinmentstatus, // Set current status
    });
    setShowModal(true);
  };

  // Close modal
  const handleClose = () => setShowModal(false);

  // Handle input changes for editing appointment
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  // Edit an existing appointment (update the status)
  const handleEditAppointment = async () => {
    const formData = new FormData();
    formData.append('appoinid', editingAppointment.uid);  // Send appoinid (appointment ID)
    formData.append('appoinmentstatus', newAppointment.status); // Send the new status

    try {
      const response = await fetch('http://192.168.0.105:5000/update/appoinment', {
        method: 'POST',
        body: formData,  // Use FormData for multipart/form-data request
      });

      const data = await response.json();
      if (data.message) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.uid === editingAppointment.uid ? { ...appointment, appoinmentstatus: newAppointment.status } : appointment
          )
        );
        setShowModal(false);  // Close modal after successful update
      } else {
        alert('Appointment Update Successfully');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };



  // Cancel an appointment (using `uid` as `appoinid`)
  const handleCancelAppointment = async (appoinid) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        const formData = new FormData();
        formData.append('appoinid', appoinid); // Sending the appoinid to cancel

        const response = await fetch('http://192.168.0.105:5000/ops/appoinmentdelete', {
          method: 'POST',
          body: formData, // Sending the appointment id to cancel
        });

        const data = await response.json();
        if (data.success) {
          setAppointments((prevAppointments) =>
            prevAppointments.filter((appointment) => appointment.uid !== appoinid)
          );
        } else {
          alert('Appointment Cancelled Successfully');
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
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
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.uid}</td>
                    <td>{appointment.patient_firstname} {appointment.patient_lastname}</td>
                    <td>{appointment.appoinmenttime}</td>
                    <td>{appointment.appoinmentstatus}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleShow(appointment)} style={{ marginRight: '10px' }}>
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleCancelAppointment(appointment.uid)} // Use uid as appoinid
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for editing appointment */}
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header  >
              <Modal.Title>Edit Appointment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formAppointmentId">
                  <Form.Label>Appointment ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="appointmentId"
                    value={editingAppointment?.uid}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formPatientName">
                  <Form.Label>Patient Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Patient name"
                    name="patientName"
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
                    <option>Select Status</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}   style={{ marginRight: '10px' }} >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleEditAppointment} // Only use handleEditAppointment for editing
              >
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
