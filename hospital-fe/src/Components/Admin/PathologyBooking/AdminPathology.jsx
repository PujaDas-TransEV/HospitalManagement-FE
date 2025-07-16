import React, { useState, useEffect } from 'react';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { FaNotesMedical, FaUser, FaCalendarAlt, FaStethoscope, FaFileMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AdminPathology.css';

const API_URL = 'http://192.168.0.106:5000';

const AdminPathologyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/pathologybookings`);
      const json = await res.json();
      if (json.bookings) {
        setBookings(json.bookings);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = (bookingId) => {
    navigate(`/admin/create-lab-report/${bookingId}`);
  };

  return (
    <div className="admin-dashboard-container-pathology">
      <AdminNavbar />
      <div className="admin-dashboard-content-pathology">
        <AdminSidebar />
        <main className="admin-main-content-pathology">
          <h1>All Pathology Bookings</h1>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="booking-cards-container">
              {bookings.map((booking) => (
                <div className="booking-card" key={booking.uid}>
                  <h3><FaNotesMedical /> {booking.labbookname}</h3>
                  <p><FaUser /> <strong>Patient:</strong> {booking.patient_name || booking.patient_email || 'N/A'}</p>
                  <p><FaStethoscope /> <strong>Doctor:</strong> {booking.doctor_reference || 'N/A'}</p>
                  <p><FaCalendarAlt /> <strong>Time:</strong> {new Date(booking.booking_time).toLocaleString()}</p>
                  <p><strong>Description:</strong> {booking.labbookdescription || '-'}</p>
                  <p><strong>Cause:</strong> {booking.cause || '-'}</p>
                  <p><small>Created: {new Date(booking.created_at).toLocaleString()}</small></p>

                  {booking.attachment && (
                    <div className="attachment">
                      <strong>Attachment:</strong>
                      <img src={`data:image/jpeg;base64,${booking.attachment}`} alt="Attachment" />
                    </div>
                  )}

                  <button className="create-report-btn" onClick={() => handleCreateReport(booking.uid)}>
                    <FaFileMedical /> Create Lab Report
                  </button>
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
