
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Spinner, Alert, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { FaHeart, FaBrain, FaUserMd, FaSyringe, FaStethoscope } from 'react-icons/fa';  // Example icons
import './Department.css';
import AdminNavbar from '../../Adminnavbar/AdminNavbar';
import AdminSidebar from '../../Adminsidebar/AdminSidebar';

const DepartmentPage = () => {
  const { specialization } = useParams(); // Get the specialization from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define a mapping for specialization icons
  const specializationIcons = {
    cardiology: <FaHeart />,
    neurology: <FaBrain />,
    surgery: <FaUserMd />,
    dermatology: <FaSyringe />,
    general: <FaStethoscope />,
  };

  // Fetch doctors based on the specialization
  useEffect(() => {
    setLoading(true); // Start loading when the component mounts or specialization changes
    setError(null); // Clear previous errors

    if (!specialization) {
      setError('Specialization is required.');
      setLoading(false);
      return;
    }

    // Create FormData object to send doctorspecialization as multipart/form-data
    const formData = new FormData();
    formData.append('doctorspecialization', specialization);

    // Fetch the doctors data for the specific specialization
    fetch('http://localhost:5000/doctors/getdoctorbyspc', {
      method: 'POST',
      body: formData, // Send FormData as the request body
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Backend response:', data); // Check the data structure

        if (data.error) {
          setError(data.error); // Show API error if returned
        } else if (Array.isArray(data.data) && data.data.length === 0) {
          setError('No doctors available for this specialization.');
        } else {
          setDoctors(data.data); // Set the fetched doctors data to the state
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
        setError('An error occurred while fetching doctors. Please try again.');
        setLoading(false);
      });
  }, [specialization]);

  // Function to handle updating leave status
  const handleLeaveStatusChange = (doctorUid, leaveIndex, newStatus) => {
    // Find the doctor with the given UID
    const updatedDoctors = doctors.map((doctor) => {
      if (doctor.uid === doctorUid) {
        const updatedLeaves = [...doctor.leaves];
        updatedLeaves[leaveIndex] = { ...updatedLeaves[leaveIndex], status: newStatus };
        return { ...doctor, leaves: updatedLeaves };
      }
      return doctor;
    });

    setDoctors(updatedDoctors); // Update the state with modified doctor data

    // Optionally, make an API call to update the status in the database
    const doctor = updatedDoctors.find((doc) => doc.uid === doctorUid); // Find the updated doctor object
    const formData = new FormData();
    formData.append('doctorid', doctorUid);
    formData.append('leavefrom', doctor.leaves[leaveIndex].leavefrom);
    formData.append('leaveto', doctor.leaves[leaveIndex].leaveto);
    formData.append('reason', doctor.leaves[leaveIndex].reason);
    formData.append('status', newStatus);

    fetch('http://localhost:5000/doctors/leaveupdate', {
      method: 'POST',
      body: formData, // Send FormData as the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // Show success message
          alert('Leave status updated successfully');
        }
      })
      .catch((error) => {
        console.error('Error updating leave status:', error);
        setError('Failed to update leave status.');
      });
  };

  // Function to handle the registration of a new doctor
  const handleRegisterDoctor = () => {
    navigate('/doctor-signup'); // Redirect to the doctor signup page
  };

  return (
    <div className="manage-doctors-container">
      <AdminNavbar />
      <div className="manage-doctors-content">
        <AdminSidebar />
        <div className="department-page-container">
          <h2>
            {specialization ? specialization.charAt(0).toUpperCase() + specialization.slice(1) : 'Doctors'} Doctors
          </h2>

          {/* Show error message if there's an error */}
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  {/* Display department icon based on specialization */}
                  <h3>
                    {specializationIcons[specialization] || <FaStethoscope />} {specialization.charAt(0).toUpperCase() + specialization.slice(1)}
                  </h3>
                </Col>
              </Row>

              {/* Button to register a new doctor */}
              <Row className="mb-3">
                <Col>
                  <Button variant="primary" onClick={handleRegisterDoctor}>
                    Register New Doctor
                  </Button>
                </Col>
              </Row>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Specialization</th>
                    <th>Qualification</th>
                    <th>Experience (Years)</th>
                    <th>Address</th>
                    <th>DOB</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>License Number</th>
                    <th>Leave Status</th> {/* New Column for Leave Status */}
                  </tr>
                </thead>
                <tbody>
                  {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                      <tr key={doctor.uid}>
                        <td>{doctor.fullname}</td>
                        <td>{doctor.specialization}</td>
                        <td>{doctor.qualification}</td>
                        <td>{doctor.yoe}</td>
                        <td>{doctor.address}</td>
                        <td>{doctor.dob}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.phonenumber}</td>
                        <td>{doctor.gender}</td>
                        <td>{doctor.license_number}</td>

                        {/* Display leave status for doctor */}
                        <td>
                          {doctor.leaves && doctor.leaves.length > 0 ? (
                            doctor.leaves.map((leave, index) => (
                              <div key={index}>
                                <span>{`From: ${leave.leavefrom} To: ${leave.leaveto}`}</span>
                                <br />
                                <span>{`Reason: ${leave.reason}`}</span>
                                <br />
                                <span>{`Status: ${leave.status}`}</span>
                                <br />
                                {/* Admin can change the leave status */}
                                {leave.status === 'pending' && (
                                  <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                      Change Status
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        onClick={() => handleLeaveStatusChange(doctor.uid, index, 'approved')}
                                      >
                                        Approve
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={() => handleLeaveStatusChange(doctor.uid, index, 'rejected')}
                                      >
                                        Reject
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                )}
                              </div>
                            ))
                          ) : (
                            <span>No leave records</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11">No doctors available for this specialization.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;
