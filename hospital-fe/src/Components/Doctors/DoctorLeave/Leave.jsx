import React, { useState } from 'react';
import { Form, Button, Alert, Table } from 'react-bootstrap';
import axios from 'axios';
import './Leave.css'; // Import the corresponding CSS
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';

const ApplyLeave = ({ doctorId }) => {
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // To toggle the form visibility
  const [leaveRequests, setLeaveRequests] = useState([ // Dummy data for leave requests
    { id: 1, leaveFrom: '2025-01-10', leaveTo: '2025-01-12', reason: 'Vacation' },
    { id: 2, leaveFrom: '2025-02-05', leaveTo: '2025-02-10', reason: 'Medical' },
  ]);

  // Toggle form visibility when clicking "Apply for Leave"
  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    // Validate form fields
    if (!leaveReason || !leaveFrom || !leaveTo) {
      setErrorMessage('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('doctorId', doctorId);
    formData.append('leaveFrom', leaveFrom);
    formData.append('leaveTo', leaveTo);
    formData.append('reason', leaveReason);

    try {
      const response = await axios.post('http://localhost:5000/doctors/leave', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success response
      if (response.status === 200) {
        setSuccessMessage('Leave request submitted successfully.');
        setLeaveRequests([
          ...leaveRequests,
          { id: leaveRequests.length + 1, leaveFrom, leaveTo, reason: leaveReason },
        ]);
        setShowForm(false); // Close the form after submitting
      }
    } catch (error) {
      // Handle error response
      setErrorMessage(error.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete leave request
  const handleDelete = (id) => {
    // API request to delete leave (you can modify this to make a backend call)
    setLeaveRequests(leaveRequests.filter((leave) => leave.id !== id));
    setSuccessMessage('Leave request deleted successfully.');
  };

  // Handle edit leave request (for demonstration, you can modify this to make API calls)
  const handleEdit = (id) => {
    const leaveToEdit = leaveRequests.find((leave) => leave.id === id);
    setLeaveReason(leaveToEdit.reason);
    setLeaveFrom(leaveToEdit.leaveFrom);
    setLeaveTo(leaveToEdit.leaveTo);
    setShowForm(true);
  };

  return (
    <div className="dashboard-container">
    {/* Navbar at the top */}
    <DoctorNavbar />
    
    <div className="dashboard-content">
      {/* Sidebar for navigation */}
      <Doctorsidebar />
    <div className="apply-leave-container">
      <h2>Leave Management</h2>

      {/* Button to open the "Apply for Leave" form */}
      <Button variant="primary" onClick={handleToggleForm}>
        {showForm ? 'Close Leave Form' : 'Apply for Leave'}
      </Button>

      {/* Display the success or error message */}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {/* Apply Leave Form */}
      {showForm && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="leaveReason">
            <Form.Label>Reason for Leave</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={leaveReason}
              onChange={(e) => setLeaveReason(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="leaveFrom">
            <Form.Label>Leave From</Form.Label>
            <Form.Control
              type="date"
              value={leaveFrom}
              onChange={(e) => setLeaveFrom(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="leaveTo">
            <Form.Label>Leave To</Form.Label>
            <Form.Control
              type="date"
              value={leaveTo}
              onChange={(e) => setLeaveTo(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Submitting Leave...' : 'Submit Leave Request'}
          </Button>
        </Form>
      )}

      {/* Table displaying existing leave requests */}
      <h3>All Leave Requests</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Leave From</th>
            <th>Leave To</th>
            <th>Reason</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.leaveFrom}</td>
              <td>{leave.leaveTo}</td>
              <td>{leave.reason}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(leave.id)} className="mr-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(leave.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    </div>
    </div>
  );
};

export default ApplyLeave;
