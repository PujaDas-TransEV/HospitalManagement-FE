
import React, { useEffect, useState } from 'react';
import './Feedback.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://192.168.0.106:5000/ops/getallsurvey');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch feedbacks');
        setFeedbacks(data.data || []);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="manage-patients-container">
      <AdminNavbar />
      <div className="manage-patients-content">
        <AdminSidebar />
        <div className="admin-feedback-container">
          <h2>📝 Patient Feedbacks</h2>

          {loading ? (
            <p>Loading feedbacks...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : feedbacks.length === 0 ? (
            <p>No feedbacks available.</p>
          ) : (
            <div className="feedback-list">
              {feedbacks.map((feedback) => (
                <div key={feedback.uid} className="feedback-card">
                  <h3>{feedback.name}</h3>
                  <p><strong>Rating:</strong> {feedback.ratingnumber} ★</p>
                  <p><strong>Type:</strong> {feedback.feedbacktype}</p>
                  <p><strong>Message:</strong> {feedback.feedbackmessage}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackPage;
