
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaTimesCircle, FaSave, FaBan, FaTrash, FaHome,FaClock,FaSpinner } from 'react-icons/fa';
import './HomeService.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

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

const HomeCareServicePage = () => {
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);

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
    } catch (e) {
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
    } catch (err) {
      alert('Cancellation failed.');
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('homeuid', selectedRequest.homecare.uid);
    editableFields.forEach((key) => {
      formData.append(key, selectedRequest.homecare[key]);
    });

    try {
      const res = await axios.post('http://192.168.0.106:5000/ops/updatehomecare', formData);
      alert('Updated successfully.');
      setSelectedRequest(prev => ({
        ...prev,
        homecare: { ...prev.homecare, ...res.data.data }
      }));
      fetchRequests();
    } catch (err) {
      alert('Update failed.');
    }
  };

  const handleDelete = async (uid) => {
    if (!window.confirm('Are you sure you want to permanently delete this request?')) return;

    const formData = new FormData();
    formData.append('homeuid', uid);

    try {
      const res = await axios.post('http://192.168.0.106:5000/management/deletehomecare', formData);

      if (res.data.message === 'delete success' || res.data.message === 'Delete success') {
        setRequests((prevRequests) =>
          prevRequests.filter((req) => req.homecare.uid !== uid)
        );

        if (selectedRequest?.homecare?.uid === uid) {
          setSelectedRequest(null);
        }

        setPopupMessage('Homecare deleted successfully.');
        setTimeout(() => setPopupMessage(null), 3000);

      } else {
        alert(res.data.message || 'Could not delete the request.');
      }
    } catch (err) {
      alert('Delete request failed.');
    }
  };

  const openDetails = (req) => {
    setSelectedRequest({ ...req });
  };

  const formatDateForInput = (datetime) => {
    const date = new Date(datetime);
    const iso = date.toISOString();
    return iso.substring(0, 16);
  };

  return (
    <div className="dashboard-container-homecare">
      <PatientNavbar />
      <div className="dashboard-content-homecare">
        <PatientSidebar />
        
        <div className="homecare-page">
          <h1>
            Home Care Services 🏠
            
          </h1>
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
            onRequestClose={() => setSelectedRequest(null)}
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
                    onClick={() => setSelectedRequest(null)}
                    title="Close"
                  >
                    <FaTimesCircle />
                  </button>
                </div>
                {Object.keys(selectedRequest.homecare).map((key) => {
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
                        disabled={!isEditable}
                      />
                    </div>
                  );
                })}

                {(selectedRequest.homecare.status === 'approved' &&
                  selectedRequest.homecare.caretype === 'doctor' &&
                  selectedRequest.doctor) && (
                    <div className="assigned-info">
                      <p><strong>Assigned Doctor Name:</strong> {selectedRequest.doctor.fullname}</p>
                      <p><strong>Doctor UID:</strong> {selectedRequest.doctor.uid}</p>
                    </div>
                )}

                {(selectedRequest.homecare.status === 'approved' &&
                  selectedRequest.homecare.caretype !== 'doctor' &&
                  selectedRequest.staff) && (
                    <div className="assigned-info">
                      <p><strong>Assigned Staff Name:</strong> {selectedRequest.staff.fullname}</p>
                      <p><strong>Staff UID:</strong> {selectedRequest.staff.uid}</p>
                    </div>
                )}

                <div className="modal-actions">
                  {/* {canCancel(selectedRequest.homecare.timefrom) &&
                    selectedRequest.homecare.status !== 'cancelled' && (
                      <button
                        className="icon-btn cancel-btn"
                        onClick={() =>
                          handleCancel(selectedRequest.homecare.uid)
                        }
                        title="Cancel Request"
                      >
                        <FaBan /> Cancel Request
                      </button>
                    )} */}
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
                  >
                    <FaSave /> Update Request
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default HomeCareServicePage;
