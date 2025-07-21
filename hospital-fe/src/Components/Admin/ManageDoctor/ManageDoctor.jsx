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
  FaPlus,
  FaEye
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
  default: '#9ab5d1ff',
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
const [showView, setShowView] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
const [searchText, setSearchText] = useState('');
  // New states for appointment fees modal
  const [showFeePopup, setShowFeePopup] = useState(false);
  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('');
  const [appointmentFees, setAppointmentFees] = useState('');
  const [feeSuccessMessage, setFeeSuccessMessage] = useState('');
const [searchResultCount, setSearchResultCount] = useState(null);
 
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
          // Normalize appointmentfees to string or 'N/A'
        const docsWithFees = docData.data.map((doc) => {
  let fee = 'N/A';
  if (Array.isArray(doc.appointmentfees) && doc.appointmentfees.length > 0) {
    fee = doc.appointmentfees[0].appointmentfees || 'N/A';
  }
  return {
    ...doc,
    appointmentfees: fee,
  };
});

          setDoctors(docsWithFees);
          setFilteredDoctors(docsWithFees);
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
          setTimeout(() => setDeleteSuccessMessage(''), 3000);
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
          }, 2000);
        } else {
          alert('Failed to update doctor');
        }
      })
      .catch(() => alert('Error updating doctor'));
  };

  // New handlers for appointment fees
  const handleSetFeesClick = (doctor) => {
    setSelectedDoctorEmail(doctor.email); // Assuming doctor.email exists
    setAppointmentFees(doctor.appointmentfees === 'N/A' ? '' : doctor.appointmentfees);
    setShowFeePopup(true);
  };

  const handleFeeSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('doctoremail', selectedDoctorEmail);
  formData.append('appointmentfees', appointmentFees);

  fetch('http://192.168.0.106:5000/createappointmentfees', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      // Adjusted message check to match backend response exactly
      if (data.message === 'Appointment fees created successfully!' || data.message === 'Appointment fee added successfully') {
        setFeeSuccessMessage('Appointment fee set successfully!');
        // Update doctors and filteredDoctors state
        setDoctors((prev) =>
          prev.map((doc) =>
            doc.email === selectedDoctorEmail
              ? { ...doc, appointmentfees: appointmentFees }
              : doc
          )
        );
        setFilteredDoctors((prev) =>
          prev.map((doc) =>
            doc.email === selectedDoctorEmail
              ? { ...doc, appointmentfees: appointmentFees }
              : doc
          )
        );

        setTimeout(() => {
          setShowFeePopup(false);
          setFeeSuccessMessage('');
        }, 2000);
      } else {
        alert('Failed to set appointment fee.');
      }
    })
    .catch(() => alert('Error setting appointment fee.'));
};


const doSearch = (searchText) => {
  setLoading(true);

  const formData = new FormData();
  formData.append('search', searchText);  // Use 'search_value' as backend expects

  fetch('http://192.168.0.106:5000/search', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      // Extract bills and doctors data from response
      const billing = data.bills?.bills || [];        // bills inside bills object
      const doctorsFromApi = data.doctors?.result || [];  // doctors inside doctors.result

      // Normalize billing doctors
      const billingDoctors = billing.map(bill => ({
        uid: bill.doctor_uid,
        fullname: bill.doctor_name,
        specialization: bill.specialization || 'N/A',
        phonenumber: bill.doctor_phone,
        qualification: bill.qualification || 'N/A',
        yoe: bill.yoe || 'N/A', // Add fallback
      }));

      // Normalize doctors from API
      const normalizedDoctors = doctorsFromApi.map(doctor => ({
        uid: doctor.uid,
        fullname: doctor.fullname,
        specialization: doctor.specialization || 'N/A',
        phonenumber: doctor.phonenumber,
        qualification: doctor.qualification || 'N/A',
        appointmentfees: doctor.appointmentfees || 'N/A',
        yoe: doctor.yoe || 'N/A',
      }));

      // Merge doctors and billing doctors by unique uid
      const combined = [...normalizedDoctors];

      const uids = new Set(combined.map(d => d.uid));
      billingDoctors.forEach(doc => {
        if (!uids.has(doc.uid)) {
          combined.push(doc);
          uids.add(doc.uid);
        }
      });

      if (combined.length === 0) {
        setFilteredDoctors([]);
        setSearchResultCount(0);
      } else {
        setFilteredDoctors(combined);
        setSearchResultCount(combined.length);
      }

      setLoading(false);
    })
    .catch(err => {
      console.error('Search API error:', err);
      setFilteredDoctors([]);
      setSearchResultCount(0);
      setLoading(false);
    });
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
              <h1>Manage Doctor </h1>
            </div>
            <button
              className="register-btn"
              onClick={() => navigate('/doctor-signup')}
              aria-label="Register new doctor"
            >
              Register Doctor <FaUserPlus />
            </button>
          </div>
