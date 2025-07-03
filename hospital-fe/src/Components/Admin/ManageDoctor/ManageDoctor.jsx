import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserMd,
  FaUserEdit,
  FaTrashAlt,
  FaUserPlus,
  FaSpinner,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
import { Table } from 'react-bootstrap';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './ManageDoctor.css';

const iconMap = {
  Cardiology: '❤️',
  Neurology: '🧠',
  Orthopedics: '🦴',
  Dermatology: '🧴',
  Pediatrics: '👶',
  Surgery: '🔪',
};

const colorMap = {
  Cardiology: '#FFEBE8',
  Neurology: '#E8FFEB',
  Pediatrics: '#E8F0FF',
  'Infectious Diseases': '#FFF9E8',
  Orthopedics: '#F0E8FF',
  default: '#f0f4f8',
};

const ManageDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editDoctorData, setEditDoctorData] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetch('http://192.168.0.106:5000/facilityops/getallfacility')
      .then((res) => res.json())
      .then((deptData) => {
        if (deptData && deptData.data) {
          setDepartments(deptData.data);
          return fetch('http://192.168.0.106:5000/doctorops/getalldoctor');
        } else {
          throw new Error('Invalid department data');
        }
      })
      .then((res) => res.json())
      .then((docData) => {
        if (docData && Array.isArray(docData.data)) {
          setDoctors(docData.data);
          setFilteredDoctors(docData.data);
        } else {
          setDoctors([]);
          setFilteredDoctors([]);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setDoctors([]);
        setFilteredDoctors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filterByDepartment = (deptName) => {
    setSelectedDepartment(deptName);
    if (!deptName) {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doc) => doc.specialization.toLowerCase() === deptName.toLowerCase()
      );
      setFilteredDoctors(filtered);
    }
  };

  // const handleDepartmentClick = (department) => {
  //   filterByDepartment(department.department_name);
  // };
const handleDepartmentClick = (department) => {
  navigate(`/doctors/${department.department_name}`);
};

  const handleEditClick = (doctor) => {
    setEditDoctorData(doctor);
    setShowEditPopup(true);
  };

 

const [deleteSuccessMessage, setDeleteSuccessMessage] = useState('');
const handleDeleteClick = (doctorId) => {
  if (!window.confirm('Are you sure you want to delete this doctor?')) return;

  const formData = new FormData();
  formData.append('doctorid', doctorId);

  fetch('http://192.168.0.106:5000/doctorsops/deletedoctor', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === 'Doctor profile deleted successfully') {
        const updated = doctors.filter((doc) => doc.uid !== doctorId);
        setDoctors(updated);
        setFilteredDoctors(updated);

        setDeleteSuccessMessage('✅ Doctor deleted successfully!');
        setTimeout(() => setDeleteSuccessMessage(''), 3000); // Hide after 3s
      } else {
        alert('Failed to delete doctor');
      }
    })
    .catch(() => alert('Error deleting doctor'));
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditDoctorData((prev) => ({ ...prev, [name]: value }));
  };

  
const [successMessage, setSuccessMessage] = useState('');

const handleEditSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('doctorid', editDoctorData.uid);
  formData.append('fullname', editDoctorData.fullname);
  formData.append('specialization', editDoctorData.specialization);
  formData.append('phonenumber', editDoctorData.phonenumber);
  formData.append('yoe', editDoctorData.yoe);
  formData.append('qualification', editDoctorData.qualification);

  fetch('http://192.168.0.106:5000/doctors/updatedata', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message === 'Doctor details updated successfully') {
        const updated = doctors.map((doc) =>
          doc.uid === editDoctorData.uid ? data.data : doc
        );
        setDoctors(updated);
        setFilteredDoctors(updated);
        setSuccessMessage('Doctor data updated successfully.');

        setTimeout(() => {
          setShowEditPopup(false);
          setSuccessMessage('');
        }, 2000); // Closes the popup after 2 seconds
      } else {
        alert('Failed to update doctor');
      }
    })
    .catch(() => alert('Error updating doctor'));
};

  return (
    <div className="manage-doctors-wrapper">
      <AdminNavbar />
      <div className="manage-doctors-content">
        <AdminSidebar />
        <main className="main-section">
          <div className="background-overlay" />

          <div className="header-section">
            <div className="header-icon-text">
              {/* <FaUserPlus size={40} color="#4e79a7" /> */}
              <h1>Manage Doctor </h1>
            </div>
            <button
              className="register-btn"
              onClick={() => navigate('/doctor-signup')}
              aria-label="Register new doctor"
            >
              Register Doctor  <FaUserPlus/>
            </button>
          </div>

          <div className="departments-container">
            {loading ? (
              <div className="modal-overlay-doctor">
                <div className="modal-content-doctor">
                  <FaSpinner className="spin large" />
                </div>
              </div>
            ) : departments.length === 0 ? (
              <p>No departments available</p>
            ) : (
              departments.map((dept) => (
                <div
                  key={dept.department_name}
                  className={`department-card ${
                    selectedDepartment === dept.department_name ? 'selected' : ''
                  }`}
                  onClick={() => handleDepartmentClick(dept)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleDepartmentClick(dept)}
                  style={{
                    backgroundColor:
                      selectedDepartment === dept.department_name
                        ? '#4e79a7'
                        : colorMap[dept.department_name] || colorMap.default,
                    color: selectedDepartment === dept.department_name ? '#fff' : '#333',
                  }}
                >
                  <div className="dept-icon">
                    {iconMap[dept.department_name] || (
                      <FaUserMd
                        size={30}
                        color={selectedDepartment === dept.department_name ? '#fff' : '#888'}
                      />
                    )}
                  </div>
                  <span>{dept.department_name}</span>
                </div>
              ))
            )}
          </div>

       
<section className="doctors-section">
  <h2>All Doctors</h2>

  {loading ? (
    <div className="modal-overlay-doctor">
      <div className="modal-content-doctor">
        <FaSpinner className="spin large" />
      </div>
    </div>
  ) : filteredDoctors.length === 0 ? (
    <p>No doctors found.</p>
  ) : (
    <>
      {/* Mobile Cards */}
      <div className="doctors-card-list">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.uid} className="doctor-card">
            <div className="card-row">
              <strong>Name:</strong> {doctor.fullname}
            </div>
            <div className="card-row">
              <strong>Specialization:</strong> {doctor.specialization}
            </div>
            <div className="card-row">
              <strong>Contact:</strong> {doctor.phonenumber}
            </div>
            <div className="card-row">
              <strong>Experience:</strong> {doctor.yoe} years
            </div>
            <div className="card-row">
              <strong>Qualification:</strong> {doctor.qualification}
            </div>
            <div className="card-actions">
              <FaUserEdit
                onClick={() => handleEditClick(doctor)}
                title="Edit"
                className="action-icon"
              />
              <FaTrashAlt
                onClick={() => handleDeleteClick(doctor.uid)}
                title="Delete"
                className="action-icon"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="table-responsive">
        <Table
          striped
          bordered
          hover
          responsive
          className="custom-doctors-table"
        >
          <thead className="table-header">
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
            {filteredDoctors.map((doctor) => (
              <tr key={doctor.uid}>
                <td className="actionss-column">{doctor.fullname}</td>
                <td className="actionss-column">{doctor.specialization}</td>
                <td className="actionss-column">{doctor.phonenumber}</td>
                <td className="actionss-column">{doctor.yoe} years</td>
                <td className="actionss-column">{doctor.qualification}</td>
                <td className="actionss-column">
                  <FaUserEdit
                    className="action-icon edit-icon"
                    title="Edit"
                    onClick={() => handleEditClick(doctor)}
                  />
                  <FaTrashAlt
                    className="action-icon delete-icon"
                    title="Delete"
                    onClick={() => handleDeleteClick(doctor.uid)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  )}
</section>
</main>
        
        {showEditPopup && (
  <div className="popup-overlay" onClick={() => setShowEditPopup(false)}>
    <div
      className="popup-content"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="editDoctorTitle"
    >
      <h3 id="editDoctorTitle">Edit Doctor</h3>

      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}

      <form onSubmit={handleEditSubmit} className="edit-form" style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px",
        }}>
        <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  value={editDoctorData.fullname}
                  onChange={handleInputChange}
                  required
                />

                <label htmlFor="specialization">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  id="specialization"
                  value={editDoctorData.specialization}
                  onChange={handleInputChange}
                  required
                />

                <label htmlFor="phonenumber">Contact</label>
                <input
                  type="text"
                  name="phonenumber"
                  id="phonenumber"
                  value={editDoctorData.phonenumber}
                  onChange={handleInputChange}
                  required
                />

                <label htmlFor="yoe">Experience (Years)</label>
                <input
                  type="number"
                  name="yoe"
                  id="yoe"
                  min="0"
                  value={editDoctorData.yoe}
                  onChange={handleInputChange}
                  required
                />

                <label htmlFor="qualification">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  id="qualification"
                  value={editDoctorData.qualification}
                  onChange={handleInputChange}
                  required
                />

                <div className="popup-buttons">
                  <button type="submit" className="btn btn-primary">
                    <FaSave />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditPopup(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
      </form>
     

    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ManageDoctors;

