// import React, { useEffect, useState } from "react";
// import './DoctorNotification.css';
// import DoctorNavbar from "../DoctorNavbar/DoctorNAvbar";
// import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';
// import { FaTrashAlt } from "react-icons/fa";

// const DoctorNotifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("https://backend.medapp.transev.site/notify/show/active");
//       const data = await res.json();

//       if (res.ok && Array.isArray(data)) {
//         const sorted = data.sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         );
//         setNotifications(sorted);
//       } else {
//         console.error("Failed to load notifications.");
//       }
//     } catch (err) {
//       console.error("Error fetching notifications:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (uid) => {
//     if (!window.confirm("Are you sure you want to delete this notification?")) return;

//     try {
//       const formData = new FormData();
//       formData.append("notificationuid", uid);

//       const res = await fetch("https://backend.medapp.transev.site/notify/delete", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await res.json();

//       if (res.ok) {
//         setNotifications((prev) => prev.filter((n) => n.uid !== uid));
//       } else {
//         alert(result.message || "Failed to delete notification.");
//       }
//     } catch (err) {
//       alert("Error deleting notification: " + err.message);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   return (
//     <div className="doctor-notifications-page">
//       <DoctorNavbar />
//       <div className="doctor-main-content">
//         <DoctorSidebar />
//         <div className="notification-content">
//           <h2>Notifications</h2>

//           {loading ? (
//             <p className="loading-text">Loading notifications...</p>
//           ) : notifications.length === 0 ? (
//             <p className="no-data">No active notifications found.</p>
//           ) : (
//             <div className="notification-list">
//               {notifications.map((n) => (
//                 <div key={n.uid} className="notification-item">
//                   <div className="notification-info">
//                     <h4>{n.notificationtitle}</h4>
//                     <p>{n.notificationdescription}</p>
//                     <span className="timestamp">
//                       {new Date(n.created_at).toLocaleString()}
//                     </span>
//                   </div>
//                   <button
//                     className="delete-button"
//                     onClick={() => handleDelete(n.uid)}
//                     title="Delete Notification"
//                   >
//                     <FaTrashAlt />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorNotifications;

import React, { useEffect, useState, useRef } from "react";
import "./DoctorNotification.css";
import DoctorNavbar from "../DoctorNavbar/DoctorNAvbar";
import DoctorSidebar from "../DoctorSidebar/Doctorsidebar";
import { io } from "socket.io-client";

const SOCKET_URL = "wss://backend.medapp.transev.site";

const DoctorNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState(null);
  const socketRef = useRef(null);

  // ✅ Get doctor ID from localStorage (set on login)
  const doctorid = localStorage.getItem("userIdJAT");

  useEffect(() => {
    if (!doctorid) {
      console.warn("❌ Doctor ID missing. Cannot connect to WebSocket.");
      setLoading(false);
      setServerMessage("Doctor ID not found. Please log in again.");
      return;
    }

    // 🔌 Connect to WebSocket
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
      // 📤 Send doctor ID to request notifications
      socket.emit("docstaffidnote", { doctorid });
    });

    socket.on("message", (msg) => {
      setLoading(false);

      if (msg.error) {
        console.error("❌ Socket Error:", msg.error);
        setServerMessage("Error fetching notifications.");
        return;
      }

      if (msg.notifications && Array.isArray(msg.notifications)) {
        // 🧠 Merge and deduplicate notifications
        setNotifications((prev) => {
          const combined = [...msg.notifications, ...prev];
          const uniqueMap = new Map();
          combined.forEach((notif) => {
            uniqueMap.set(notif.notification_id, notif);
          });

          return Array.from(uniqueMap.values()).sort((a, b) => {
            const dateA = new Date(a.created_at || Date.now());
            const dateB = new Date(b.created_at || Date.now());
            return dateB - dateA;
          });
        });
      }

      if (msg.message) {
        console.log("ℹ️ Server Message:", msg.message);
        setServerMessage(msg.message);
      }
    });

    socket.on("connect_error", (err) => {
      setLoading(false);
      console.error("❌ Socket connection error:", err.message);
      setServerMessage("WebSocket connection failed.");
    });

    // 🔌 Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [doctorid]);

  return (
    <div className="doctor-notifications-page">
      <DoctorNavbar />
      <div className="doctor-main-content">
        <DoctorSidebar />
        <div className="notification-content">
          <h2>Doctor Notifications</h2>

          {loading ? (
            <p className="loading-text">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="no-data">
              {serverMessage || "No notifications available."}
            </p>
          ) : (
            <div className="notification-list">
              {notifications.map((n) => (
                <div key={n.notification_id} className="notification-item">
                  <div className="notification-info">
                    <h4>{n.notificationtype || "General"}</h4>
                    <p>{n.message}</p>
                    <span className="timestamp">
                      {new Date(n.created_at || Date.now()).toLocaleString()}
                    </span>
                    <span
                      className={`seen-status ${
                        n.seennotify === "true" ? "seen" : "unseen"
                      }`}
                    >
                      {n.seennotify === "true" ? "Seen" : "Unseen"}
                    </span>
                  </div>
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
