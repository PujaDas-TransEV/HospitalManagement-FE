
import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaSpinner } from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import supportBg from '../../Assests/background.jpg'; // Adjust path as needed
import './AdminSupport.css';

const API_URL = 'http://192.168.0.106:5000';

const AdminSupport = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupportTickets = async () => {
      try {
        const response = await fetch(`${API_URL}/ops/getallsupport`);
        const data = await response.json();
        setSupportTickets(data.data || []);
      } catch (error) {
        setError('Error fetching support tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupportTickets();
  }, []);

  const handleDelete = async (supportId) => {
    if (window.confirm('Are you sure you want to delete this support ticket?')) {
      const formData = new FormData();
      formData.append('supportid', supportId);

      try {
        const response = await fetch(`${API_URL}/ops/deletesupport`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.message) {
          setSupportTickets((prev) =>
            prev.filter((ticket) => ticket.uid !== supportId)
          );
        } else {
          alert('Error deleting support ticket.');
        }
      } catch (error) {
        console.error('Error deleting support ticket:', error);
        alert('Error deleting support ticket.');
      }
    }
  };

  return (
    <div className="admin-support-page">
      <AdminNavbar />
      <div className="admin-support-layout">
        <AdminSidebar />

        {/* Background image wrapper */}
        <div
          style={{
            backgroundImage: `url(${supportBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* White overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.53)',
              zIndex: 1,
              padding: '2rem',
              overflowY: 'auto',
            }}
          >
            <h2 className="support-heading">All Support Tickets</h2>

            {loading ? (
              <div className="spinner-wrapper">
                <FaSpinner className="loading-spinner" />
              </div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : supportTickets.length === 0 ? (
              <p className="no-tickets">No support tickets available.</p>
            ) : (
              <div className="support-card-grid">
                {supportTickets.map((ticket) => (
           <div key={ticket.uid} className="support-card">
  <p><strong>ID:</strong> {ticket.uid}</p>
  <p><strong>Name:</strong> {ticket.name}</p>
  <p><strong>Email:</strong> {ticket.email}</p>
  <p><strong>Phone:</strong> {ticket.phone}</p>
  <p><strong>Issue Type:</strong> {ticket.issuetype}</p>
  <p><strong>Message:</strong> {ticket.message}</p>

  {/* ✅ New Section: Document Attachments */}
  {ticket.documents && ticket.documents.length > 0 && (
    <div className="support-documents">
      <strong>Attachments:</strong>
      <div className="attachment-preview-list">
        {ticket.documents.map((doc, index) => {
          const isImage = doc.filename.match(/\.(jpeg|jpg|png|gif|bmp)$/i);
          const mimeType = doc.filename.match(/\.pdf$/i)
            ? 'application/pdf'
            : 'image/*';

          return (
            <div key={index} className="attachment-preview">
              {isImage ? (
                <img
                  src={`data:${mimeType};base64,${doc.base64}`}
                  alt={doc.filename}
                  className="attachment-image"
                />
              ) : (
                <a
                  href={`data:${mimeType};base64,${doc.base64}`}
                  download={doc.filename}
                  className="attachment-link"
                >
                  Download {doc.filename}
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  )}

  <button
    className="delete-btn"
    onClick={() => handleDelete(ticket.uid)}
  >
    <FaTrashAlt />
  </button>
</div>

                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
