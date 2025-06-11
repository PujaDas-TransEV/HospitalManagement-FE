
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';
import './Leave.css';
const DoctorLeave = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLeave, setEditingLeave] = useState({ leavefrom: "", leaveto: "", reason: "" });
  const [isApplyingLeave, setIsApplyingLeave] = useState(false);
  const [leaveFormData, setLeaveFormData] = useState({ leavefrom: "", leaveto: "", reason: "" });
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
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

        const response = await fetch("http://192.168.0.105:5000/doctors/getallleavebydocid", {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) setLeaveData(data.data || []);
        else setError(data.message || "Failed to fetch leave data.");
      } catch (error) {
        setError("An error occurred while fetching leave data.");
      }
    };
    fetchDoctorLeave();
  }, [navigate]);

  const handleEdit = (leave) => {
    setIsEditing(true);
    setEditingLeave(leave);
    setIsApplyingLeave(false);
    setError(null);
    setSuccessMessage(null);
  };

  const handleUpdateLeave = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("leaveid", editingLeave.leaveid);
    formData.append("leavefrom", editingLeave.leavefrom);
    formData.append("leaveto", editingLeave.leaveto);
    formData.append("reason", editingLeave.reason);
    formData.append("doctorid", doctorId);

    try {
      const response = await fetch("http://192.168.0.105:5000/doctors/leaveupdate", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Leave successfully updated.");
        setIsEditing(false);
        setLeaveData((prev) =>
          prev.map((leave) =>
            leave.leaveid === editingLeave.leaveid ? editingLeave : leave
          )
        );
      } else {
        setError(data.message || "Failed to update leave.");
      }
    } catch {
      setError("An error occurred while updating leave.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingLeave({ ...editingLeave, [name]: value });
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("leavefrom", leaveFormData.leavefrom);
    formData.append("leaveto", leaveFormData.leaveto);
    formData.append("reason", leaveFormData.reason);
    formData.append("doctorid", doctorId);

    try {
      const response = await fetch("http://192.168.0.105:5000/doctors/create/leave", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Leave successfully applied.");
        setLeaveData([...leaveData, data.data]);
        setIsApplyingLeave(false);
        setLeaveFormData({ leavefrom: "", leaveto: "", reason: "" });
      } else {
        setError(data.message || "Failed to apply leave.");
      }
    } catch {
      setError("An error occurred while applying leave.");
    }
  };

  const handleDelete = async (leaveId) => {
    const accessToken = localStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("leaveid", leaveId);

    try {
      const response = await fetch("http://192.168.0.105:5000/doctorsops/deleteleave", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Leave successfully deleted.");
        setLeaveData(leaveData.filter((leave) => leave.leaveid !== leaveId));
      } else {
        setError(data.message || "Failed to delete leave.");
      }
    } catch {
      setError("An error occurred while deleting leave.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <DoctorNavbar />
      <div className="flex flex-1">
        <DoctorSidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Doctor Leave Management</h1>
              <button
                onClick={() => {
                  setIsApplyingLeave(true);
                  setIsEditing(false);
                  setError(null);
                  setSuccessMessage(null);
                  setLeaveFormData({ leavefrom: "", leaveto: "", reason: "" });
                }}
                className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Apply for Leave
              </button>
         

            </header>

            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">{error}</div>
            )}
            {successMessage && (
              <div className="mb-4 p-4 text-green-700 bg-green-100 rounded">{successMessage}</div>
            )}

            {/* Apply Leave Form */}
            {isApplyingLeave && (
              <section className="mb-8 bg-white p-6 rounded shadow-md max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
                <form onSubmit={handleApplyLeave} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium" htmlFor="leavefrom">
                      Leave From
                    </label>
                    <input
                      type="date"
                      id="leavefrom"
                      name="leavefrom"
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={leaveFormData.leavefrom}
                      onChange={(e) => setLeaveFormData({ ...leaveFormData, leavefrom: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium" htmlFor="leaveto">
                      Leave To
                    </label>
                    <input
                      type="date"
                      id="leaveto"
                      name="leaveto"
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={leaveFormData.leaveto}
                      onChange={(e) => setLeaveFormData({ ...leaveFormData, leaveto: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium" htmlFor="reason">
                      Reason
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      required
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      value={leaveFormData.reason}
                      onChange={(e) => setLeaveFormData({ ...leaveFormData, reason: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsApplyingLeave(false)}
                      className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* Edit Leave Form */}
            {isEditing && (
              <section className="mb-8 bg-white p-6 rounded shadow-md max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4">Edit Leave</h2>
                <form onSubmit={handleUpdateLeave} className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium" htmlFor="edit-leavefrom">
                      Leave From
                    </label>
                    <input
                      type="date"
                      id="edit-leavefrom"
                      name="leavefrom"
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={editingLeave.leavefrom}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium" htmlFor="edit-leaveto">
                      Leave To
                    </label>
                    <input
                      type="date"
                      id="edit-leaveto"
                      name="leaveto"
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={editingLeave.leaveto}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium" htmlFor="edit-reason">
                      Reason
                    </label>
                    <textarea
                      id="edit-reason"
                      name="reason"
                      required
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      value={editingLeave.reason}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* Leave Table */}
            <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full table-auto divide-y divide-gray-200 responsive-table">

                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Leave Date (From)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Leave Date (To)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Reason</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
               <tbody className="divide-y divide-gray-100">
 {leaveData.length > 0 ? (
  leaveData.map((leave) =>
    leave && leave.leavefrom && leave.leaveto && leave.reason ? (
      <tr key={leave.leaveid} className="hover:bg-green-50">
        <td className="px-4 py-3 whitespace-nowrap" data-label="Leave Date (From)">
          {formatDate(leave.leavefrom)}
        </td>
        <td className="px-4 py-3 whitespace-nowrap" data-label="Leave Date (To)">
          {formatDate(leave.leaveto)}
        </td>
        <td className="px-4 py-3" data-label="Reason">{leave.reason}</td>
        <td className="px-4 py-3" data-label="Status">{leave.status}</td>
        <td className="px-4 py-3 text-center space-x-2" data-label="Actions">
          <button
            onClick={() => handleEdit(leave)}
            className="text-green-700 hover:text-green-900 font-semibold "
          >
            Edit
          </button>
         <button
  onClick={() => handleDelete(leave.leaveid)}
  className="text-red-600 hover:text-red-800 font-semibold"
  style={{ marginLeft: '8px' }}
>
  Delete
</button>

        </td>
      </tr>
    ) : null
  )
) : (
  <tr>
    <td colSpan="5">
      <div className="no-records-message">
        No leave records found.
      </div>
    </td>
  </tr>
)}

</tbody>

              </table>
            </div>
          </div>
        </main>
    <style>
{`
  @media (max-width: 640px) {
    .responsive-table {
      width: 100%;
      border-collapse: collapse;
    }

    .responsive-table thead {
      display: none;
    }

    .responsive-table tr {
      display: block;
      margin-bottom: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #fff;
      padding: 1rem;
    }

    .responsive-table td {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.875rem;
      border: none;
    }

    .responsive-table td::before {
      content: attr(data-label);
      font-weight: 600;
      color: #374151;
    }

    .responsive-table td.text-center {
      justify-content: flex-start;
    }

    .no-records-message {
      display: block;
      width: 100%;
      text-align: center;
      padding: 1.5rem;
      font-size: 1rem;
      color: #6b7280;
    }
  }
`}
</style>

      </div>
    </div>
  );
};

export default DoctorLeave;
