
import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import feedbackBg from '../../Assests/background.jpg'; // place your image here
import './Feedback.css';

const API_URL = 'https://backend.medapp.transev.site';

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`${API_URL}/ops/getallsurvey`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch feedbacks');
      setFeedbacks(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (uid) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    const formData = new FormData();
    formData.append('uid', uid);

    try {
      const response = await fetch(`${API_URL}/ops/deleteappsurvey`, {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete feedback');

      setFeedbacks(prev => prev.filter(fb => fb.uid !== uid));
      alert('✅ Feedback deleted successfully');
    } catch (err) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="feedback-page">
      <AdminNavbar />
      <div className="feedback-layout">
        <AdminSidebar />
        <div className="feedback-bg" style={{ backgroundImage: `url(${feedbackBg})` }}>
          <div className="feedback-overlay">
            <h2 className="feedback-heading">📝 Patient Feedbacks</h2>

            {loading ? (
              <div className="spinner-wrapper">
                                         <FaSpinner className="loading-spinner" />
                                       </div>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : feedbacks.length === 0 ? (
              // <p className="info-text">No feedbacks available.</p>
              <p
  style={{
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '1.1rem',
    color: '#555',
  }}
>
  No feedbacks available.
</p>

            ) : (
              <div className="feedback-card-grid">
                {feedbacks.map((fb, idx) => (
                  <div
                    key={fb.uid}
                    className="feedback-card"
                    style={{ backgroundColor: idx % 2 === 0 ? '#fff3e0' : '#e8f5e9' }}
                  >
                    <h3>{fb.name}</h3>
                    <p><strong>Rating:</strong> {fb.ratingnumber} ★</p>
                    <p><strong>Type:</strong> {fb.feedbacktype}</p>
                    <p><strong>Message:</strong> {fb.feedbackmessage}</p>
                    <button
                      onClick={() => deleteFeedback(fb.uid)}
                      style={{
                        backgroundColor: '#e53935',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        marginTop: '1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      🗑️ Delete
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

export default AdminFeedbackPage;
