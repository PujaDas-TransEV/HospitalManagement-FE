import React, { useState } from 'react';
import { FaExclamationCircle, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; // Import the icons
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const API_URL = 'http://localhost:5000'; // Base URL

const PatientSupport = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [issueType, setIssueType] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('issuetype', issueType);
    formData.append('message', message);

    try {
      const response = await fetch(`${API_URL}/ops/supportops`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setStatus('Support ticket created successfully.');
        // Reset form after submission
        setName('');
        setEmail('');
        setPhone('');
        setIssueType('');
        setMessage('');
      } else {
        setStatus('Error creating support ticket.');
      }
    } catch (error) {
      console.error('Error creating support ticket:', error);
      setStatus('Error creating support ticket.');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Navbar at the top */}
      <PatientNavbar />

      <div className="dashboard-content">
        {/* Sidebar for navigation */}
        <PatientSidebar />
    <div className="support-container">
      <h2>Create a Support Ticket</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label><FaEnvelope /> Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label><FaPhoneAlt /> Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label><FaExclamationCircle /> Issue Type:</label>
          <input
            type="text"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit">Submit Ticket</button>
      </form>

      {status && <div className="status-message">{status}</div>}
    </div>
    </div>
    </div>
  );
};

export default PatientSupport;