<div style={{ padding: '10px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
 
 <div style={{ display: 'flex', alignItems: 'center', width: '300px', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden' }}>
  <input
    type="text"
    placeholder="Search doctors Name"
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
             <p style={{ color: '#b00020', fontWeight: 'bold' }}>No doctors found.</p>

            ) : (
              <>
                {/* Mobile Cards */}
                <div className="doctors-card-list">
                  {filteredDoctors.map((doctor) => (
                    <div key={doctor.uid} className="doctor-card">
                      <div className="card-row">
                        <strong>Name:</strong>Dr. {doctor.fullname}
                      </div>
                      <div className="card-row">
                        <strong>Specialization:</strong> {doctor.specialization}
                      </div>
                      <div className="card-row">
                        <strong>Phone:</strong> {doctor.phonenumber}
                      </div>
                      <div className="card-row">
                        <strong>Experience:</strong> {doctor.yoe} years
                      </div>
                      <div className="card-row">
                        <strong>Qualification:</strong> {doctor.qualification}
                      </div>
                      <div className="card-row">
                        <strong>Appointment Fees:</strong>{' '}
                        {doctor.appointmentfees}
                      </div>
                      <div className="card-row actions">
                        <button
                          className="edit-button"
                          onClick={() => handleEditClick(doctor)}
                          aria-label={`Edit doctor ${doctor.fullname}`}
                        >
                          <FaUserEdit />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteClick(doctor.uid)}
                          aria-label={`Delete doctor ${doctor.fullname}`}
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          className="set-fee-button"
                          onClick={() => handleSetFeesClick(doctor)}
                          aria-label={`Set appointment fee for ${doctor.fullname}`}
                        >
                          <FaSave />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                  <div style={{ marginBottom: '10px', marginTop: '20px' }}>
        {searchText && searchResultCount !== null && (
          <p style={{ fontSize: '16px', color: '#007bff', fontWeight: '500' }}>
            🔍 <strong>{searchResultCount}</strong> result{searchResultCount !== 1 && 's'} for "<strong>{searchText}</strong>"
          </p>
        )}
      </div>
                <Table striped bordered hover responsive className="doctors-table">
                  <thead>
                    <tr>
                      <th className="actionss-column">Name</th>
                      <th className="actionss-column">Specialization</th>
                      <th className="actionss-column">Phone</th>
                      <th className="actionss-column">Experience (Years)</th>
                      <th className="actionss-column">Qualification</th>
                      <th className="actionss-column">Appointment Fees</th>
                      <th className="actionss-column">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((doctor) => (
                      <tr key={doctor.uid}>
                        <td className="actionss-column"> Dr. {doctor.fullname}</td>
                        <td className="actionss-column">{doctor.specialization}</td>
                        <td className="actionss-column">{doctor.phonenumber}</td>
                        <td className="actionss-column">{doctor.yoe}</td>
                        <td className="actionss-column">{doctor.qualification}</td>
                        <td className="actionss-column">
                          {doctor.appointmentfees}
                        </td>
                       
                           <td className="actionss-column">
                   <FaUserEdit
                    className="action-icon edit-icon"
                    title="Edit"
                    onClick={() => handleEditClick(doctor)}
                  />
                  <FaTrashAlt
                    className="action-icon delete-icon"
                    title="Delete"
                    onClick={() => handleDeleteClick(doctor.uid)} style={{
      
        color: '#af152aff'}}
                  />
                   <FaEye cursor="pointer" color="#4a90e2" onClick={() => {
                      setViewDoc(doctor);
                      setShowView(true);
                    }} title="View Details" /> 
                   <button
      className="fees-button"
      title="set-fee-button"
       onClick={() => handleSetFeesClick(doctor)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#3eaa93ff',
        fontWeight: '600',
        fontSize: '1rem',
      }}
    >
     
      <span>  Fees</span> <FaPlus className="fees-icon" />
    </button> 
   
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
          </section>

          {/* Edit Doctor Popup */}
          {showEditPopup && editDoctorData && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 style={{
          color: "#4b5eb3ff"}}>Edit Doctor</h3>
                <form onSubmit={handleEditSubmit} style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px",
        }}>
                  <label>
                    Full Name:
                    <input
                      type="text"
                      name="fullname"
                      value={editDoctorData.fullname}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Specialization:
                    <input
                      type="text"
                      name="specialization"
                      value={editDoctorData.specialization}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Phone Number:
                    <input
                      type="text"
                      name="phonenumber"
                      value={editDoctorData.phonenumber}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Years of Experience:
                    <input
                      type="number"
                      name="yoe"
                      value={editDoctorData.yoe}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </label>
                  <label>
                    Qualification:
                    <input
                      type="text"
                      name="qualification"
                      value={editDoctorData.qualification}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  {successMessage && (
                    <p className="success-message">{successMessage}</p>
                  )}
                  <div className="modal-actions">
                    <button type="submit" className="save-btn" aria-label="Save changes">
                      Save
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowEditPopup(false)}
                      aria-label="Cancel editing"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Appointment Fees Popup */}
          {showFeePopup && (
            <div className="modal-overlay">
              <div className="modal-content" style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px",
        }}>
                <h3 style={{
          color: "#4bb8b2ff"}}>Set Appointment Fee</h3>
                <form onSubmit={handleFeeSubmit}>
                  <label>
                    Appointment Fees:
                    <input
                      type="number"
                      min="0"
                      value={appointmentFees}
                      onChange={(e) => setAppointmentFees(e.target.value)}
                      required
                      aria-label="Appointment fee"
                    />
                  </label>
                  {feeSuccessMessage && (
                    <p className="success-message">{feeSuccessMessage}</p>
                  )}
                  <div className="modal-actions">
                    <button type="submit" className="save-btn" aria-label="Save fee">
                      Save
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowFeePopup(false)}
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete success message */}
          {deleteSuccessMessage && (
            <div
              className="success-message"
              style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}
            >
              {deleteSuccessMessage}
            </div>
          )}
            {/* --- View Modal */}
          {showView && viewDoc && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                
                  <h3 style={styles.title}>Doctor Details</h3>
          <FaTimes style={styles.closeIcon} onClick={() => setShowView(false)} />
        </div>

        {viewDoc.profile_image && (
          <img
            src={`data:image/jpeg;base64,${viewDoc.profile_image}`}
            alt="profile"
            style={styles.profileImage}
          />
        )}

        <div style={styles.infoRow}><strong>Name:</strong> Dr. {viewDoc.fullname}</div>
        <div style={styles.infoRow}><strong>Email:</strong> {viewDoc.email}</div>
        <div style={styles.infoRow}><strong>Specialization:</strong> {viewDoc.specialization}</div>
        <div style={styles.infoRow}><strong>Phone:</strong> {viewDoc.phonenumber}</div>
        <div style={styles.infoRow}><strong>Experience:</strong> {viewDoc.yoe} yrs</div>
        <div style={styles.infoRow}><strong>Qualification:</strong> {viewDoc.qualification}</div>
        <div style={styles.infoRow}><strong>Fees:</strong> ₹{viewDoc.appointmentfees}</div>
        <div style={styles.infoRow}><strong>Address:</strong> {viewDoc.address}</div>
        <div style={styles.infoRow}><strong>DOB:</strong> {viewDoc.dob}</div>
        <div style={styles.infoRow}><strong>Gender:</strong> {viewDoc.gender}</div>
        <div style={styles.infoRow}><strong>License:</strong> {viewDoc.license_number}</div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
const styles = {
 
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 600,
  },
  closeIcon: {
    fontSize: 22,
    color: '#888',
    cursor: 'pointer',
    transition: 'color 0.3s',
  },
  profileImage: {
    display: 'block',
    margin: '0 auto 18px auto',
    borderRadius: '50%',
    width: 100,
    height: 100,
    objectFit: 'cover',
    border: '3px solid #007bff',
  },
 infoRow: {
  marginBottom: 10,
  fontSize: 16,
  lineHeight: 1.4,
  color: 'black',


  },
};
export default ManageDoctors;


