import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTimesCircle, FaSave, FaBan, FaTrash, FaClock, FaSpinner, FaDownload } from 'react-icons/fa';
import './HomeService.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const HomeCareServicePage = () => {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [originalRequest, setOriginalRequest] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
const editableFields = [
  'timefrom',
  'timeto',
  'reason',
  'patinetaddress',
  'patientientguardian',
  'patientientguardianphno',
  'patientdetails',
  'patientphonenum'
];
  useEffect(() => {
    const pid = localStorage.getItem('patientId');
    if (!pid) {
      alert('No patient ID found! Please login first.');
      return;
    }
    setPatientId(pid);
  }, []);

  const fetchRequests = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('patientid', patientId);
      const res = await axios.post(
        'http://192.168.0.106:5000/management/homecare/gethomecarebypatientid',
        formData
      );
      setRequests(res.data.data || []);
      setError(null);
    } catch {
      setError('Failed to fetch home care requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [patientId]);

  const canCancel = (timefrom) => {
    const oneHourBefore = new Date(new Date(timefrom).getTime() - 60 * 60 * 1000);
    return new Date() < oneHourBefore;
  };

  const handleCancel = async (uid) => {
    const formData = new FormData();
    formData.append('uid', uid);
    formData.append('status', 'cancelled');
    try {
      await axios.post('http://192.168.0.106:5000/management/homecare/cancelstatus', formData);
      alert('Request cancelled.');
      setSelectedRequest(null);
      fetchRequests();
    } catch {
      alert('Cancellation failed.');
    }
  };

  const openDetails = (req) => {
    setSelectedRequest({ ...req });
    setOriginalRequest(JSON.parse(JSON.stringify(req))); // clone for comparison
    setAttachments(req.homecare.attachments || []);
  };

  
const [newAttachments, setNewAttachments] = useState([]);

const handleFileChange = async (e) => {
  const files = Array.from(e.target.files);
  const MAX_SIZE = 2 * 1024 * 1024;

  const filtered = files.filter(file => file.size <= MAX_SIZE);
  if (filtered.length !== files.length) {
    alert("Some files were too large and have been skipped.");
  }

  const uploads = await Promise.all(
    filtered.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result.split(',')[1];
          resolve({
            filename: file.name,
            data: base64Data,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );

  setNewAttachments(prev => [...prev, ...uploads]);
  setAttachments(prev => [...prev, ...uploads]);
};

const handleUpdate = async () => {
  if (!selectedRequest || !originalRequest) return;

  const formData = new FormData();
  formData.append('homeuid', selectedRequest.homecare.uid);

  let hasChanges = false;

  editableFields.forEach((field) => {
    const newVal = selectedRequest.homecare[field] || '';
    const oldVal = originalRequest.homecare[field] || '';
    if (newVal !== oldVal) {
      formData.append(field, newVal);
      hasChanges = true;
    }
  });

  if (newAttachments.length > 0) {
    newAttachments.forEach((att) => {
      const byteString = atob(att.data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: 'application/octet-stream' });
      formData.append('attachments', blob, att.filename);
    });
    hasChanges = true;
  }

  if (!hasChanges) {
    alert('No changes detected.');
    return;
  }

  try {
    const res = await axios.post('http://192.168.0.106:5000/ops/updatehomecare', formData);
    alert('Updated successfully.');
    fetchRequests();
    setSelectedRequest(null);
    setNewAttachments([]);
    setAttachments([]);
  } catch (err) {
    console.error(err);
    alert('Update failed.');
  }
};


  const handleDelete = async (uid) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    const formData = new FormData();
    formData.append('homeuid', uid);
    try {
      const res = await axios.post('http://192.168.0.106:5000/management/deletehomecare', formData);
      if (res.data.message.toLowerCase().includes('delete success')) {
        setRequests((prev) => prev.filter((r) => r.homecare.uid !== uid));
        setSelectedRequest(null);
        setAttachments([]);
        setPopupMessage('Deleted successfully.');
        setTimeout(() => setPopupMessage(null), 3000);
      } else {
        alert('Delete failed.');
      }
    } catch {
      alert('Request delete failed.');
    }
  };


  const handleDownload = (attachment) => {
    const a = document.createElement('a');
    a.href = `data:image/png;base64,${attachment.data}`;
    a.download = attachment.filename || 'attachment.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDateForInput = (datetime) => new Date(datetime).toISOString().substring(0, 16);

  return (
    <div className="dashboard-container-homecare">
      <PatientNavbar />
      <div className="dashboard-content-homecare">
        <PatientSidebar />

        <div className="homecare-page">
          <h1>Home Care Services 🏠</h1>
          <button
            className="primary-btn"
            onClick={() => navigate('/home-care-request')}
          >
            Book Home Care Service <FaClock style={{ marginLeft: '8px', verticalAlign: 'middle', color: '#2980b9' }} />
          </button>

          <h2>My Home Care Requests</h2>

          {loading && (
            <div className="loading-overlay" aria-label="Loading">
              <FaSpinner className="spinner-icon" />
              <p>Loading Homecare Booking...</p>
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}

          {!loading && !error && requests.length === 0 && (
            <p className="no-requests-msg">No Home care Booking found.</p>
          )}

          {!loading && !error && requests.length > 0 && (
            <div className="requests-list">
              {requests
                .slice()
                .sort((a, b) => new Date(b.homecare.timefrom) - new Date(a.homecare.timefrom))
                .map((req) => (
                  <div key={req.homecare.uid} className="request-card">
                    <p><strong>Status:</strong> <span className={`status-${req.homecare.status}`}>{req.homecare.status}</span></p>
                    <p><strong>Time:</strong> {new Date(req.homecare.timefrom).toLocaleString()} - {new Date(req.homecare.timeto).toLocaleString()}</p>
                    <p><strong>Patient:</strong> {req.homecare.patientname}</p>
                    <p><strong>Home Care Booking:</strong> {req.homecare.caretype}</p>
                    <div className="card-actions">
                      <button
                        className="icon-btn view-btn"
                        onClick={() => openDetails(req)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      {req.homecare.status === 'cancelled' && (
                        <button
                          className="icon-btn delete-btn"
                          onClick={() => handleDelete(req.homecare.uid)}
                          title="Delete Request"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          <Modal
            isOpen={!!selectedRequest}
            onRequestClose={() => { setSelectedRequest(null); setAttachments([]); }}
            contentLabel="Request Details"
            ariaHideApp={false}
            className="modal-content-homecare"
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={true}
          >
            {selectedRequest && (
              <div>
                <div className="modal-header-homecare">
                  <h2>Request Details</h2>
                  <button
                    className="icon-btn closee-btn"
                    onClick={() => { setSelectedRequest(null); setAttachments([]); }}
                    title="Close"
                  >
                    <FaTimesCircle />
                  </button>
                </div>

             {Object.keys(selectedRequest.homecare).map((key) => {
  if (key === 'uid' || key === 'attachments' || key === 'patientid') return null;

  const value = selectedRequest.homecare[key];
  if (
    value === 'None' ||
    value === null ||
    value === undefined ||
    value === ''
  )
    return null;

  const isEditable = editableFields.includes(key);
  const isDateTime = key === 'timefrom' || key === 'timeto';

  
  const disabled =
    (selectedRequest.homecare.status === 'approved' && isDateTime) || !isEditable;

  return (
    <div key={key} className="modal-field">
      <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
      <input
        type={isDateTime ? 'datetime-local' : 'text'}
        value={isDateTime ? formatDateForInput(value) : value}
        onChange={(e) =>
          setSelectedRequest({
            ...selectedRequest,
            homecare: {
              ...selectedRequest.homecare,
              [key]: isDateTime
                ? new Date(e.target.value).toISOString()
                : e.target.value,
            },
          })
        }
        disabled={disabled}
      />
    </div>
  );
})}


                {/* Attachments Section */}
                <div className="attachments-section" style={{ marginTop: '20px' }}>
                 <h3 style={{ color: '#b22222' }}>Attachments</h3>


                
                  <input
  type="file"
  multiple
  accept="image/*"
  onChange={handleFileChange}
  style={{
    marginBottom: '15px',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f7f7f7',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
  }}
/>


                  {/* Show existing and newly added attachments */}
                  <div
                    className="attachments-list"
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
                  >
                    {attachments.length === 0 && <p>No attachments uploaded.</p>}

                    {attachments.map((attachment, idx) => {
                      if (!attachment || typeof attachment.data !== 'string') return null;

                      const base64String = attachment.data.startsWith('data:')
                        ? attachment.data
                        : `data:image/png;base64,${attachment.data}`;

                      return (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            maxWidth: '200px',
                            borderRadius: '5px',
                            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={base64String}
                            alt={attachment.filename || `Attachment ${idx + 1}`}
                            className="attachment-image"
                            style={{ width: '100%', display: 'block' }}
                          />
                          <button
                            onClick={() => handleDownload(attachment)}
                            style={{
                              position: 'absolute',
                              bottom: '5px',
                              right: '5px',
                              background: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '4px 7px',
                              cursor: 'pointer',
                              fontSize: '0.9em',
                            }}
                            title="Download Attachment"
                          >
                            <FaDownload />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Doctor Info */}
                {(selectedRequest.homecare.status === 'approved' &&
                  selectedRequest.homecare.caretype === 'doctor' &&
                  selectedRequest.doctor) && (
                  <div className="assigned-info" style={{ marginTop: '20px' }}>
                    <p><strong>Assigned Doctor Name:</strong> {selectedRequest.doctor.fullname}</p>
                    <p><strong>Doctor Email:</strong> {selectedRequest.doctor.email}</p>
                  </div>
                )}

                 
                {(selectedRequest.homecare.status === 'approved' &&
                  selectedRequest.homecare.caretype !== 'doctor' &&
                  selectedRequest.staff) && (
                  <div className="assigned-info" style={{ marginTop: '20px' }}>
                    <p><strong>Assigned Staff Name:</strong> {selectedRequest.staff.staffname}</p>
                    <p><strong>Staff UID:</strong> {selectedRequest.staff.uid}</p>
                  </div>
                )} 
              
 {selectedRequest.assigned_staff && (
                  <div
  className="assigned-staff"
  style={{
    marginTop: '15px',
    fontWeight: 'bold',
    color: '#00e1ffff',           // white text
   // bootstrap primary blue background
    padding: '8px',
    borderRadius: '4px',
    display: 'inline-block',
  }}
>
  Assigned Staff Name: {selectedRequest.assigned_staff.staffname}
</div>

                )}

                <div className="modal-actions" style={{ marginTop: '25px' }}>
                  {canCancel(selectedRequest.homecare.timefrom) &&
                    !['cancelled', 'approved'].includes(selectedRequest.homecare.status) && (
                      <button
                        className="icon-btn cancel-btn"
                        onClick={() => handleCancel(selectedRequest.homecare.uid)}
                        title="Cancel Request"
                      >
                        <FaBan /> Cancel Request
                      </button>
                    )}

                  <button
                    className="icon-btn primary-btn"
                    onClick={handleUpdate}
                    title="Update Request"
                    style={{ marginLeft: '10px' }}
                  >
                    <FaSave /> Update Request
                  </button>
                </div>
              </div>
            )}
          </Modal>

          {popupMessage && (
            <div className="popup-message">
              {popupMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeCareServicePage;

