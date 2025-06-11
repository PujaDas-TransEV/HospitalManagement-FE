
import React, { useState, useEffect } from 'react';
import { FaExclamationCircle, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import { jwtDecode } from 'jwt-decode';

import './Support.css';
const API_URL = 'http://192.168.0.105:5000';
const PatientSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    issueType: '',
    message: '',
  });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

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
    <div className="dashboard-container">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
        <div className="support-container">
          <h2>Create a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
               
                Email:
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
             
                Phone:
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
              
                Issue Type:
              </label>
              <input
                type="text"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message:</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit Ticket
            </button>
          </form>
          {status && <div className="mt-4 text-center text-sm text-gray-700">{status}</div>}
        </div>
      </div>
    </div>
  );
};

export default PatientSupport;
