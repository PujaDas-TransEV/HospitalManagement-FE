
// import React, { useState, useEffect } from 'react';
// import AdminNotificationForm from './AdminNotificationform';
// import './Notification.css';
// import AdminNavbar from '../Adminnavbar/AdminNavbar';
// import AdminSidebar from '../Adminsidebar/AdminSidebar';

// const AdminNotificationList = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingNotification, setEditingNotification] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('https://backend.medapp.transev.site/notify/show/all');
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Failed to fetch');

//       // Sort notifications by most recent
//       const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
//       setNotifications(sortedData);
//     } catch (err) {
//       console.error('Fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const handleDelete = async (uid) => {
//     if (!window.confirm('Delete this notification?')) return;

//     try {
//       const formData = new FormData();
//       formData.append('notificationuid', uid);

//       const res = await fetch('https://backend.medapp.transev.site/notify/delete', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || 'Delete failed');
//       setNotifications((prev) => prev.filter((n) => n.uid !== uid));
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleStatusToggle = async (uid, currentStatus) => {
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//     try {
//       const res = await fetch('https://backend.medapp.transev.site/notify/update', {
//         method: 'POST',
//         body: new URLSearchParams({
//           notificationuid: uid,
//           notificationstatus: newStatus,
//         }),
//       });
//       if (!res.ok) throw new Error('Status update failed');
//       setNotifications((prev) =>
//         prev.map((n) =>
//           n.uid === uid ? { ...n, notificationstatus: newStatus } : n
//         )
//       );
//     } catch (err) {
//       alert(err.message);
//     }
//   };

//   const handleEdit = (notification) => {
//     setEditingNotification(notification);
//     setShowForm(true);
//   };

//   const handleFormClose = () => {
//     setShowForm(false);
//     setEditingNotification(null);
//   };

//   return (
//     <div className="facilityy-management-page">
//       <AdminNavbar />
//       <div className="facilityy-management-content">
//         <AdminSidebar />
//         <div className="notification-wrapper">
//           <h2>Admin Notifications</h2>

//           <button
//             onClick={() => {
//               setEditingNotification(null);
//               setShowForm(true);
//             }}
//             className="create-button"
//           >
//             ➕ Create Notification
//           </button>

//           {showForm && (
//             <div className="modal-overlay">
//               <div
//                 className="modal-content"
//                 style={{
//                   backgroundColor: '#e0f7fa',
//                   padding: '20px',
//                   borderRadius: '8px',
//                 }}
//               >
//                 <button className="modal-close-btn" onClick={handleFormClose}>
//                   ✖
//                 </button>
//                 <AdminNotificationForm
//                   notification={editingNotification}
//                   onClose={handleFormClose}
//                   onSuccess={fetchNotifications}
//                 />
//               </div>
//             </div>
//           )}

//           {loading ? (
//             // <p>Loading notifications...</p>
//            <p style={{ marginLeft: '400px' }}>Loading notifications...</p>


//           ) : notifications.length === 0 ? (
//             <p>No notifications found.</p>
//           ) : (
//             <div className="notification-list">
//               {notifications.map((n) => (
//                 <div key={n.uid} className="notification-card">
//                   <div className="notification-header">
//                     <h3>{n.notificationtitle}</h3>
//                     <div className="action-buttons">
//                       <button
//                         onClick={() => handleEdit(n)}
//                         className="edit-btn"
//                         title="Edit"
//                       >
//                         ✏️
//                       </button>
//                       <button
//                         onClick={() => handleDelete(n.uid)}
//                         className="delete-btn"
//                         title="Delete"
//                       >
//                         🗑️
//                       </button>
//                     </div>
//                   </div>
//                   <p>
//                     <strong>Type:</strong> {n.notificationtype}
//                   </p>
//                   <p>{n.notificationdescription}</p>
//                   <p>
//                     <small>{new Date(n.created_at).toLocaleString()}</small>
//                   </p>
//                   <div className="status-toggle">
//                     <button
//                       onClick={() =>
//                         handleStatusToggle(n.uid, n.notificationstatus)
//                       }
//                       className={
//                         n.notificationstatus === 'active'
//                           ? 'active'
//                           : 'inactive'
//                       }
//                     >
//                       {n.notificationstatus === 'active'
//                         ? 'Deactivate'
//                         : 'Activate'}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminNotificationList;
// import React, { useState, useEffect, useRef } from 'react';
// import AdminNotificationForm from './AdminNotificationform';
// import './Notification.css';
// import AdminNavbar from '../Adminnavbar/AdminNavbar';
// import AdminSidebar from '../Adminsidebar/AdminSidebar';
// import { io } from 'socket.io-client';

// const SOCKET_URL = 'wss://backend.medapp.transev.site';

// const AdminNotificationList = () => {
//   const socketRef = useRef(null);

//   const [notifications, setNotifications] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingNotification, setEditingNotification] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Function to fetch notifications explicitly
//   const fetchNotifications = () => {
//     if (!socketRef.current || !socketRef.current.connected) return;
//     setLoading(true);
//     socketRef.current.emit('show_all_notifications');
//   };

//   useEffect(() => {
//     // Initialize socket connection only once
//     socketRef.current = io(SOCKET_URL, {
//       transports: ['websocket'],
//       reconnectionAttempts: 5,
//       reconnectionDelay: 3000,
//     });

//     // Connect socket
//     socketRef.current.connect();

//     const onConnect = () => {
//       console.log('Connected to WebSocket backend');
//       setError('');
//       fetchNotifications();
//     };

//     const onMessage = (msg) => {
//       if (msg.error) {
//         setError(msg.error);
//         setLoading(false);
//         return;
//       }

//       if (msg.notifications) {
//         const sorted = msg.notifications.sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         );
//         setNotifications(sorted);
//         setLoading(false);
//         setError('');
//       }

//       if (msg.message) {
//         alert(msg.message);
//         // Only fetch notifications if message is about changes, e.g., after update/delete/create
//         if (
//           msg.message.toLowerCase().includes('updated') ||
//           msg.message.toLowerCase().includes('deleted') ||
//           msg.message.toLowerCase().includes('created')
//         ) {
//           fetchNotifications();
//         }
//       }
//     };

//     const onDisconnect = () => {
//       console.log('Disconnected from WebSocket backend');
//     };

//     const onConnectError = (err) => {
//       setError('Connection error: ' + err.message);
//       setLoading(false);
//     };

//     socketRef.current.on('connect', onConnect);
//     socketRef.current.on('message', onMessage);
//     socketRef.current.on('disconnect', onDisconnect);
//     socketRef.current.on('connect_error', onConnectError);

//     // Cleanup on unmount
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.off('connect', onConnect);
//         socketRef.current.off('message', onMessage);
//         socketRef.current.off('disconnect', onDisconnect);
//         socketRef.current.off('connect_error', onConnectError);
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//     };
//   }, []);

//   const handleDelete = (uid) => {
//     if (!window.confirm('Delete this notification?')) return;
//     if (!socketRef.current || !socketRef.current.connected) {
//       alert('Not connected to server');
//       return;
//     }
//     setLoading(true);
//     socketRef.current.emit('deletenotify', { notificationuid: uid });
//   };

//   const handleStatusToggle = (uid, currentStatus) => {
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//     if (!socketRef.current || !socketRef.current.connected) {
//       alert('Not connected to server');
//       return;
//     }
//     setLoading(true);
//     socketRef.current.emit('update_notification', {
//       notificationuid: uid,
//       notificationstatus: newStatus,
//     });
//   };

//   const handleEdit = (notification) => {
//     setEditingNotification(notification);
//     setShowForm(true);
//   };

//   const handleFormClose = () => {
//     setShowForm(false);
//     setEditingNotification(null);
//   };

//   const onFormSuccess = () => {
//     setShowForm(false);
//     setEditingNotification(null);
//     // Explicitly fetch fresh notifications on success
//     fetchNotifications();
//   };

//   return (
//     <div className="facilityy-management-page">
//       <AdminNavbar />
//       <div className="facilityy-management-content">
//         <AdminSidebar />
//         <div className="notification-wrapper">
//           <h2>Admin Notifications</h2>

//           <button
//             onClick={() => {
//               setEditingNotification(null);
//               setShowForm(true);
//             }}
//             className="create-button"
//           >
//             ➕ Create Notification
//           </button>

//           <button
//             onClick={fetchNotifications}
//             style={{ marginLeft: 10, padding: '5px 10px' }}
//             disabled={loading}
//           >
//             🔄 Refresh
//           </button>

//           {showForm && (
//             <div className="modal-overlay">
//               <div
//                 className="modal-content"
//                 style={{
//                   backgroundColor: '#e0f7fa',
//                   padding: '20px',
//                   borderRadius: '8px',
//                 }}
//               >
//                 <button className="modal-close-btn" onClick={handleFormClose}>
//                   ✖
//                 </button>
//                 <AdminNotificationForm
//                   notification={editingNotification}
//                   onClose={handleFormClose}
//                   onSuccess={onFormSuccess}
//                   socket={socketRef.current}
//                 />
//               </div>
//             </div>
//           )}

//           {error && (
//             <p style={{ color: 'red', marginLeft: '20px' }}>
//               Error: {error}
//             </p>
//           )}

//           {loading ? (
//             <p style={{ marginLeft: '400px' }}>Loading notifications...</p>
//           ) : notifications.length === 0 ? (
//             <p>No notifications found.</p>
//           ) : (
//             <div className="notification-list">
//               {notifications.map((n) => (
//                 <div key={n.uid} className="notification-card">
//                   <div className="notification-header">
//                     <h3>{n.notificationtitle}</h3>
//                     <div className="action-buttons">
//                       <button
//                         onClick={() => handleEdit(n)}
//                         className="edit-btn"
//                         title="Edit"
//                       >
//                         ✏️
//                       </button>
//                       <button
//                         onClick={() => handleDelete(n.uid)}
//                         className="delete-btn"
//                         title="Delete"
//                       >
//                         🗑️
//                       </button>
//                     </div>
//                   </div>
//                   <p>
//                     <strong>Type:</strong> {n.notificationtype}
//                   </p>
//                   <p>{n.notificationdescription}</p>
//                   <p>
//                     <small>{new Date(n.created_at).toLocaleString()}</small>
//                   </p>
//                   <div className="status-toggle">
//                     <button
//                       onClick={() =>
//                         handleStatusToggle(n.uid, n.notificationstatus)
//                       }
//                       className={
//                         n.notificationstatus === 'active' ? 'active' : 'inactive'
//                       }
//                     >
//                       {n.notificationstatus === 'active' ? 'Deactivate' : 'Activate'}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminNotificationList;
import React, { useState, useEffect, useRef } from 'react';
import AdminNotificationForm from './AdminNotificationform';
import './Notification.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { io } from 'socket.io-client';

const SOCKET_URL = 'wss://backend.medapp.transev.site';

const AdminNotificationList = () => {
  const socketRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to fetch notifications explicitly
  const fetchNotifications = () => {
    if (!socketRef.current || !socketRef.current.connected) return;
    setLoading(true);
    socketRef.current.emit('show_all_notifications');
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socketRef.current.connect();

    const onConnect = () => {
      console.log('Connected to WebSocket backend');
      setError('');
      fetchNotifications();
    };

    const onMessage = (msg) => {
      if (msg.error) {
        setError(msg.error);
        setLoading(false);
        return;
      }

      if (msg.notifications) {
        const sorted = msg.notifications.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sorted);
        setLoading(false);
        setError('');
      }

      if (msg.message) {
        // ❌ Removed alert(msg.message)
        // ✅ Automatically refresh if something changed
        if (
          msg.message.toLowerCase().includes('updated') ||
          msg.message.toLowerCase().includes('deleted') ||
          msg.message.toLowerCase().includes('created')
        ) {
          fetchNotifications();
        }
      }
    };

    const onDisconnect = () => {
      console.log('Disconnected from WebSocket backend');
    };

    const onConnectError = (err) => {
      setError('Connection error: ' + err.message);
      setLoading(false);
    };

    socketRef.current.on('connect', onConnect);
    socketRef.current.on('message', onMessage);
    socketRef.current.on('disconnect', onDisconnect);
    socketRef.current.on('connect_error', onConnectError);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect', onConnect);
        socketRef.current.off('message', onMessage);
        socketRef.current.off('disconnect', onDisconnect);
        socketRef.current.off('connect_error', onConnectError);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleDelete = (uid) => {
    if (!window.confirm('Delete this notification?')) return;
    if (!socketRef.current || !socketRef.current.connected) {
      alert('Not connected to server');
      return;
    }
    setLoading(true);
    socketRef.current.emit('deletenotify', { notificationuid: uid });
  };

  const handleStatusToggle = (uid, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    if (!socketRef.current || !socketRef.current.connected) {
      alert('Not connected to server');
      return;
    }
    setLoading(true);
    socketRef.current.emit('update_notification', {
      notificationuid: uid,
      notificationstatus: newStatus,
    });
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingNotification(null);
  };

  const onFormSuccess = () => {
    setShowForm(false);
    setEditingNotification(null);
    fetchNotifications();
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

          <button
            onClick={fetchNotifications}
            style={{ marginLeft: 10, padding: '5px 10px' }}
            disabled={loading}
          >
            🔄 Refresh
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
                  onSuccess={onFormSuccess}
                  socket={socketRef.current}
                />
              </div>
            </div>
          )}

          {error && (
            <p style={{ color: 'red', marginLeft: '20px' }}>
              Error: {error}
            </p>
          )}

          {loading ? (
            <p style={{ marginLeft: '400px' }}>Loading notifications...</p>
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
                        n.notificationstatus === 'active' ? 'active' : 'inactive'
                      }
                    >
                      {n.notificationstatus === 'active' ? 'Deactivate' : 'Activate'}
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
