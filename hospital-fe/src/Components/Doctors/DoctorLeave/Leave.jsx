import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Leave.css";
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';

const DoctorLeave = () => {
  const [leaveData, setLeaveData] = useState([]); // Store fetched leave data
  const [error, setError] = useState(null); // Store error message
  const [successMessage, setSuccessMessage] = useState(null); // Store success message
  const [doctorId, setDoctorId] = useState(null); // Store doctor ID from token
  const [isEditing, setIsEditing] = useState(false); // To toggle between editing and viewing
  const [editingLeave, setEditingLeave] = useState({
    leavefrom: "",
    leaveto: "",
    reason: "",
  }); // Store leave being edited
  const [isApplyingLeave, setIsApplyingLeave] = useState(false); // Toggle applying leave form
  const [leaveFormData, setLeaveFormData] = useState({
    leavefrom: "",
    leaveto: "",
    reason: "",
  }); // Store leave data for creation form
  const navigate = useNavigate();

  // Define formatDate function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options); // Adjust the locale to your preference
  };

  // Fetch doctor leave data
  useEffect(() => {
    const fetchDoctorLeave = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/doctor-login"); // Redirect if no access token
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken); // Decode the token
        const doctorIdFromToken = decodedToken.doctorid;
        setDoctorId(doctorIdFromToken); // Set doctor ID

        const formData = new FormData();
        formData.append("doctorid", doctorIdFromToken);

        // Send doctor ID in the request
        const response = await fetch("http://localhost:5000/doctors/getallleave", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setLeaveData(data.data || []); // Set the fetched leave data
        } else {
          setError(data.message || "Failed to fetch leave data.");
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setError("An error occurred while fetching leave data.");
      }
    };

    fetchDoctorLeave(); // Call function to fetch leave data
  }, [navigate]);

  // Handle editing a leave request
  const handleEdit = (leave) => {
    setIsEditing(true);
    setEditingLeave(leave); // Set the leave data to be edited
  };

  // Handle updating leave details
  const handleUpdateLeave = async (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("leaveid", editingLeave.leaveid);
    formData.append("leavefrom", editingLeave.leavefrom);
    formData.append("leaveto", editingLeave.leaveto);
    formData.append("reason", editingLeave.reason);
    formData.append("doctorid", doctorId);

    try {
      const response = await fetch("http://localhost:5000/doctors/leaveupdate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Leave successfully updated.");
        setIsEditing(false);
        setLeaveData(
          leaveData.map((leave) =>
            leave.leaveid === editingLeave.leaveid ? editingLeave : leave
          )
        );
      } else {
        setError(data.message || "Failed to update leave.");
      }
    } catch (error) {
      setError("An error occurred while updating leave.");
    }
  };

  // Handle input change in the edit form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditingLeave({ ...editingLeave, [name]: value });
  };

  // Handle applying leave
  const handleApplyLeave = async (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("leavefrom", leaveFormData.leavefrom); // Already in YYYY-MM-DD format
    formData.append("leaveto", leaveFormData.leaveto); // Already in YYYY-MM-DD format
    formData.append("reason", leaveFormData.reason);
    formData.append("doctorid", doctorId);

    try {
      const response = await fetch("http://localhost:5000/doctors/create/leave", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Leave successfully applied.");
        setLeaveData([...leaveData, data.data]); // Add the new leave to the state
        setIsApplyingLeave(false); // Close the apply leave form
      } else {
        setError(data.message || "Failed to apply leave.");
      }
    } catch (error) {
      setError("An error occurred while applying leave.");
    }
  };

  // Handle deleting a leave request
  const handleDelete = async (leaveId) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("leaveid", leaveId);

      const response = await fetch("http://localhost:5000/doctorsops/deleteleave", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Leave successfully deleted.");
        // Remove the deleted leave from the state
        setLeaveData(leaveData.filter((leave) => leave.leaveid !== leaveId));
      } else {
        setError(data.message || "Failed to delete leave.");
      }
    } catch (error) {
      setError("An error occurred while deleting leave.");
    }
  };

  return (
    <div className="home-page">
      <DoctorNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="home-content flex flex-row">
          <DoctorSidebar />
          <div className="leave-container">
            <div className="leave-header">
              <h2>Doctor Leave</h2>
              <button
                onClick={() => setIsApplyingLeave(true)}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Apply for Leave
              </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {/* Apply Leave Form */}
            {isApplyingLeave && (
              <div className="leave-form">
                <h3>Apply Leave</h3>
                <form onSubmit={handleApplyLeave}>
                  <div>
                    <label>Leave From:</label>
                    <input
                      type="date"
                      name="leavefrom"
                      value={leaveFormData.leavefrom || ""}
                      onChange={(e) =>
                        setLeaveFormData({
                          ...leaveFormData,
                          leavefrom: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Leave To:</label>
                    <input
                      type="date"
                      name="leaveto"
                      value={leaveFormData.leaveto || ""}
                      onChange={(e) =>
                        setLeaveFormData({
                          ...leaveFormData,
                          leaveto: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label>Reason:</label>
                    <textarea
                      name="reason"
                      value={leaveFormData.reason || ""}
                      onChange={(e) =>
                        setLeaveFormData({
                          ...leaveFormData,
                          reason: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button type="submit">Submit Leave</button>
                </form>
              </div>
            )}

            {/* Edit Leave Form */}
            {isEditing && editingLeave && (
              <div className="leave-form">
                <h3>Edit Leave</h3>
                <form onSubmit={handleUpdateLeave}>
                  <div>
                    <label>Leave From:</label>
                    <input
                      type="date"
                      name="leavefrom"
                      value={editingLeave.leavefrom || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Leave To:</label>
                    <input
                      type="date"
                      name="leaveto"
                      value={editingLeave.leaveto || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label>Reason:</label>
                    <textarea
                      name="reason"
                      value={editingLeave.reason || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit">Update Leave</button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)} // Close the edit form without saving
                  >
                    Cancel
                  </button>
                </form>
              </div>
            )}

            {/* Leave Table */}
            <div className="leave-card">
              <table className="table">
                <thead>
                  <tr >
                  <th style={{ backgroundColor: "green", color: "white" }}>Leave Date (From)</th>

                    <th  style={{ backgroundColor: "green", color: "white" }}>Leave Date (To)</th>
                    <th  style={{ backgroundColor: "green", color: "white" }} >Reason</th>
                    <th  style={{ backgroundColor: "green", color: "white" }}>Status</th>
                    <th  style={{ backgroundColor: "green", color: "white" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveData.length > 0 ? (
                    leaveData.map((leave) => (
                      leave && leave.leavefrom && leave.leaveto && leave.reason ? (
                        <tr key={leave.leaveid}>
                          <td>{formatDate(leave.leavefrom)}</td>
                          <td>{formatDate(leave.leaveto)}</td>
                          <td>{leave.reason}</td>
                          <td>{leave.status}</td>
                          <td>
                            <button onClick={() => handleEdit(leave)}>Edit</button>
                            <button onClick={() => handleDelete(leave.leaveid)}>Delete</button>
                          </td>
                        </tr>
                      ) : null // Only render the row if data exists
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No leave records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLeave;
