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
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllLabBooks();
  }, []);

  const fetchAllLabBooks = async () => {
    try {
      const res = await fetch(`${API_URL}/getalllabbook`);
      const json = await res.json();
      if (json.labbook) {
        // Sort by created_at (descending)
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

  const handleCreateReport = (bookingId) => {
    navigate(`/admin/create-lab-report/${bookingId}`);
  };

  const downloadBase64File = (base64, filename) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${base64}`;
    link.download = filename;
    link.click();
  };

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
                  <p ><strong>Description:</strong> {booking.labbookdescription || '-'}</p>
                  <p><strong>Cause:</strong> {booking.cause || '-'}</p>
                  <p><small>Created: {new Date(booking.created_at).toLocaleString()}</small></p>

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
