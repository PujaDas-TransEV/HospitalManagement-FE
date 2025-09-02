
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// const AdminNotificationForm = ({ onClose, onSuccess, notification }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [type, setType] = useState('alert');
//   const [status, setStatus] = useState('active');
//   const [adminId, setAdminId] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const [selectedDoctor, setSelectedDoctor] = useState('');
//   const [selectedPatient, setSelectedPatient] = useState('');
//   const [selectedStaff, setSelectedStaff] = useState('');

//   const [doctors, setDoctors] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [staff, setStaff] = useState([]);

//   useEffect(() => {
//     try {
//       const token = localStorage.getItem('accessToken');
//       if (!token) throw new Error('Access token missing');
//       const decoded = jwtDecode(token);
//       setAdminId(decoded.userid || decoded.uid || decoded.id || '');
//     } catch (err) {
//       setError('Failed to decode admin token');
//     }

//     axios.get('https://backend.medapp.transev.site/patientops/getallpatient')
//       .then(res => setPatients(res.data || []))
//       .catch(() => setError('Failed to fetch patients'));

//     axios.get('https://backend.medapp.transev.site/doctorops/getalldoctor')
//       .then(res => setDoctors(res.data.data || []))
//       .catch(() => setError('Failed to fetch doctors'));

//     axios.get('https://backend.medapp.transev.site/ops/listofstaff')
//       .then(res => setStaff(res.data.data || []))
//       .catch(() => setError('Failed to fetch staff'));

//     if (notification) {
//       setTitle(notification.notificationtitle || '');
//       setDescription(notification.notificationdescription || '');
//       setType(notification.notificationtype || 'alert');
//       setStatus(notification.notificationstatus || 'active');
//       setSelectedDoctor(notification.doctorid || '');
//       setSelectedPatient(notification.patientid || '');
//       setSelectedStaff(notification.staffid || '');
//     }
//   }, [notification]);

//   const handlePatientSelect = (e) => {
//     setSelectedPatient(e.target.value);
//     if (e.target.value) {
//       setSelectedDoctor('');
//       setSelectedStaff('');
//     }
//   };

//   const handleDoctorSelect = (e) => {
//     setSelectedDoctor(e.target.value);
//     if (e.target.value) {
//       setSelectedPatient('');
//       setSelectedStaff('');
//     }
//   };

//   const handleStaffSelect = (e) => {
//     setSelectedStaff(e.target.value);
//     if (e.target.value) {
//       setSelectedDoctor('');
//       setSelectedPatient('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append('notificationtitle', title);
//       formData.append('notificationdescription', description);
//       formData.append('notificationtype', type);
//       formData.append('notificationstatus', status);
//       formData.append('notificationadminid', adminId);

//       if (selectedPatient) {
//         formData.append('patientid', selectedPatient);
//       } else if (selectedDoctor) {
//         formData.append('doctorid', selectedDoctor);
//       } else if (selectedStaff) {
//         formData.append('staffid', selectedStaff);
//       }
//       // If none selected, backend assumes broadcast to all.

//       if (notification) {
//         formData.append('notificationuid', notification.uid);
//       }

//       const url = notification
//         ? 'https://backend.medapp.transev.site/notify/update'
//         : 'https://backend.medapp.transev.site/notify/create';

//       const response = await axios.post(url, formData);

//       if (response.status >= 200 && response.status < 300) {
//         alert('✅ Notification submitted successfully!');
//         onSuccess();
//         onClose();
//       } else {
//         throw new Error('Failed to submit notification');
//       }
//     } catch (err) {
//       setError(err.message || 'Error submitting notification');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const styles = {
//     container: {
//       maxWidth: 600,
//       margin: '20px auto',
//       padding: 20,
//       border: '1px solid #ddd',
//       borderRadius: 8,
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#fdfdfd',
//     },
//     heading: {
//       textAlign: 'center',
//       marginBottom: 20,
//       color: '#333',
//     },
//     label: {
//       marginBottom: 6,
//       fontWeight: '600',
//       color: '#555',
//     },
//     input: {
//       width: '100%',
//       padding: 10,
//       marginBottom: 15,
//       borderRadius: 5,
//       border: '1px solid #ccc',
//       fontSize: 16,
//     },
//     select: {
//       width: '100%',
//       padding: 10,
//       marginBottom: 15,
//       borderRadius: 5,
//       border: '1px solid #ccc',
//       fontSize: 16,
//       backgroundColor: '#fff',
//     },
//     button: {
//       padding: 12,
//       fontSize: 18,
//       borderRadius: 5,
//       border: 'none',
//       backgroundColor: '#007bff',
//       color: '#fff',
//       cursor: 'pointer',
//       fontWeight: '600',
//     },
//     error: {
//       color: 'red',
//       marginBottom: 10,
//       textAlign: 'center',
//       fontWeight: '700',
//     },
//     info: {
//       fontSize: 14,
//       marginBottom: 15,
//       color: '#666',
//     },
//   };

//   return (
//     <div className="notification-form-wrapper">
//       <h2 style={styles.heading}>{notification ? 'Edit' : 'Create'} Notification</h2>

