
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Alert, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { FaHeart, FaBrain, FaUserMd, FaSyringe, FaStethoscope, FaSpinner,FaUserPlus } from 'react-icons/fa';
import './Department.css';
import AdminNavbar from '../../Adminnavbar/AdminNavbar';
import AdminSidebar from '../../Adminsidebar/AdminSidebar';

const DepartmentPage = () => {
  const { specialization } = useParams();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const specializationIcons = {
    cardiology: <FaHeart />,
    neurology: <FaBrain />,
    surgery: <FaUserMd />,
    dermatology: <FaSyringe />,
    general: <FaStethoscope />,
  };

  const fetchDoctors = () => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('doctorspecialization', specialization);

    fetch('http://192.168.0.106:5000/doctors/getdoctorbyspc', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setDoctors(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('An error occurred while fetching doctors.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  const handleLeaveStatusChange = (leaveId, newStatus) => {
    const formData = new FormData();
    formData.append('leaveid', leaveId);
    formData.append('status', newStatus);

    fetch('http://192.168.0.106:5000/doctors/leaveupdate', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then(() => {
        setSuccessMessage('✅ Leave status updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchDoctors();
      })
      .catch(() => setError('Failed to update leave status.'));
  };

  const handleRegisterDoctor = () => navigate('/doctor-signup');

  return (
    <div className="manage-doctors-container">
      <AdminNavbar />
      <div className="manage-doctors-content">
        <AdminSidebar />
        <div className="department-page-container">
          <h2 className="page-title">
            {specializationIcons[specialization]}{' '}
            {specialization.charAt(0).toUpperCase() + specialization.slice(1)} Doctors
          </h2>

          {successMessage && <div className="success-popup">{successMessage}</div>}
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="modal-overlay-doctor">
              <div className="modal-content-doctor">
                <FaSpinner className="spin large" />
              </div>
            </div>
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  {/* <Button variant="light" onClick={handleRegisterDoctor}>
                    Register New Doctor <FaUserPlus/>
                  </Button> */}
                  <button
                                className="register-btn"
                                onClick={() => navigate('/doctor-signup')}
                                aria-label="Register new doctor"
                              >
                                Register Doctor  <FaUserPlus/>
                              </button>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table striped bordered hover className="doctor-table">
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
                      <th>Leave Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((doctor) => (
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
                        <td>
                          {doctor.leaves?.length ? (
                            doctor.leaves.map((leave, i) => (
                              <div key={i} className="leave-details">
                                <div>{`From: ${leave.leavefrom} To: ${leave.leaveto}`}</div>
                                <div>{`Reason: ${leave.reason}`}</div>
                                <div className={`leave-status ${leave.status}`}>{`Status: ${leave.status}`}</div>
                                {leave.status === 'pending' && (
                                  <Dropdown>
                                    <Dropdown.Toggle size="sm" variant="success">Change Status</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item onClick={() => handleLeaveStatusChange(leave.leaveid, 'approved')}>Approve</Dropdown.Item>
                                      <Dropdown.Item onClick={() => handleLeaveStatusChange(leave.leaveid, 'rejected')}>Reject</Dropdown.Item>
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
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentPage;
