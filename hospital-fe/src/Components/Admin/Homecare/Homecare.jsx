import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Homecare.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

function HomecareAdminPanel() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    doctorid: '',
    assignedstaffid: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const editableFields = ['status', 'doctorid', 'assignedstaffid'];

  // Fetch all homecare requests
  const fetchRequests = async () => {
    const response = await fetch('http://localhost:5000/management/homecare');
    const data = await response.json();
    setRequests(data);
  };

  // Fetch staff list
  const fetchStaff = async () => {
    const res = await fetch('http://localhost:5000/ops/listofstaff');
    const data = await res.json();
    setStaffList(data.data || []);
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    const res = await fetch('http://localhost:5000/doctorops/getalldoctor');
    const data = await res.json();
    setDoctors(data.data || []);
  };

  useEffect(() => {
    fetchRequests();
    fetchStaff();
    fetchDoctors();
  }, []);

  const handleEditClick = (req) => {
    setSelectedRequest(req);
    setFormData({
      status: req.status || '',
      doctorid: req.doctorid || '',
      assignedstaffid: req.assignedstaffid || ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const formDataToSend = new FormData();

    // Append the homeuid
    formDataToSend.append('homeuid', selectedRequest.uid);

    // Append all editable fields
    editableFields.forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const res = await axios.post('http://localhost:5000/ops/updatehomecare', formDataToSend);
      alert('Updated successfully.');

      // Optionally update state with returned data
      setSelectedRequest((prev) => ({
        ...prev,
        ...res.data.data
      }));

      fetchRequests();
      setSelectedRequest(null);
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  return (
    <div className="facility-management-page">
      <AdminNavbar />
      <div className="facility-management-content">
        <AdminSidebar />
        <div className="admin-panel">
          <h1>Homecare Requests (Admin)</h1>
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Care Type</th>
                  <th>Status</th>
                  <th>Doctor</th>
                  <th>Staff</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.uid}>
                    <td>{req.patientname}</td>
                    <td>{req.caretype}</td>
                    <td>{req.status}</td>
                    <td>{req.refrencedoctorname || '-'}</td>
                    <td>{req.assignedstaffname || '-'}</td>
                    <td>
                      <button onClick={() => handleEditClick(req)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedRequest && (
            <div className="form-container">
              <h2>Edit Request: {selectedRequest.patientname}</h2>

              <label>Status:
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>

              {selectedRequest.caretype === 'doctor' && (
                <label>Doctor:
                  <select name="doctorid" value={formData.doctorid} onChange={handleChange}>
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc.doctorid} value={doc.doctorid}>
                        {doc.doctorname}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {(selectedRequest.caretype === 'nurse' || selectedRequest.caretype === 'equipment') && (
                <label>Staff:
                  <select
                    name="assignedstaffid"
                    value={formData.assignedstaffid}
                    onChange={handleChange}
                  >
                    <option value="">Select Staff</option>
                    {staffList.map((staff) => (
                      <option key={staff.uid} value={staff.uid}>
                        {staff.staffname} ({staff.stafftype})
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <div className="form-actions">
                <button onClick={handleUpdate}>Update</button>
                <button onClick={() => setSelectedRequest(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomecareAdminPanel;
