
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import './HomeService.css';
import PatientNavbar  from '../Navbar/PatientNavbar';
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
        'http://localhost:5000/management/homecare/gethomecarebypatientid',
        formData
      );
      setRequests(res.data.data || []);
    } catch (e) {
      alert('Failed to fetch home care requests.');
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
      await axios.post('http://localhost:5000/management/homecare/cancelstatus', formData);
      alert('Request cancelled.');
      setSelectedRequest(null);
      fetchRequests();
    } catch (err) {
      alert('Cancellation failed.');
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('uid', selectedRequest.homecare.uid);
    editableFields.forEach((key) => {
      formData.append(key, selectedRequest.homecare[key]);
    });

    try {
      const res = await axios.post('http://localhost:5000/ops/updatehomecare', formData);
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
    const res = await axios.post('http://localhost:5000/management/deletehomecare', formData);

    if (res.data.message === 'Delete success') {
      alert('Request deleted successfully.');

      // Remove the deleted request from state
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.homecare.uid !== uid)
      );

      // Close modal if it's open for this uid
      if (selectedRequest?.homecare?.uid === uid) {
        setSelectedRequest(null);
      }
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
    return iso.substring(0, 16); // yyyy-MM-ddTHH:mm
  };

  return (
     <div className="dashboard-container">
      {/* Navbar at the top */}
      <PatientNavbar />
      
      <div className="dashboard-content">
        {/* Sidebar for navigation */}
        <PatientSidebar />
    <div className="homecare-page">
      <h1>Home Care Services</h1>

      <button className="primary-btn" onClick={() => navigate('/home-care-request')}>
        Request Home Care Service
      </button>

      <h2>My Home Care Requests</h2>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No home care requests found.</p>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req.homecare.uid} className="request-card">
              <p><strong>Status:</strong> {req.homecare.status}</p>
              <p><strong>Time:</strong> {req.homecare.timefrom} - {req.homecare.timeto}</p>
              <p><strong>Patient:</strong> {req.homecare.patientname}</p>
              <p><strong>Home Care Booking:</strong> {req.homecare.caretype}</p>
              <div className="card-actions">
                <button onClick={() => openDetails(req)}>View Details</button>
                {req.homecare.status === 'cancelled' && (
                  <button className="delete-btn" onClick={() => handleDelete(req.homecare.uid)}>
                    Delete
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
        className="modal-content"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={true}
      >
        {selectedRequest && (
          <div>
            <h2>Request Details</h2>
            {Object.keys(selectedRequest.homecare).map((key) => {
              const value = selectedRequest.homecare[key];
              if (value === 'None' || value === null || value === undefined || value === '') return null;

              const isEditable = editableFields.includes(key);
              const isDateTime = key === 'timefrom' || key === 'timeto';

              return (
                <div key={key} className="modal-field">
                  <label>{key}</label>
                  <input
                    type={isDateTime ? 'datetime-local' : 'text'}
                    value={isDateTime ? formatDateForInput(value) : value}
                    onChange={(e) =>
                      setSelectedRequest({
                        ...selectedRequest,
                        homecare: {
                          ...selectedRequest.homecare,
                          [key]: isDateTime ? new Date(e.target.value).toISOString() : e.target.value
                        }
                      })
                    }
                    disabled={!isEditable}
                  />
                </div>
              );
            })}
            <div className="modal-actions">
              {canCancel(selectedRequest.homecare.timefrom) &&
                selectedRequest.homecare.status !== 'cancelled' && (
                  <button className="cancel-btn" onClick={() => handleCancel(selectedRequest.homecare.uid)}>
                    Cancel Request
                  </button>
                )}
              <button className="primary-btn" onClick={handleUpdate}>Update Request</button>
              <button className="secondary-btn" onClick={() => setSelectedRequest(null)}>Close</button>
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
