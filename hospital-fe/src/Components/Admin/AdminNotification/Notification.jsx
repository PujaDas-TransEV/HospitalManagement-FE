

import React, { useState, useEffect } from 'react';
import AdminNotificationForm from './AdminNotificationform';
import './Notification.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const AdminNotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://192.168.0.106:5000/notify/show/all');
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');

      // Sort notifications by most recent
      const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotifications(sortedData);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (uid) => {
    if (!window.confirm('Delete this notification?')) return;

    try {
      const formData = new FormData();
      formData.append('notificationuid', uid);

      const res = await fetch('http://192.168.0.106:5000/notify/delete', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setNotifications((prev) => prev.filter((n) => n.uid !== uid));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusToggle = async (uid, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('http://192.168.0.106:5000/notify/update', {
        method: 'POST',
        body: new URLSearchParams({
          notificationuid: uid,
          notificationstatus: newStatus,
        }),
      });
      if (!res.ok) throw new Error('Status update failed');
      setNotifications((prev) =>
        prev.map((n) =>
          n.uid === uid ? { ...n, notificationstatus: newStatus } : n
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingNotification(null);
  };

  return (
    <div className="facilityy-management-page">
      <AdminNavbar />
      <div className="facilityy-management-content">
        <AdminSidebar />
        <div className="notification-wrapper">
          <h2>Admin Notifications</h2>

          <button
            onClick={() => {
              setEditingNotification(null);
              setShowForm(true);
            }}
            className="create-button"
          >
            ➕ Create Notification
          </button>

          {showForm && (
            <div className="modal-overlay">
              <div
                className="modal-content"
                style={{
                  backgroundColor: '#e0f7fa',
                  padding: '20px',
                  borderRadius: '8px',
                }}
              >
                <button className="modal-close-btn" onClick={handleFormClose}>
                  ✖
                </button>
                <AdminNotificationForm
                  notification={editingNotification}
                  onClose={handleFormClose}
                  onSuccess={fetchNotifications}
                />
              </div>
            </div>
          )}

          {loading ? (
            <p>Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p>No notifications found.</p>
          ) : (
            <div className="notification-list">
              {notifications.map((n) => (
                <div key={n.uid} className="notification-card">
                  <div className="notification-header">
                    <h3>{n.notificationtitle}</h3>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(n)}
                        className="edit-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(n.uid)}
                        className="delete-btn"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <p>
                    <strong>Type:</strong> {n.notificationtype}
                  </p>
                  <p>{n.notificationdescription}</p>
                  <p>
                    <small>{new Date(n.created_at).toLocaleString()}</small>
                  </p>
                  <div className="status-toggle">
                    <button
                      onClick={() =>
                        handleStatusToggle(n.uid, n.notificationstatus)
                      }
                      className={
                        n.notificationstatus === 'active'
                          ? 'active'
                          : 'inactive'
                      }
                    >
                      {n.notificationstatus === 'active'
                        ? 'Deactivate'
                        : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationList;
