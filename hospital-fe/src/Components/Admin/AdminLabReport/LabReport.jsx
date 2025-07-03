
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import Adminsidebar from '../Adminsidebar/AdminSidebar';
import './LabReport.css'; // Import the CSS
import { useNavigate } from 'react-router-dom';

const AdminLabReportPage = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: '',
    doctorreferal: '',
    symptoms: '',
    testType: '',
    finalReport: '',
  });

  useEffect(() => {
    axios.get('http://192.168.0.106:5000/patientops/getallpatient')
      .then((res) => setPatients(res.data))
      .catch((err) => console.error('Error loading patients:', err));

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

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const data = new FormData();
  //   data.append('patientid', formData.patientId);
  //   data.append('labphyreportid', 'LAB-' + Math.floor(Math.random() * 10000));
  //   data.append('patientsymptoms', formData.symptoms);
  //   data.append('doctorreferal', formData.doctorreferal);
  //   data.append('typeoftest', formData.testType);
  //   data.append('finalreport', formData.finalReport);

  //   axios.post('http://192.168.0.106:5000/ops/labtestdata', data)
  //     .then(() => {
  //       alert('Lab report created successfully!');
  //       setFormData({
  //         patientId: '',
  //         doctorreferal: '',
  //         symptoms: '',
  //         testType: '',
  //         finalReport: '',
  //       });
  //     })
  //     .catch((err) => {
  //       console.error('Failed to submit lab report:', err);
  //       alert('Error creating lab report.');
  //     });
  // };
const handleSubmit = (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append('patientid', formData.patientId);
  data.append('labphyreportid', 'LAB-' + Math.floor(Math.random() * 10000));
  data.append('patientsymptoms', formData.symptoms);
  data.append('doctorreferal', formData.doctorreferal);
  data.append('typeoftest', formData.testType);
  data.append('finalreport', formData.finalReport);

  axios.post('http://192.168.0.106:5000/ops/labtestdata', data)
    .then(() => {
      alert('Lab report created successfully!');
      setFormData({
        patientId: '',
        doctorreferal: '',
        symptoms: '',
        testType: '',
        finalReport: '',
      });
      navigate('/admin-labtest'); // Redirect here
    })
    .catch((err) => {
      console.error('Failed to submit lab report:', err);
      alert('Error creating lab report.');
    });
};

  return (
    <div className="dashboard-container">
      <AdminNavbar />
      <div className="dashboard-content">
        <Adminsidebar />
        <div className="admin-lab-report-form">
          <h2 className="lab-header">Create Lab Report</h2>
          <form onSubmit={handleSubmit} className="lab-form">
            <label className="lab-label">Select Patient</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              className="lab-input"
            >
              <option value="">-- Select Patient --</option>
              {patients.map((p) => (
                <option key={p.uid} value={p.uid}>
                  {p.firstname} {p.lastname}
                </option>
              ))}
            </select>

            <label className="lab-label">Select Doctor</label>
            <select
              name="doctorreferal"
              value={formData.doctorreferal}
              onChange={handleChange}
              required
              className="lab-input"
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map((d) => (
                <option key={d.uid} value={d.fullname}>
                  {d.fullname}
                </option>
              ))}
            </select>

            <label className="lab-label">Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              required
              className="lab-textarea"
            />

            <label className="lab-label">Type of Test</label>
            <input
              type="text"
              name="testType"
              value={formData.testType}
              onChange={handleChange}
              required
              className="lab-input"
            />

            <label className="lab-label">Final Report</label>
            <textarea
              name="finalReport"
              value={formData.finalReport}
              onChange={handleChange}
              required
              className="lab-textarea"
            />

            <button type="submit" className="btn submit-btnn">
              Create Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLabReportPage;
