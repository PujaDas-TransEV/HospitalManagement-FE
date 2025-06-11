
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
  const [staffInfoMap, setStaffInfoMap] = useState({});
  const [loadingStaffNames, setLoadingStaffNames] = useState(true);

  const editableFields = ['status', 'doctorid', 'assignedstaffid'];

  // Fetch all requests
  const fetchRequests = async () => {
    try {
      const response = await fetch('http://192.168.0.105:5000/management/homecare');
      const data = await response.json();

      setRequests(data);

      // Extract unique staff IDs assigned in requests
      const uniqueStaffIDs = [...new Set(data.map(req => req.assignedstaffid).filter(id => id))];

      if (uniqueStaffIDs.length === 0) {
        setLoadingStaffNames(false);
        return;
      }

      setLoadingStaffNames(true);

      const staffMap = {};
      await Promise.all(
        uniqueStaffIDs.map(async (staffid) => {
          const formData = new FormData();
          formData.append('staffid', staffid);

          try {
            const response = await fetch('http://192.168.0.105:5000/ops/getstaffdetailsbyid', {
              method: 'POST',
              body: formData,
            });
            const json = await response.json();
            staffMap[staffid] = json?.data || { staffname: 'Unknown' };
          } catch (error) {
            console.error('Error fetching staff details for ID:', staffid, error);
            staffMap[staffid] = { staffname: 'Error' };
          }
        })
      );

      setStaffInfoMap(staffMap);
      setLoadingStaffNames(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoadingStaffNames(false);
    }
  };

  // Fetch list of staff
  const fetchStaff = async () => {
    try {
      const res = await fetch('http://192.168.0.105:5000/ops/listofstaff');
      const data = await res.json();
      setStaffList(data.data || []);
    } catch (err) {
      console.error('Error fetching staff list:', err);
    }
  };

  // Fetch list of doctors
  const fetchDoctors = async () => {
    try {
      const res = await fetch('http://192.168.0.105:5000/doctorops/getalldoctor');
      const data = await res.json();
      setDoctors(data.data || []);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchStaff(), fetchDoctors()]).then(fetchRequests);
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
    formDataToSend.append('homeuid', selectedRequest.uid);

    editableFields.forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await axios.post('http://192.168.0.105:5000/ops/updatehomecare', formDataToSend);
      alert('Updated successfully.');

      const updatedStaff = staffList.find(staff => staff.uid === formData.assignedstaffid);
      const updatedDoctor = doctors.find(doc => doc.uid === formData.doctorid);

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.uid === selectedRequest.uid
            ? {
                ...req,
                status: formData.status,
                assignedstaffid: formData.assignedstaffid || req.assignedstaffid,
                doctorid: formData.doctorid || req.doctorid,
                assignedstaffname: updatedStaff ? updatedStaff.staffname : req.assignedstaffname,
                refrencedoctorname: updatedDoctor ? updatedDoctor.fullname : req.refrencedoctorname,
              }
            : req
        )
      );

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
        <div className="admin-panel" style={{ maxWidth: '1000px', margin: '20px auto' }}>
          <h1>Homecare Requests (Admin)</h1>

          {loadingStaffNames ? (
            <p>Loading Home care...</p>
          ) : (
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th className="responsive-table1">Patient</th>
                    <th className="responsive-table1">Care Type</th>
                    <th className="responsive-table1">Status</th>
                    <th className="responsive-table1">Doctor ID</th>
                    <th className="responsive-table1">Doctor Name</th>
                    <th className="responsive-table1">Referenced Doctor Name</th>
                    <th className="responsive-table1">Staff</th>
                    <th className="responsive-table1">Time From</th>
                    <th className="responsive-table1">Time To</th>
                    <th className="responsive-table1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => {
                    // Find doctor info for doctorid
                    const doctor = doctors.find(doc => doc.uid === req.doctorid);

                    return (
                      <tr key={req.uid}>
                        <td>{req.patientname}</td>
                        <td>{req.caretype}</td>
                        <td>{req.status}</td>
                        <td>{req.caretype === 'doctor' ? (req.doctorid || '-') : '-'}</td>
                        <td>{req.caretype === 'doctor' ? (doctor ? doctor.fullname : '-') : '-'}</td>
                        <td>{req.caretype === 'doctor' ? (req.refrencedoctorname || '-') : '-'}</td>
                        <td>
                          {req.assignedstaffid
                            ? `${req.assignedstaffid} (${staffInfoMap[req.assignedstaffid]?.staffname || 'Loading...'})`
                            : '-'}
                        </td>
                        <td>{req.timefrom || '-'}</td>
                        <td>{req.timeto || '-'}</td>
                        <td>
                          <button onClick={() => handleEditClick(req)}>Edit</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* {selectedRequest && (
            <div className="form-container">
              <h2>Edit Request: {selectedRequest.patientname}</h2>

              <label>
                Status:
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{
                    padding: '8px',
                    margin: '8px 0',
                    color: '#000',
                    backgroundColor: '#fff',
                    border: '1px solid #ccc'
                  }}
                >
                  <option value="">Select</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </label>

              {selectedRequest.caretype === 'doctor' && (
                <label>
                  Doctor:
                  <select
                    name="doctorid"
                    value={formData.doctorid}
                    onChange={handleChange}
                    style={{
                      padding: '8px',
                      margin: '8px 0',
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      color: 'black'
                    }}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc.uid} value={doc.uid}>
                        {doc.uid} - {doc.fullname}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {(selectedRequest.caretype === 'nurse' || selectedRequest.caretype === 'equipment' || selectedRequest.caretype === 'physiotherapy') && (
                <label>
                  Staff:
                  <select
                    name="assignedstaffid"
                    value={formData.assignedstaffid}
                    onChange={handleChange}
                    style={{
                      padding: '8px',
                      margin: '8px 0',
                      color: '#000',
                      backgroundColor: '#fff',
                      border: '1px solid #ccc'
                    }}
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
          )} */}
          {selectedRequest && selectedRequest.status !== 'cancelled' ? (
  <div className="form-container">
    <h2>Edit Request: {selectedRequest.patientname}</h2>

    {/* Status dropdown */}
    <label>
      Status:
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        style={{
          padding: '8px',
          margin: '8px 0',
          color: '#000',
          backgroundColor: '#fff',
          border: '1px solid #ccc'
        }}
      >
        <option value="">Select</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </label>

    {/* Doctor dropdown */}
    {selectedRequest.caretype === 'doctor' && (
      <label>
        Doctor:
        <select
          name="doctorid"
          value={formData.doctorid}
          onChange={handleChange}
          style={{
            padding: '8px',
            margin: '8px 0',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            color: 'black'
          }}
        >
          <option value="">Select Doctor</option>
          {doctors.map((doc) => (
            <option key={doc.uid} value={doc.uid}>
              {doc.uid} - {doc.fullname}
            </option>
          ))}
        </select>
      </label>
    )}

    {/* Staff dropdown for caretypes */}
    {['nurse', 'equipment', 'physiotherapy'].includes(selectedRequest.caretype) && (
      <label>
        Staff:
        <select
          name="assignedstaffid"
          value={formData.assignedstaffid}
          onChange={handleChange}
          style={{
            padding: '8px',
            margin: '8px 0',
            color: '#000',
            backgroundColor: '#fff',
            border: '1px solid #ccc'
          }}
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
) : (
  selectedRequest && (
    <div className="form-container">
      <h2>This request has been cancelled. Editing is not allowed.</h2>
      <button onClick={() => setSelectedRequest(null)}>Close</button>
    </div>
  )
)}

        </div>
      </div>
    </div>
  );
}

export default HomecareAdminPanel;
