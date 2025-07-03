
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {
  FaSpinner,
  FaEdit,
  FaTrashAlt,
  FaCalendarPlus,
  FaTimes,
  FaSave,
  FaPaperPlane,
} from "react-icons/fa";
import DoctorNavbar from "../DoctorNavbar/DoctorNAvbar";
import DoctorSidebar from "../DoctorSidebar/Doctorsidebar";
import "./Leave.css";
import backgroundImage from "../../Assests/background.jpg";

const DoctorLeave = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [isHover, setIsHover] = useState(false);
  const [leaveFormData, setLeaveFormData] = useState({
    leavefrom: "",
    leaveto: "",
    reason: "",
  });

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchDoctorLeave = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/doctor-login");
        return;
      }
      try {
        const decodedToken = jwtDecode(accessToken);
        const doctorIdFromToken = decodedToken.doctorid;
        setDoctorId(doctorIdFromToken);

        const formData = new FormData();
        formData.append("doctorid", doctorIdFromToken);

        const response = await fetch(
          "http://192.168.0.106:5000/doctors/getallleavebydocid",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: formData,
          }
        );

        const data = await response.json();
        if (response.ok) setLeaveData(data.data || []);
        else setError(data.message || "Failed to fetch leave data.");
      } catch {
        setError("An error occurred while fetching leave data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorLeave();
  }, [navigate]);

  const submitLeave = async (isEdit) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/doctor-login");
      return;
    }

    if (isEdit && !editingLeave?.leaveid) {
      setError("No leave selected for update.");
      return;
    }

    const formData = new FormData();
    formData.append("leavefrom", leaveFormData.leavefrom);
    formData.append("leaveto", leaveFormData.leaveto);
    formData.append("reason", leaveFormData.reason);
    formData.append("doctorid", doctorId);
    if (isEdit) formData.append("leaveid", editingLeave.leaveid);

    try {
      const url = isEdit
        ? "http://192.168.0.106:5000/doctors/leaveupdate"
        : "http://192.168.0.106:5000/doctors/create/leave";

      const response = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (isEdit) {
          setLeaveData((prev) =>
            prev.map((leave) =>
              leave.leaveid === editingLeave.leaveid
                ? { ...leave, ...leaveFormData }
                : leave
            )
          );
          setSuccessMessage("Leave successfully updated.");
        } else {
          setLeaveData((prev) => [...prev, data.data]);
          setSuccessMessage("Leave successfully applied.");
        }

        setIsEditing(false);
        setEditingLeave(null);
        setIsApplyModalOpen(false);
        setLeaveFormData({ leavefrom: "", leaveto: "", reason: "" });
        setError(null);
      } else {
        setError(data.message || "Failed to submit leave.");
      }
    } catch {
      setError("An error occurred while submitting leave.");
    }
  };

  const deleteLeave = async (leaveId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/doctor-login");
      return;
    }

    const formData = new FormData();
    formData.append("leaveid", leaveId);

    try {
      const response = await fetch(
        "http://192.168.0.106:5000/doctorsops/deleteleave",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setLeaveData(leaveData.filter((leave) => leave.leaveid !== leaveId));
        setSuccessMessage("Leave successfully deleted.");
        setConfirmDelete(null);
      } else {
        setError(data.message || "Failed to delete leave.");
      }
    } catch {
      setError("An error occurred while deleting leave.");
    }
  };

  const openEditModal = (leave) => {
    if (!leave) return;
    setIsEditing(true);
    setIsApplyModalOpen(true);
    setEditingLeave(leave);
    setLeaveFormData({
      leavefrom: leave.leavefrom?.slice(0, 10) || "",
      leaveto: leave.leaveto?.slice(0, 10) || "",
      reason: leave.reason || "",
    });
  };

  const closeModal = () => {
    setIsApplyModalOpen(false);
    setIsEditing(false);
    setEditingLeave(null);
    setLeaveFormData({ leavefrom: "", leaveto: "", reason: "" });
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div
      className="dashboard-container-settings"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <DoctorNavbar />
      <div className="dashboard-content-settings">
        <DoctorSidebar />
        <div className="content">
          <h1>Doctor Leave Management</h1>

          {isLoading && (
            <div className="loading-overlay" aria-label="Loading">
              <FaSpinner className="spinner-icon" />
            </div>
          )}

          <div className="apply-leave-btn-wrapper">
            <button
              className="apply-leave-btn"
              onClick={() => {
                setIsApplyModalOpen(true);
                setIsEditing(false);
                setEditingLeave(null);
                setLeaveFormData({ leavefrom: "", leaveto: "", reason: "" });
              }}
            >
              <FaCalendarPlus className="icon" /> Apply for Leave
            </button>
          </div>

          {error && <div className="alert error">{error}</div>}
          {successMessage && <div className="alert success">{successMessage}</div>}

         
<div className="leave-list">

  {/* Desktop Table */}
  <div className="desktop-table">
    <table className="leave-table">
      <thead>
        <tr>
        <th className="th-from" style={{ backgroundColor: '#005f73', color: 'white' }}>From</th>
<th className="th-to" style={{ backgroundColor: '#0a9396', color: 'white' }}>To</th>
<th className="th-reason" style={{ backgroundColor: '#94d2bd', color: 'white' }}>Reason</th>
<th className="th-actions" style={{ backgroundColor: '#ee9b00', color: 'white' }}>Actions</th>

        </tr>
      </thead>
      <tbody>
        {Array.isArray(leaveData) && leaveData.length > 0 ? (
          leaveData
            .filter((l) => l?.leavefrom && l?.leaveto)
            .map((l) => (
              <tr key={l.leaveid}>
                <td>{formatDate(l.leavefrom)}</td>
                <td>{formatDate(l.leaveto)}</td>
                <td>{l.reason || "-"}</td>
                <td>
                  <FaEdit
                    title="Edit"
                    onClick={() => openEditModal(l)}
                    className="icon action-icon"
                  />
                  <FaTrashAlt
                    title="Delete"
                    onClick={() => setConfirmDelete(l.leaveid)}
                    className="icon action-icon"
                  />
                </td>
              </tr>
            ))
        ) : (
          <tr>
            <td colSpan={4} style={{ textAlign: "center" }}>
              No leave data found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Mobile Cards */}
  <div className="mobile-cards">
    {Array.isArray(leaveData) && leaveData.length > 0 ? (
      leaveData
        .filter((l) => l?.leavefrom && l?.leaveto)
        .map((l) => (
          <div className="leave-card" key={l.leaveid}>
            <div><strong>From:</strong> {formatDate(l.leavefrom)}</div>
            <div><strong>To:</strong> {formatDate(l.leaveto)}</div>
            <div><strong>Reason:</strong> {l.reason || "-"}</div>
            <div className="card-actions">
              <FaEdit
                title="Edit"
                onClick={() => openEditModal(l)}
                className="icon action-icon"
              />
              <FaTrashAlt
                title="Delete"
                onClick={() => setConfirmDelete(l.leaveid)}
                className="icon action-icon"
              />
            </div>
          </div>
        ))
    ) : (
      <div style={{ textAlign: "center" }}>No leave data found.</div>
    )}
  </div>
</div>

          {/* Apply/Edit Modal */}
          {isApplyModalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <h2>{isEditing ? "Edit Leave" : "Apply for Leave"}</h2>
                <form
                  style={{
                    backgroundColor: "#e0f7fa",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitLeave(isEditing);
                  }}
                >
                  <label>
                    From:
                    <input
                      type="date"
                      value={leaveFormData.leavefrom}
                      onChange={(e) =>
                        setLeaveFormData((prev) => ({
                          ...prev,
                          leavefrom: e.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                  <label>
                    To:
                    <input
                      type="date"
                      value={leaveFormData.leaveto}
                      onChange={(e) =>
                        setLeaveFormData((prev) => ({
                          ...prev,
                          leaveto: e.target.value,
                        }))
                      }
                      required
                    />
                  </label>
                  <label>
                    Reason:
                    <textarea
                      value={leaveFormData.reason}
                      onChange={(e) =>
                        setLeaveFormData((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      required
                      style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1.5px solid #ccc",
                        fontSize: "1rem",
                        fontFamily:
                          '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                        resize: "vertical",
                        outlineColor: "#0077cc",
                        boxSizing: "border-box",
                      }}
                    />
                  </label>

                  <div className="form-actions">
                    <button type="submit" className={isEditing ? "update-btn" : ""}   style={{
      width: '120px',
      padding: '8px 0',
      fontSize: '14px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      color: 'white',
      background: 'linear-gradient(to right, #0a3b84, #2568a8)',
      marginRight: '10px'
    }}>
                      {isEditing ? (
                        <>
                          <FaSave /> Update
                        </>
                      ) : (
                        <>
                          <FaPaperPlane /> Submit
                        </>
                      )}
                    </button>
                    <button type="button" onClick={closeModal}>
                      <FaTimes />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation */}
          {confirmDelete && (
            <div
              className="modal-overlay"
              onClick={() => setConfirmDelete(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
              }}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  maxWidth: "400px",
                  width: "90%",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  textAlign: "center",
                }}
              >
                <h3>Confirm Delete</h3>
                <p>Are you sure you want to delete this leave?</p>
                <button
                  onClick={() => deleteLeave(confirmDelete)}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                  style={{
                    backgroundColor: isHover ? "#d32f2f" : "#e53935",
                    color: "#fff",
                    border: "none",
                    padding: "10px 20px",
                    marginRight: "10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  style={{
                    backgroundColor: "#ccc",
                    color: "#333",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorLeave;
