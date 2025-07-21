
import React, { useEffect, useState } from 'react';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import {
  FaNotesMedical,
  FaUser,
  FaCalendarAlt,
  FaStethoscope,
  FaFileMedical,
  FaSpinner,
  FaDownload,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminPathology.css';

const API_URL = 'http://192.168.0.106:5000';

const AdminPathologyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllLabBooks();
  }, []);

  const fetchAllLabBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/getalllabbook`);
      const json = await res.json();
      if (json.labbook) {
        const sorted = [...json.labbook].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setBookings(sorted);
      }
    } catch (err) {
      console.error('Failed to fetch lab books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (uid, value) => {
    setStatusMap((prev) => ({ ...prev, [uid]: value }));
  };

  const updateStatus = async (booking) => {
    const selectedStatus = statusMap[booking.uid];
    if (!selectedStatus) return alert('👉 Please select a status.');

    try {
      const formData = new FormData();

      // Required fields - include all current booking info to avoid overwriting with "None"
      formData.append('labbookid', booking.uid);
      formData.append('tempbookingstatus', selectedStatus);
  formData.append('labbookdescription', booking.labbookdescription|| '');
   formData.append('labtesttype', booking.labtesttype|| '');
      formData.append('cause', booking.cause || '');
      formData.append('doctor_reference', booking.doctor_reference || '');
      formData.append('labbookname', booking.labbookname || '');
      formData.append('email', booking.patient_email || '');
      formData.append('patient_firstname', booking.patient_firstname || '');
      formData.append('patient_lastname', booking.patient_lastname || '');
      formData.append('patient_phone', booking.patient_phone || '');

      // If you want to add more fields, do so here
      // e.g. formData.append('labbookdescription', booking.labbookdescription || '');

      const res = await fetch(`${API_URL}/labbookupdate`, {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (res.ok && json.updated_fields?.tempbookingstatus) {
        const updatedStatus = json.updated_fields.tempbookingstatus;
        setBookings((prev) =>
          prev.map((b) =>
            b.uid === booking.uid ? { ...b, tempbookingstatus: updatedStatus } : b
          )
        );
        alert(`✅ Status updated to "${updatedStatus}"`);
        setStatusMap((prev) => ({ ...prev, [booking.uid]: '' }));
      } else {
        alert('❗ Update failed.');
        console.error(json.error);
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('❗ Error updating.');
    }
  };

  const handleCreateReport = (bookingId) => {
    navigate(`/admin/create-lab-report/${bookingId}`);
  };

  const downloadBase64File = (base64, filename) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64}`;
    link.download = filename;
    link.click();
  };

  const statusOptions = [
    'Accepted',
    'Rejected',
    'Sample Collected',
    'Report Generating',
    'Completed',
  ];

  return (
    <div className="admin-dashboard-container-pathology">
      <AdminNavbar />
      <div className="admin-dashboard-content-pathology">
        <AdminSidebar />
        <main className="admin-main-content-pathology">
          <div className="top-bar">
            <h1>All Lab Bookings</h1>
            <button
              className="create-report-top-btn"
              onClick={() => navigate('/admin/labreport')}
            >
              <FaFileMedical /> Create Lab Report
            </button>
          </div>

          {loading ? (
            <div
              className="spinner-center"
              style={{ fontSize: '2rem', color: '#007bff', textAlign: 'center', padding: '2rem' }}
            >
              <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div className="booking-cards-container">
              {bookings.map((booking) => (
                <div className="booking-card" key={booking.uid}>
                  <h3><FaNotesMedical /> {booking.labbookname}</h3>
                  <p><FaUser /> <strong>Patient:</strong> {booking.patient_firstname} {booking.patient_lastname}</p>
                  <p><strong>Email:</strong> {booking.patient_email}</p>
                  <p><FaStethoscope /> <strong>Doctor:</strong> {booking.doctor_reference}</p>
                  <p><FaCalendarAlt /> <strong>Time:</strong> {new Date(booking.booking_time).toLocaleString()}</p>
                  <p><strong>Description:</strong> {booking.labbookdescription || '-'}</p>
                  <p><strong>Cause:</strong> {booking.cause || '-'}</p>
                  <p><small>Created: {new Date(booking.created_at).toLocaleString()}</small></p>

                  <p><strong>Status:</strong> {booking.tempbookingstatus || 'Pending'}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}>
                    <select
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1.5px solid #007bff',
                        backgroundColor: '#fff',
                        color: '#007bff',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        minWidth: '180px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease',
                      }}
                      value={statusMap[booking.uid] || ''}
                      onChange={(e) => handleStatusChange(booking.uid, e.target.value)}
                      onFocus={e => e.target.style.borderColor = '#0056b3'}
                      onBlur={e => e.target.style.borderColor = '#007bff'}
                    >
                      <option value="">-- Update Status --</option>
                      {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <button
                      style={{
                        padding: '8px 18px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#4ba9b6ff',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 3px 6px rgba(0,123,255,0.4)',
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#0056b3')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#007bff')}
                      onClick={() => updateStatus(booking)}
                    >
                      Update Status
                    </button>
                  </div>

                  {booking.attachment_base64 && (
                    <div className="attachment">
                      <strong>Attachment:</strong>
                      <img
                        src={`data:image/jpeg;base64,${booking.attachment_base64}`}
                        alt="Attachment"
                        className="attachment-img"
                      />
                      <button
                        className="download-btn"
                        onClick={() => downloadBase64File(booking.attachment_base64, `attachment-${booking.uid}.jpg`)}
                      >
                        <FaDownload /> Download
                      </button>
                    </div>
                  )}
               
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPathologyBookings;
