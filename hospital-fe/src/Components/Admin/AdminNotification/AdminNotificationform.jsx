
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Notification.css';

const AdminNotificationForm = ({ onClose, onSuccess, notification }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('alert');
  const [status, setStatus] = useState('active');
  const [adminId, setAdminId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      const decoded = jwtDecode(token);
      const extractedId = decoded.userid || decoded.uid || decoded.id;

      if (!extractedId) throw new Error('Admin ID not found in token');

      setAdminId(extractedId);
    } catch (err) {
      setError(err.message || 'Token decode failed');
    }

    if (notification) {
      setTitle(notification.notificationtitle);
      setDescription(notification.notificationdescription);
      setType(notification.notificationtype);
      setStatus(notification.notificationstatus);
    }
  }, [notification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('notificationtitle', title);
      formData.append('notificationdescription', description);
      formData.append('notificationtype', type);
      formData.append('notificationstatus', status);
      formData.append('notificationadminid', adminId);
      if (notification) {
        formData.append('notificationuid', notification.uid);
      }

      const res = await fetch(
        notification
          ? 'http://localhost:5000/notify/update'
          : 'http://localhost:5000/notify/create',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit');

      alert('✅ Notification submitted successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-form-wrapper">
      <h2>{notification ? 'Edit' : 'Create'} Notification</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="notification-form">
        <input
          type="text"
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Notification Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="alert">Alert</option>
          <option value="maintenance">Maintenance</option>
          <option value="info">Information</option>
          <option value="general">General</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Notification'}
        </button>
      </form>

      {/* <button onClick={onClose} className="close-btn">
        ❌ Close
      </button> */}
    </div>
  );
};

export default AdminNotificationForm;
