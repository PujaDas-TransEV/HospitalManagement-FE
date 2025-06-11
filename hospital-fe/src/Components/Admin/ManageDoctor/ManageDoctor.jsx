import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaBrain, FaStethoscope, FaSyringe, FaUserMd } from 'react-icons/fa';
import { Table, Spinner, Button, Modal, Form } from 'react-bootstrap';
import './ManageDoctor.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

// Department data
const departments = [
  { name: 'Cardiology', icon: <FaHeartbeat size={40} />, color: '#FF5733' },
  { name: 'Neurology', icon: <FaBrain size={40} />, color: '#33FF57' },
  { name: 'Pediatrics', icon: <FaStethoscope size={40} />, color: '#3380FF' },
  { name: 'Infectious Diseases', icon: <FaSyringe size={40} />, color: '#FFD700' },
  { name: 'Orthopedics', icon: <FaUserMd size={40} />, color: '#6A5ACD' },
];

const ManageDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDoctorData, setEditDoctorData] = useState({
    doctorId: '',
    fullname: '',
    specialization: '',
    phonenumber: '',
    yoe: '',
    qualification: '',
  });

  // Fetch all doctors
  useEffect(() => {
    fetch('http://192.168.0.105:5000/doctorops/getalldoctor')
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setDoctors(data.data);
        } else {
          console.error("API response is not in the expected format:", data);
          setDoctors([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching doctor data:', error);
        setDoctors([]);
        setLoading(false);
      });
  }, []);

  const handleDepartmentClick = (department) => {
    navigate(`/doctors/${department.name}`);
  };

  const handleEditClick = (doctor) => {
    setEditDoctorData({
      doctorId: doctor.uid,
      fullname: doctor.fullname,
      specialization: doctor.specialization,
      phonenumber: doctor.phonenumber,
      yoe: doctor.yoe,
      qualification: doctor.qualification,
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (doctorId) => {
    const formData = new FormData();
    formData.append('doctorid', doctorId);

    fetch('http://192.168.0.105:5000/doctorsops/deletedoctor', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Doctor deleted successfully') {
          setDoctors(doctors.filter((doctor) => doctor.uid !== doctorId));
        } else {
          console.error("Error deleting doctor:", data);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('doctorid', editDoctorData.doctorId);
    formData.append('fullname', editDoctorData.fullname);
    formData.append('specialization', editDoctorData.specialization);
    formData.append('phonenumber', editDoctorData.phonenumber);
    formData.append('yoe', editDoctorData.yoe);
    formData.append('qualification', editDoctorData.qualification);

    fetch('http://192.168.0.105:5000/doctors/profile/update', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Doctor updated successfully') {
          const updatedDoctors = doctors.map((doctor) =>
            doctor.uid === editDoctorData.doctorId ? { ...doctor, ...editDoctorData } : doctor
          );
          setDoctors(updatedDoctors);
          setShowEditModal(false);  // Close the modal after updating
        } else {
          console.error("Error updating doctor:", data);
        }
      })
      .catch((error) => console.error('Error:', error));
  };
const [departments, setDepartments] = useState([]);

useEffect(() => {
  fetch('http://192.168.0.105:5000/facilityops/getallfacility')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.data) {
        const departmentsWithIcons = data.data.map((dept, index) => ({
          ...dept,
          id: dept.department_name.toLowerCase(),     // lowercase id
          name: dept.department_name,                 // display name
          icon: assignDepartmentIcon(dept.department_name, index), // icon
        }));
        setDepartments(departmentsWithIcons);
      }
    })
    .catch((err) => {
      console.error('Error fetching departments:', err);
    });
}, []);

const assignDepartmentIcon = (name, index) => {
  const iconMap = {
    Cardiology: '❤️',
    Neurology: '🧠',
    Orthopedics: '💪',
    Dermatology: '🧴',
    Pediatrics: '👶',
    Surgery: '🔪',
  };
  // Fallback icons if not in map
  const fallbackIcons = ['🏥', '🩺', '🔬', '💊', '📋', '🧬'];
  return iconMap[name] || fallbackIcons[index % fallbackIcons.length];
};

  return (
    <div className="manage-doctors-container">
      <AdminNavbar />
      <div className="manage-doctors-content">
        <AdminSidebar />
        <div className="manage-doctors-container">
          <h2>Manage Doctors</h2>

        
 <div className="department-icons-section">
      {loading ? (
        <p>Loading departments...</p> // 👈 You can replace this with a spinner
      ) : departments.length === 0 ? (
        <p>No departments available</p>
      ) : (
        departments.map((department) => (
          <div
            key={department.id}
            className="department-icon-item"
            onClick={() => handleDepartmentClick(department)}
            style={{ borderColor: '#ccc' }}
          >
            <div className="department-icon-wrapper" style={{ fontSize: '2rem' }}>
              {department.icon}
            </div>
            <h4>{department.name}</h4>
          </div>
        ))
      )}
      </div>

          {/* Doctors Table */}
          <h3>All Doctors</h3>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <div className="table-responsive-wrapper">
            <Table striped bordered hover className="doctors-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Contact</th>
                  <th>Experience</th>
                  <th>Qualification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <tr key={doctor.uid}>
                      <td>{doctor.fullname}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.phonenumber}</td>
                      <td>{doctor.yoe} years</td>
                      <td>{doctor.qualification}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => handleEditClick(doctor)}
                          style={{ marginRight: '10px' }}
                        >
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteClick(doctor.uid)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No doctors available.</td>
                  </tr>
                )}
              </tbody>
            

            </Table>
            </div>
          )}
        </div>
      </div>
      

      {/* Edit Doctor Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        {/* Custom Header with Close Button */}
        <Modal.Header
          style={{
            backgroundColor: '#5cb85c',
            color: 'white',
            borderBottom: '2px solid #5cb85c',
          }}
        >
          <Modal.Title>Edit Doctor</Modal.Title>
          {/* Custom Close Button */}
          <button
            type="button"
            className="close"
            onClick={() => setShowEditModal(false)} // Close the modal when clicked
            style={{
              color: 'white',
              fontSize: '1.5rem',
              padding: '0.5rem',
              margin: '0.5rem',
            }}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span> {/* This creates the '×' symbol */}
          </button>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="fullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={editDoctorData.fullname}
                onChange={(e) => setEditDoctorData({ ...editDoctorData, fullname: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="specialization">
              <Form.Label>Specialization</Form.Label>
              <Form.Control
                type="text"
                value={editDoctorData.specialization}
                onChange={(e) => setEditDoctorData({ ...editDoctorData, specialization: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="phonenumber">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                value={editDoctorData.phonenumber}
                onChange={(e) => setEditDoctorData({ ...editDoctorData, phonenumber: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="yoe">
              <Form.Label>Experience (Years)</Form.Label>
              <Form.Control
                type="number"
                value={editDoctorData.yoe}
                onChange={(e) => setEditDoctorData({ ...editDoctorData, yoe: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="qualification">
              <Form.Label>Qualification</Form.Label>
              <Form.Control
                type="text"
                value={editDoctorData.qualification}
                onChange={(e) => setEditDoctorData({ ...editDoctorData, qualification: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    
  );
};

export default ManageDoctors;
