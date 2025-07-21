import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editPatient, setEditPatient] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchText, setSearchText] = useState('');
  const [searchResultCount, setSearchResultCount] = useState(null);

  // Initial load for all patients and departments
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://192.168.0.106:5000/facilityops/getallfacility').then(r => r.json()),
      fetch('http://192.168.0.106:5000/patientops/getallpatient').then(r => r.json()),
    ])
    .then(([deptR, patR]) => {
      setDepartments(deptR.data || []);
      const arr = Array.isArray(patR) ? patR : [];
      setPatients(arr);
      setFilteredPatients(arr);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  // Live search function
  const doSearch = (txt) => {
    setSearchText(txt);
    setLoading(true);
    const fd = new FormData();
    fd.append('search', txt);

    fetch('http://192.168.0.106:5000/search', {
      method: 'POST',
      body: fd,
    })
    .then(r => r.json())
    .then(data => {
      const result = Array.isArray(data.patients?.result) ? data.patients.result : [];
      setFilteredPatients(result);
      setSearchResultCount(result.length);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };

  const handleDepartmentClick = deptName => {
    setSelectedDept(deptName);
    navigate(`/patients/${deptName}`);
  };

  const handleEdit = p => {
    setEditPatient(p);
    setFormData(p);
  };

  const handleDelete = uid => {
    if (!window.confirm('Are you sure?')) return;
    const fd = new FormData();
    fd.append('patientid', uid);

    fetch('http://192.168.0.106:5000/patientops/deleteprofile', {
      method: 'POST',
      body: fd,
    })
    .then(r => r.json())
    .then(() => {
      const rem = patients.filter(x => x.uid !== uid);
      setPatients(rem);
      setFilteredPatients(rem);
    })
    .catch(console.error);
  };

  const savePatient = () => {
    if (!editPatient?.uid) return alert('Invalid patient!');
    const fd = new FormData();
    ['firstname','lastname','bloodgroup','age','weight','height','gender','dob','phonenumber','address','email']
      .forEach(field => fd.append(field, formData[field] || ''));
    fd.append('patientid', editPatient.uid);

    fetch('http://192.168.0.106:5000/patients/profile/update', {
      method: 'POST',
      body: fd,
    })
    .then(r => r.json())
    .then(res => {
      if (res) {
        const updatedArr = patients.map(x =>
          x.uid === editPatient.uid ? { ...x, ...res } : x
        );
        setPatients(updatedArr);
        setFilteredPatients(updatedArr);
        setEditPatient(null);
        alert('Updated successfully');
      } else {
        alert('Update failed');
      }
    })
    .catch(e => {
      console.error(e);
      alert('Error updating');
    });
  };

  const filteredByDept = selectedDept
    ? filteredPatients.filter(p => p.department === selectedDept)
    : filteredPatients;

  return (
    <div className="manage-patients-wrapper">
      <AdminNavbar />
      <div className="manage-patients-content">
        <AdminSidebar />
        <main className="main-section-patient">
          <header className="header-section">
            <h1>Manage Patients</h1>
            <button className="register-btn" onClick={() => navigate('/signup')}>
              Register Patient <FaUserPlus />
            </button>
          </header>

<div style={{ display: 'flex', alignItems: 'center', width: '300px', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden' }}>
  <input
    type="text"
    placeholder="Search Patients Name"
    value={searchText}
    onChange={(e) => {
      setSearchText(e.target.value);
      doSearch(e.target.value);
    }}
    style={{
      flex: 1,
      border: 'none',
      padding: '10px',
      fontSize: '16px',
      outline: 'none',
    }}
  />
  <button
    onClick={() => doSearch(searchText)}
    style={{
      padding: '10px 16px',
      fontSize: '16px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    🔍
  </button>
</div>  
          {/* Search result count */}
          {searchText && searchResultCount !== null && (
            <p style={{ textAlign: 'center', color: '#007bff', marginBottom: 10 }}>
              🔍 <strong>{searchResultCount}</strong> result{searchResultCount !== 1 && 's'} for "<strong>{searchText}</strong>"
            </p>
          )}

          {/* Departments row */}
          {/* <div className="departments-container">
            {departments.map(dept => (
              <div
                key={dept.department_name}
                className="department-card"
                onClick={() => handleDepartmentClick(dept.department_name)}
                style={{
                  backgroundColor: colorMap[dept.department_name] || colorMap.default,
                  cursor: 'pointer'
                }}
              >
                <span>{iconMap[dept.department_name] || '👤'} {dept.department_name}</span>
              </div>
            ))}
          </div> */}
<div
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '20px',
    marginBottom: '20px',
  }}
>
  {departments.map((dept) => (
    <div
      key={dept.department_name}
      onClick={() => handleDepartmentClick(dept.department_name)}
      style={{
        flex: '0 1 calc(20% - 16px)', // about 5 cards per row
        minWidth: '140px',            // smaller min width
        backgroundColor: colorMap[dept.department_name] || colorMap.default,
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s, box-shadow 0.3s',
        cursor: 'pointer',
        color: '#333',
        fontSize: '15px',
        fontWeight: '500',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>
        {iconMap[dept.department_name] || '👤'}
      </div>
      <span>{dept.department_name}</span>
    </div>
  ))}
</div>


          {/* Patients section */}
          <section className="patients-section">
            {loading && <FaSpinner className="spin large" />}

            {!loading && filteredByDept.length === 0 && (
              <p style={{ textAlign: 'center', color: '#888' }}>No patients found.</p>
            )}

            {!loading && filteredByDept.length > 0 && (
              <>
                {/* Cards for mobile */}
                <div className="patients-card-list">
                  {filteredByDept.map(p => (
                    <div key={p.uid} className="patient-card">
                      <div><strong>Name:</strong> {p.firstname} {p.lastname}</div>
                      <div><strong>Gender:</strong> {p.gender}</div>
                      <div><strong>Age:</strong> {p.age}</div>
                      <div><strong>Blood:</strong> {p.bloodgroup}</div>
                      <div><strong>Phone:</strong> {p.phonenumber}</div>
                      <div><strong>Email:</strong> {p.email}</div>
                      <div className="card-actions">
                        <FaUserEdit onClick={() => handleEdit(p)} />
                        <FaTrashAlt onClick={() => handleDelete(p.uid)} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="table-responsive">
                  <Table striped bordered hover responsive>
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
                      {filteredByDept.map(p => (
                        <tr key={p.uid}>
                          <td>{p.firstname}</td>
                          <td>{p.lastname}</td>
                          <td>{p.gender}</td>
                          <td>{p.age}</td>
                          <td>{p.bloodgroup}</td>
                          <td>{p.phonenumber}</td>
                          <td>{p.email}</td>
                          <td>
                            <FaUserEdit onClick={() => handleEdit(p)} />
                            <FaTrashAlt onClick={() => handleDelete(p.uid)} style={{ color: '#af152a', marginLeft: 8 }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
          </section>

          {/* Edit patient popup */}
          {editPatient && (
            <div className="popup-overlay" onClick={() => setEditPatient(null)}>
              <div className="popup-content wide" onClick={e => e.stopPropagation()}>
                <h3>Edit Patient</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    savePatient();
                  }}style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px",
        }}
                >
                  <div className="form-grid">
                    {[
                      'firstname','lastname','gender','dob','age',
                      'bloodgroup','phonenumber','email','address','height','weight'
                    ].map(f => (
                      <div key={f} className="form-field">
                        <label>
                          {f[0].toUpperCase() + f.slice(1)}:
                          {f === 'gender' ? (
                            <select
                              value={formData.gender || ''}
                              onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                              required
                            >
                              <option value="">Select</option>
                              <option>Male</option>
                              <option>Female</option>
                              <option>Other</option>
                            </select>
                          ) : f === 'dob' ? (
                            <input
                              type="date"
                              value={formData.dob?.split('T')[0] || ''}
                              onChange={e => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                              required
                            />
                          ) : (
                            <input
                              name={f}
                              value={formData[f] || ''}
                              onChange={e => setFormData(prev => ({ ...prev, [f]: e.target.value }))}
                              required
                            />
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="popup-buttons">
                    <button type="submit"><FaSave /> Save</button>
                    <button type="button"  className="cancel-btn" onClick={() => setEditPatient(null)}><FaTimes /> Cancel</button>
                    
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManagePatient;
