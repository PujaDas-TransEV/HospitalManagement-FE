import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import './Support.css';

const API_URL = 'http://192.168.0.106:5000';

const PatientSupport = () => {
  const issueTypes = [
    "Billing Issue",
    "Technical Problem",
    "Appointment Scheduling",
    "Prescription Refill",
    "Other",
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    issueType: '',
    message: '',
  });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return navigate('/login');

      const patientId = jwtDecode(accessToken).userid;
      const response = await fetch(`${API_URL}/patients/profile/getbyid`, {
        method: 'POST',
        body: new URLSearchParams({ patientid: patientId }),
      });

      const data = await response.json();
      if (data.data) {
        const { firstname, lastname, email, phonenumber } = data.data;
        setFormData({
          name: `${firstname} ${lastname}`,
          email,
          phone: phonenumber,
          issueType: '',
          message: '',
        });
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, issueType, message } = formData;

    const response = await fetch(`${API_URL}/ops/supportops`, {
      method: 'POST',
      body: new URLSearchParams({ name, email, phone, issueType, message }),
    });

    const data = await response.json();
    if (data.message) {
      setStatus('Support ticket created successfully.');
      setFormData({ name: '', email: '', phone: '', issueType: '', message: '' });
    } else {
      setStatus('Error creating support ticket.');
    }
  };

  return (
    <div className="support-dashboard">
      <PatientNavbar />
      <div className="support-content">
        <PatientSidebar />
        <div className="support-wrapper">
          <div className="support-form-card">
            <h2>Create a Support Ticket</h2>
            <form
              onSubmit={handleSubmit}
              className="support-form"
              style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}
            >
              <div className="form-group">
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} readOnly />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} readOnly />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input type="tel" name="phone" value={formData.phone} readOnly />
              </div>
              <div className="form-group">
                <label>Issue Type:</label>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '1rem',
                    backgroundColor: '#f8fafc',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                    transition: 'border 0.3s ease, background-color 0.3s ease',
                  }}
                >
                  <option value="" disabled>
                    -- Select an issue --
                  </option>
                  {issueTypes.map((issue, idx) => (
                    <option key={idx} value={issue}>
                      {issue}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Message:</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '1rem',
                    backgroundColor: '#f8fafc',
                    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                    transition: 'border 0.3s ease, background-color 0.3s ease',
                    resize: 'vertical',
                    minHeight: '120px',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: isHovered ? '#1e40af' : '#3994af',
                  color: '#fff',
                  padding: '12px 30px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'block',
                  margin: '0 auto',
                  width: 'auto',
                  minWidth: '150px',
                  textAlign: 'center',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Submit Ticket
              </button>
              {status && <div className="status-message">{status}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSupport;
