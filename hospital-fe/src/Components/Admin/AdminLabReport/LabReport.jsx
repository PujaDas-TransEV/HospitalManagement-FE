import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import Adminsidebar from '../Adminsidebar/AdminSidebar';

const AdminLabReportPage = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorreferal: '',
    symptoms: '',
    testType: '',
    finalReport: '',
  });

  useEffect(() => {
    // Get all patients
    axios.get('http://192.168.0.106:5000/patientops/getallpatient')
      .then((res) => setPatients(res.data))
      .catch((err) => console.error('Error loading patients:', err));

    // Get all doctors
    axios.get('http://192.168.0.106:5000/doctorops/getalldoctor')
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setDoctors(res.data.data);
        } else {
          console.error('Unexpected doctor data:', res.data);
        }
      })
      .catch((err) => console.error('Error loading doctors:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('patientid', formData.patientId);
    data.append('labphyreportid', 'LAB-' + Math.floor(Math.random() * 10000)); // you can replace this with actual logic
    data.append('patientsymptoms', formData.symptoms);
    data.append('doctorreferal', formData.doctorreferal); // Send doctor's full name
    data.append('typeoftest', formData.testType);
    data.append('finalreport', formData.finalReport);

    axios.post('http://192.168.0.106:5000/ops/labtestdata', data)
      .then((res) => {
        alert('Lab report created successfully!');
        setFormData({
          patientId: '',
          doctorreferal: '',
          symptoms: '',
          testType: '',
          finalReport: '',
        });
      })
      .catch((err) => {
        console.error('Failed to submit lab report:', err);
        alert('Error creating lab report.');
      });
  };

  return (
     <div className="dashboard-container">
      <AdminNavbar />
      <div className="dashboard-content" style={{ display: 'flex' }}>
        <Adminsidebar />
    <div className="admin-lab-reports" style={styles.containers}>
      <h2 style={styles.header}>Create Lab Report</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Select Patient</label>
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">-- Select Patient --</option>
          {patients.map((p) => (
            <option key={p.uid} value={p.uid}>
              {p.firstname} {p.lastname}
            </option>
          ))}
        </select>

        <label style={styles.label}>Select Doctor</label>
        <select
          name="doctorreferal"
          value={formData.doctorreferal}
          onChange={handleChange}
          required
          style={styles.input}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((d) => (
            <option key={d.uid} value={d.fullname}>
              {d.fullname}
            </option>
          ))}
        </select>

        <label style={styles.label}>Symptoms</label>
        <textarea
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <label style={styles.label}>Type of Test</label>
        <input
          type="text"
          name="testType"
          value={formData.testType}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Final Report</label>
        <textarea
          name="finalReport"
          value={formData.finalReport}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <button type="submit" style={styles.button}>
          Create Report
        </button>
      </form>
    </div>
    </div>
    </div>
  );
};
const styles = {
  containers: {
    maxWidth: '700px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  header: {
    textAlign: 'center',
    color: '#0056b3',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '10px',
    height: '80px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default AdminLabReportPage;
