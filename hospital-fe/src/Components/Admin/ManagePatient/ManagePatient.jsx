import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserEdit,
  FaTrashAlt,
  FaUserPlus,
  FaSpinner,
  FaTimes,
  FaSave,
} from 'react-icons/fa';
import { Table } from 'react-bootstrap';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './ManagePatient.css';

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
  Orthopedics: '#F0E8FF',
  Dermatology: '#FFF0F0',
  Pediatrics: '#E8F0FF',
  default: '#f0f4f8',
};

const ManagePatient = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editPatient, setEditPatient] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch('http://192.168.0.106:5000/facilityops/getallfacility')
      .then(r => r.json())
      .then(r => setDepartments(r.data || []))
      .catch(() => setDepartments([]));

    fetch('http://192.168.0.106:5000/patientops/getallpatient')
      .then(r => r.json())
      .then(r => setPatients(r || []))
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredPatients = selectedDept
    ? patients.filter(p => p.department === selectedDept)
    : patients;

  const handleDepartmentClick = (department) => {
    navigate(`/patients/${department}`);
  };

  const handleEdit = p => {
    setEditPatient(p);
    setFormData(p);
  };

  const handleDelete = uid => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    const fd = new FormData();
    fd.append('patientid', uid);
    fetch('http://192.168.0.106:5000/patientops/deleteprofile', {
      method: 'POST',
      body: fd,
    })
      .then(r => r.json())
      .then(() => {
        setPatients(ps => ps.filter(p => p.uid !== uid));
      })
      .catch(console.error);
  };

  
  const savePatient = () => {
  if (!editPatient || !editPatient.uid) {
    console.error('Patient details or UID are missing!');
    alert('Patient details or UID are missing!');
    return;
  }

  const fd = new FormData();
  fd.append('patientid', editPatient.uid);           // Use uid as patientid
  fd.append('firstname', formData.firstname || '');
  fd.append('lastname', formData.lastname || '');
  fd.append('bloodgroup', formData.bloodgroup || '');
  fd.append('age', formData.age || '');
  fd.append('weight', formData.weight || '');
  fd.append('height', formData.height || '');
  fd.append('gender', formData.gender || '');
  fd.append('dob', formData.dob || '');
  fd.append('phonenumber', formData.phonenumber || '');
  fd.append('address', formData.address || '');
  fd.append('email', formData.email || '');

  fetch('http://192.168.0.106:5000/patients/profile/update', {
    method: 'POST',
    body: fd,
  })
    .then(response => response.json())
    .then(data => {
      if (data) {
        // Update patient list locally with the updated data
        setPatients(patients.map(patient =>
          patient.uid === editPatient.uid ? { ...patient, ...data } : patient
        ));
        setEditPatient(null);
        alert('Patient profile updated successfully');
      } else {
        alert('Error updating patient profile');
      }
    })
    .catch(error => {
      console.error('Error updating patient:', error);
      alert('An error occurred while updating the patient');
    });
};


  return (
    <div className="manage-patients-wrapper">
      <AdminNavbar />
      <div className="manage-patients-content">
        <AdminSidebar />
        <main className="main-section-patient">
          <div className="background-overlay" />
          <div className="header-section">
            <h1>Manage Patients</h1>
            <button
              className="register-btn"
              onClick={() => navigate('/signup')}
            >
              Register Patient <FaUserPlus />
            </button>
          </div>

         {loading && (
  <div className="modal-overlay">
    <FaSpinner className="spin large" />
  </div>
)}

<div className="departments-container">
  {departments.map((dept) => (
    <div
      key={dept.department_name}
      className={`department-card ${
        selectedDept === dept.department_name ? 'selected' : ''
      }`}
      onClick={() => handleDepartmentClick(dept.department_name)}
      style={{
        backgroundColor:
          selectedDept === dept.department_name
            ? '#4e79a7'
            : colorMap[dept.department_name] || colorMap.default,
        color: selectedDept === dept.department_name ? '#fff' : '#333',
      }}
    >
      <div className="dept-icon">
        {iconMap[dept.department_name] || '👤'}
      </div>
      <span>{dept.department_name}</span>
    </div>
  ))}
</div>

<section className="patients-section">
  <h2>All Patients</h2>

  {!loading && filteredPatients.length === 0 && <p>No patients found.</p>}

  {filteredPatients.length > 0 && (
    <>
      {/* Mobile Cards */}
      <div className="patients-card-list">
        {filteredPatients.map((p) => (
          <div key={p.uid} className="patient-card">
            <div className="card-row">
              <strong>Name:</strong> {p.firstname} {p.lastname}
            </div>
            <div className="card-row">
              <strong>Gender:</strong> {p.gender}
            </div>
            <div className="card-row">
              <strong>Age:</strong> {p.age}
            </div>
            <div className="card-row">
              <strong>Blood Group:</strong> {p.bloodgroup}
            </div>
            <div className="card-row">
              <strong>Phone:</strong> {p.phonenumber}
            </div>
            <div className="card-row">
              <strong>Email:</strong> {p.email}
            </div>
            <div className="card-actions">
              <FaUserEdit onClick={() => handleEdit(p)} title="Edit" />
              <FaTrashAlt onClick={() => handleDelete(p.uid)} title="Delete" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/Table */}
      <div className="table-responsive">
        <Table striped bordered hover responsive className="custom-table">
          <thead>
            <tr>
              <th>First</th>
              <th>Last</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Blood</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p.uid}>
                <td>{p.firstname}</td>
                <td>{p.lastname}</td>
                <td>{p.gender}</td>
                <td>{p.age}</td>
                <td>{p.bloodgroup}</td>
                <td>{p.phonenumber}</td>
                <td>{p.email}</td>
                <td className="actions-column">
                  <FaUserEdit onClick={() => handleEdit(p)} />
                  <FaTrashAlt onClick={() => handleDelete(p.uid)} />
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
     
        {editPatient && (
  <div className="popup-overlay" onClick={() => setEditPatient(null)}>
    <div className="popup-content wide" onClick={e => e.stopPropagation()}>
      <h3>Edit Patient</h3>
      <form
        onSubmit={e => {
          e.preventDefault();
          savePatient();
        }}
        style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <div className="form-grid">
          {[
            'firstname',
            'lastname',
            'gender',
            'dob',
            'age',
            'bloodgroup',
            'phonenumber',
            'email',
            'address',
            'height',
            'weight'
          ].map(f => {
            if (f === 'gender') {
              return (
                <div key={f} className="form-field">
                  <label>
                    Gender:
                    <select
                      name="gender"
                      value={formData.gender || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                </div>
              );
            } else if (f === 'dob') {
              return (
                <div key={f} className="form-field">
                  <label>
                    Date of Birth:
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob ? formData.dob.split('T')[0] : ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          dob: e.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                </div>
              );
            } else {
              return (
                <div key={f} className="form-field">
                  <label>
                    {f.charAt(0).toUpperCase() + f.slice(1)}:
                    <input
                      name={f}
                      value={formData[f] || ''}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          [f]: e.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                </div>
              );
            }
          })}
        </div>
        <div className="popup-buttons">
          <button type="submit" className="btn btn-primary">
            <FaSave /> Save
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditPatient(null)}
          >
            <FaTimes /> Cancel
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

export default ManagePatient;
