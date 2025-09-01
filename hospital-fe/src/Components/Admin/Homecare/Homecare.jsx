
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes, FaSpinner, FaEye } from 'react-icons/fa';
import './Homecare.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

function HomecareAdminPanel() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    doctorid: '',
    assignedstaffid: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [staffInfoMap, setStaffInfoMap] = useState({});
  const [loadingStaffNames, setLoadingStaffNames] = useState(true);

  const [attachmentModal, setAttachmentModal] = useState({ open: false, attachment: null });

  const editableFields = ['status', 'doctorid', 'assignedstaffid'];

  // Track screen size for responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch requests & staff info
  const fetchRequests = async () => {
    try {
      const response = await fetch('https://backend.medapp.transev.site/management/homecare');
      let data = await response.json();

      data.sort((a, b) => new Date(b.createdat) - new Date(a.createdat));

      setRequests(data);

      const uniqueStaffIDs = [...new Set(data.map(req => req.assignedstaffid).filter(id => id))];
      if (uniqueStaffIDs.length === 0) {
        setLoadingStaffNames(false);
        return;
      }

      setLoadingStaffNames(true);

      const staffMap = {};
      await Promise.all(
        uniqueStaffIDs.map(async (staffid) => {
          const formData = new FormData();
          formData.append('staffid', staffid);

          try {
            const response = await fetch('https://backend.medapp.transev.site/ops/getstaffdetailsbyid', {
              method: 'POST',
              body: formData,
            });
            const json = await response.json();
            staffMap[staffid] = json?.data || { staffname: 'Unknown' };
          } catch (error) {
            console.error('Error fetching staff details for ID:', staffid, error);
            staffMap[staffid] = { staffname: 'Error' };
          }
        })
      );

      setStaffInfoMap(staffMap);
      setLoadingStaffNames(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoadingStaffNames(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch('https://backend.medapp.transev.site/ops/listofstaff');
      const data = await res.json();
      setStaffList(data.data || []);
    } catch (err) {
      console.error('Error fetching staff list:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('https://backend.medapp.transev.site/doctorops/getalldoctor');
      const data = await res.json();
      setDoctors(data.data || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchStaff(), fetchDoctors()]).then(fetchRequests);
  }, []);

  const handleEditClick = (req) => {
    setSelectedRequest(req);
    setFormData({
      status: req.status || '',
      doctorid: req.doctorid || '',
      assignedstaffid: req.assignedstaffid || ''
    });
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedRequest(null);
    document.body.style.overflow = 'auto';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('homeuid', selectedRequest.uid);

    editableFields.forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.post('https://backend.medapp.transev.site/ops/updatehomecare', formDataToSend);
      alert('Updated successfully.');

      const updatedStaff = staffList.find(staff => staff.uid === formData.assignedstaffid);
      const updatedDoctor = doctors.find(doc => doc.uid === formData.doctorid);

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.uid === selectedRequest.uid
            ? {
                ...req,
                status: formData.status,
                assignedstaffid: formData.assignedstaffid || req.assignedstaffid,
                doctorid: formData.doctorid || req.doctorid,
                assignedstaffname: updatedStaff ? updatedStaff.staffname : req.assignedstaffname,
                refrencedoctorname: updatedDoctor ? updatedDoctor.fullname : req.refrencedoctorname,
              }
            : req
        )
      );

      fetchRequests();
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      case 'scheduled':
        return '#2196F3';
      case 'pending':
        return '#FF9800';
      case 'rejected':
        return '#9E9E9E';
      default:
        return '#000';
    }
  };

  // Open attachment modal to view image
  const openAttachmentModal = (attachment) => {
    setAttachmentModal({ open: true, attachment });
    document.body.style.overflow = 'hidden';
  };

  const closeAttachmentModal = () => {
    setAttachmentModal({ open: false, attachment: null });
    document.body.style.overflow = 'auto';
  };
  const downloadAttachment = (attachment) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${attachment.data}`;
    link.download = attachment.filename || 'attachment.png';
    link.click();
  };
  // Render cards (always cards, no table)
  const renderCards = () => (
    <div className="cards-container-homecare">
      {requests.map((req) => {
        const doctor = doctors.find(doc => doc.uid === req.doctorid);
        const patientName = req.patientname && req.patientname.toLowerCase() !== 'null null' ? req.patientname : '';

        return (
          <div
            key={req.uid}
            className="card-homecare"
            style={{ borderLeft: `6px solid ${getStatusColor(req.status)}` }}
          >
            <p><strong>Patient:</strong> {patientName || '-'}</p>
            <p><strong>Care Type:</strong> {req.caretype}</p>
            <p><strong>Status:</strong> <span style={{ color: getStatusColor(req.status), fontWeight: 'bold' }}>{req.status}</span></p>
            <p><strong>Doctor ID:</strong> {req.caretype === 'doctor' ? (req.doctorid || '-') : '-'}</p>
            <p><strong>Doctor Name:</strong> {req.caretype === 'doctor' ? (doctor ? doctor.fullname : '-') : '-'}</p>
            <p><strong>Referenced Doctor Name:</strong> {req.caretype === 'doctor' ? (req.refrencedoctorname || '-') : '-'}</p>
            <p><strong>Staff:</strong> {req.assignedstaffid ? `${req.assignedstaffid} (${staffInfoMap[req.assignedstaffid]?.staffname || 'Loading...'})` : '-'}</p>
            <p><strong>Time From:</strong> {req.timefrom || '-'}</p>
            <p><strong>Time To:</strong> {req.timeto || '-'}</p>

            {/* Attachments */}
           {req.attachments?.length > 0 ? (
                      req.attachments.map((att, idx) => (
                        <button
                          key={idx}
                          className="view-attachment-btn"
                          onClick={() => downloadAttachment(att)}
                        >
                          <FaEye style={{ marginRight: '6px', color: '#007bff' }} />
                          View Attachment
                        </button>
                      ))
                    ) : (
                      <p><em>No attachments</em></p>
                    )}

            <button onClick={() => handleEditClick(req)} className="edit-btn-homecare">
              <FaEdit /> Edit
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="facility-management-page-homecare">
      <AdminNavbar />
      <div className="facility-management-content-homecare">
        <AdminSidebar />
        <div className="admin-panel" style={{ maxWidth: '1200px', margin: '20px auto' }}>
          <h1>Homecare Requests (Admin) 🏠</h1>

          {loadingStaffNames ? (
            <FaSpinner className="spin large" />
          ) : (
            renderCards()
          )}

          {/* Edit Modal */}
          {selectedRequest && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={e => e.stopPropagation()}  style={{
    backgroundColor: '#d0f3f3ff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '90%',
  }}>
                <h3>Edit Homecare Request</h3>
                {editableFields.map((field) => {
                  if (field === 'status') {
                    return (
                      <div key={field} className="form-group">
                        <label>Status:</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    );
                  } else if (field === 'doctorid') {
                    return (
                      <div key={field} className="form-group">
                        <label>Doctor:</label>
                        <select name="doctorid" value={formData.doctorid} onChange={handleChange}>
                          <option value="">-- Select Doctor --</option>
                          {doctors.map(doc => (
                            <option key={doc.uid} value={doc.uid}>
                              {doc.fullname}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  } else if (field === 'assignedstaffid') {
                    return (
                      <div key={field} className="form-group">
                        <label>Assign Staff:</label>
                        <select name="assignedstaffid" value={formData.assignedstaffid} onChange={handleChange}>
                          <option value="">-- Select Staff --</option>
                          {staffList.map(staff => (
                            <option key={staff.uid} value={staff.uid}>
                              {staff.staffname}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  return null;
                })}

                <div className="modal-actions">
                  <button onClick={handleUpdate} className="save-btn">
                    <FaSave /> Save
                  </button>
                  <button onClick={closeModal} className="cancel-btn">
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attachment Modal */}
          {attachmentModal.open && (
            <div className="modal-overlay" onClick={closeAttachmentModal}>
              <div className="modal-content attachment-modal" onClick={e => e.stopPropagation()}>
                <button className="close-attachment-btn" onClick={closeAttachmentModal}><FaTimes /></button>
                <img
                  src={`data:image/png;base64,${attachmentModal.attachment.data}`}
                  alt={attachmentModal.attachment.filename || 'Attachment'}
                  style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomecareAdminPanel;