//       {error && <div div className="error">{error}</div>}

//       <form onSubmit={handleSubmit}>
//         <input
//           style={styles.input}
//           type="text"
//           placeholder="Notification Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <textarea
//           style={{ ...styles.input, height: 100 }}
//           placeholder="Notification Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />

//         <label style={styles.label}>Notification Type</label>
//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           style={styles.select}
//           required
//         >
//           <option value="alert">Alert</option>
//           <option value="maintenance">Maintenance</option>
//           <option value="info">Information</option>
//           <option value="general">General</option>
//         </select>

//         <label style={styles.label}>Notification Status</label>
//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           style={styles.select}
//           required
//         >
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//         </select>

//         <p style={styles.info}>
//           <strong>Note:</strong> If no recipient is selected, the notification will be sent to <strong>all users</strong>.
//         </p>

//         <label style={styles.label}>Send to Doctor</label>
//         <select
//           style={styles.select}
//           value={selectedDoctor}
//           onChange={handleDoctorSelect}
//         >
//           <option value="">-- Select Doctor --</option>
//           {doctors.map((doc) => (
//             <option key={doc.uid} value={doc.uid}>
//               {doc.fullname || `${doc.firstname} ${doc.lastname}`}
//             </option>
//           ))}
//         </select>

//         <label style={styles.label}>Send to Staff</label>
//         <select
//           style={styles.select}
//           value={selectedStaff}
//           onChange={handleStaffSelect}
//         >
//           <option value="">-- Select Staff --</option>
//           {staff.map((s) => (
//             <option key={s.uid} value={s.uid}>
//               {s.staffname}
//             </option>
//           ))}
//         </select>

//         <label style={styles.label}>Send to Patient</label>
//         <select
//           style={styles.select}
//           value={selectedPatient}
//           onChange={handlePatientSelect}
//         >
//           <option value="">-- Select Patient --</option>
//           {patients.map((pat) => (
//             <option key={pat.uid} value={pat.uid}>
//               {pat.firstname} {pat.lastname}
//             </option>
//           ))}
//         </select>

//         <button type="submit" disabled={loading} style={styles.button}>
//           {loading ? 'Submitting...' : notification ? 'Update Notification' : 'Create Notification'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AdminNotificationForm;

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { io } from 'socket.io-client';

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

  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io('wss://backend.medapp.transev.site', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    // Listen for server messages (optional)
    socketRef.current.on('message', (msg) => {
      console.log('Server message:', msg);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // Decode admin ID from JWT token
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token missing');
      const decoded = jwtDecode(token);
      setAdminId(decoded.userid || decoded.uid || decoded.id || '');
    } catch (err) {
      setError('Failed to decode admin token');
    }

    // Fetch dropdown lists
    axios.get('https://backend.medapp.transev.site/patientops/getallpatient')
      .then(res => setPatients(res.data || []))
      .catch(() => setError('Failed to fetch patients'));

    axios.get('https://backend.medapp.transev.site/doctorops/getalldoctor')
      .then(res => setDoctors(res.data.data || []))
      .catch(() => setError('Failed to fetch doctors'));

    axios.get('https://backend.medapp.transev.site/ops/listofstaff')
      .then(res => setStaff(res.data.data || []))
      .catch(() => setError('Failed to fetch staff'));

    // If editing existing notification, populate fields
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

  // Only one recipient type at a time
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Prepare payload
    const payload = {
      notificationtitle: title,
      notificationdescription: description,
      notificationtype: type,
      notificationstatus: status,
      notificationadminid: adminId,
      doctorid: selectedDoctor || undefined,
      patientid: selectedPatient || undefined,
      staffid: selectedStaff || undefined,
    };

    // Include uid if updating
    if (notification && notification.uid) {
      payload.notificationuid = notification.uid;
    }

    // Determine event name based on create/update
    const eventName = notification ? 'update_notification' : 'create_notification';

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(eventName, payload);

      // Listen once for server confirmation (optional)
      socketRef.current.once('message', (msg) => {
        if (msg.error) {
          setError(msg.error);
          setLoading(false);
          return;
        }
        alert(`✅ Notification ${notification ? 'updated' : 'created'} successfully!`);
        onSuccess();
        onClose();
        setLoading(false);
      });
    } else {
      setError('WebSocket not connected');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md font-sans">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        {notification ? 'Edit' : 'Create'} Notification
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          placeholder="Notification Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        />

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Notification Type</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="alert">Alert</option>
            <option value="maintenance">Maintenance</option>
            <option value="info">Information</option>
            <option value="general">General</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Notification Status</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          <strong>Note:</strong> Selecting a recipient will send the notification only to them.
          Otherwise, it will be sent to <strong>all users</strong>.
        </p>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Send to Doctor</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Send to Staff</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Send to Patient</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 mt-4 text-white font-semibold rounded ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {loading ? 'Submitting...' : notification ? 'Update Notification' : 'Create Notification'}
        </button>
      </form>
    </div>
  );
};

export default AdminNotificationForm;
