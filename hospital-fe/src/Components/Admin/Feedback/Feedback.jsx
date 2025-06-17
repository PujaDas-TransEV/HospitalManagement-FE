
import React, { useEffect, useState } from 'react';
import './Feedback.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const AdminFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all feedbacks
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

  // Delete a single feedback by UID
  const deleteFeedback = async (uid) => {
    const formData = new FormData();
    formData.append('uid', uid);

    try {
      const response = await fetch('http://localhost:5000/ops/deleteappsurvey', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete feedback');

      alert('✅ Feedback deleted successfully');
      // Remove the deleted feedback from the UI
      setFeedbacks((prev) => prev.filter((fb) => fb.uid !== uid));
    } catch (err) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  useEffect(() => {
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
                  <button
                    className="delete-btn"
                    onClick={() => deleteFeedback(feedback.uid)}
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
  );
};

export default AdminFeedbackPage;
