
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AdminNotificationForm = ({ onClose, onSuccess, notification }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('alert');
  const [status, setStatus] = useState('active');
  const [adminId, setAdminId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token missing');
      const decoded = jwtDecode(token);
      setAdminId(decoded.userid || decoded.uid || decoded.id || '');
    } catch (err) {
      setError('Failed to decode admin token');
    }

    axios.get('http://localhost:5000/patientops/getallpatient')
      .then(res => setPatients(res.data || []))
      .catch(() => setError('Failed to fetch patients'));

    axios.get('http://localhost:5000/doctorops/getalldoctor')
      .then(res => setDoctors(res.data.data || []))
      .catch(() => setError('Failed to fetch doctors'));

    axios.get('http://localhost:5000/ops/listofstaff')
      .then(res => setStaff(res.data.data || []))
      .catch(() => setError('Failed to fetch staff'));

    if (notification) {
      setTitle(notification.notificationtitle || '');
      setDescription(notification.notificationdescription || '');
      setType(notification.notificationtype || 'alert');
      setStatus(notification.notificationstatus || 'active');
      setSelectedDoctor(notification.doctorid || '');
      setSelectedPatient(notification.patientid || '');
      setSelectedStaff(notification.staffid || '');
    }
  }, [notification]);

  const handlePatientSelect = (e) => {
    setSelectedPatient(e.target.value);
    if (e.target.value) {
      setSelectedDoctor('');
      setSelectedStaff('');
    }
  };

  const handleDoctorSelect = (e) => {
    setSelectedDoctor(e.target.value);
    if (e.target.value) {
      setSelectedPatient('');
      setSelectedStaff('');
    }
  };

  const handleStaffSelect = (e) => {
    setSelectedStaff(e.target.value);
    if (e.target.value) {
      setSelectedDoctor('');
      setSelectedPatient('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('notificationtitle', title);
      formData.append('notificationdescription', description);
      formData.append('notificationtype', type);
      formData.append('notificationstatus', status);
      formData.append('notificationadminid', adminId);

      if (selectedPatient) {
        formData.append('patientid', selectedPatient);
      } else if (selectedDoctor) {
        formData.append('doctorid', selectedDoctor);
      } else if (selectedStaff) {
        formData.append('staffid', selectedStaff);
      }
      // If none selected, backend assumes broadcast to all.

      if (notification) {
        formData.append('notificationuid', notification.uid);
      }

      const url = notification
        ? 'http://localhost:5000/notify/update'
        : 'http://localhost:5000/notify/create';

      const response = await axios.post(url, formData);

      if (response.status >= 200 && response.status < 300) {
        alert('✅ Notification submitted successfully!');
        onSuccess();
        onClose();
      } else {
        throw new Error('Failed to submit notification');
      }
    } catch (err) {
      setError(err.message || 'Error submitting notification');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: 600,
      margin: '20px auto',
      padding: 20,
      border: '1px solid #ddd',
      borderRadius: 8,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fdfdfd',
    },
    heading: {
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    label: {
      marginBottom: 6,
      fontWeight: '600',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: 10,
      marginBottom: 15,
      borderRadius: 5,
      border: '1px solid #ccc',
      fontSize: 16,
    },
    select: {
      width: '100%',
      padding: 10,
      marginBottom: 15,
      borderRadius: 5,
      border: '1px solid #ccc',
      fontSize: 16,
      backgroundColor: '#fff',
    },
    button: {
      padding: 12,
      fontSize: 18,
      borderRadius: 5,
      border: 'none',
      backgroundColor: '#007bff',
      color: '#fff',
      cursor: 'pointer',
      fontWeight: '600',
    },
    error: {
      color: 'red',
      marginBottom: 10,
      textAlign: 'center',
      fontWeight: '700',
    },
    info: {
      fontSize: 14,
      marginBottom: 15,
      color: '#666',
    },
  };

  return (
    <div className="notification-form-wrapper">
      <h2 style={styles.heading}>{notification ? 'Edit' : 'Create'} Notification</h2>

      {error && <div div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          style={{ ...styles.input, height: 100 }}
          placeholder="Notification Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label style={styles.label}>Notification Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={styles.select}
          required
        >
          <option value="alert">Alert</option>
          <option value="maintenance">Maintenance</option>
          <option value="info">Information</option>
          <option value="general">General</option>
        </select>

        <label style={styles.label}>Notification Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={styles.select}
          required
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <p style={styles.info}>
          <strong>Note:</strong> If no recipient is selected, the notification will be sent to <strong>all users</strong>.
        </p>

        <label style={styles.label}>Send to Doctor</label>
        <select
          style={styles.select}
          value={selectedDoctor}
          onChange={handleDoctorSelect}
        >
          <option value="">-- Select Doctor --</option>
          {doctors.map((doc) => (
            <option key={doc.uid} value={doc.uid}>
              {doc.fullname || `${doc.firstname} ${doc.lastname}`}
            </option>
          ))}
        </select>

        <label style={styles.label}>Send to Staff</label>
        <select
          style={styles.select}
          value={selectedStaff}
          onChange={handleStaffSelect}
        >
          <option value="">-- Select Staff --</option>
          {staff.map((s) => (
            <option key={s.uid} value={s.uid}>
              {s.staffname}
            </option>
          ))}
        </select>

        <label style={styles.label}>Send to Patient</label>
        <select
          style={styles.select}
          value={selectedPatient}
          onChange={handlePatientSelect}
        >
          <option value="">-- Select Patient --</option>
          {patients.map((pat) => (
            <option key={pat.uid} value={pat.uid}>
              {pat.firstname} {pat.lastname}
            </option>
          ))}
        </select>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Submitting...' : notification ? 'Update Notification' : 'Create Notification'}
        </button>
      </form>
    </div>
  );
};

export default AdminNotificationForm;
