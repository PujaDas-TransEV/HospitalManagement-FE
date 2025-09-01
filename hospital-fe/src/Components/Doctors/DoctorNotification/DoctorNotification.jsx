import React, { useEffect, useState } from "react";
import './DoctorNotification.css';
import DoctorNavbar from "../DoctorNavbar/DoctorNAvbar";
import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';
import { FaTrashAlt } from "react-icons/fa";

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://backend.medapp.transev.site/notify/show/active");
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sorted);
      } else {
        console.error("Failed to load notifications.");
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;

    try {
      const formData = new FormData();
      formData.append("notificationuid", uid);

      const res = await fetch("https://backend.medapp.transev.site/notify/delete", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.uid !== uid));
      } else {
        alert(result.message || "Failed to delete notification.");
      }
    } catch (err) {
      alert("Error deleting notification: " + err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="doctor-notifications-page">
      <DoctorNavbar />
      <div className="doctor-main-content">
        <DoctorSidebar />
        <div className="notification-content">
          <h2>Notifications</h2>

          {loading ? (
            <p className="loading-text">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="no-data">No active notifications found.</p>
          ) : (
            <div className="notification-list">
              {notifications.map((n) => (
                <div key={n.uid} className="notification-item">
                  <div className="notification-info">
                    <h4>{n.notificationtitle}</h4>
                    <p>{n.notificationdescription}</p>
                    <span className="timestamp">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(n.uid)}
                    title="Delete Notification"
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
  );
};

export default DoctorNotifications;
