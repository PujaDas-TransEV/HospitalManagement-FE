import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FaSpinner } from 'react-icons/fa';
import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import './Homecare.css';

const DoctorHomecareDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDoctorId(decoded.doctorid);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchHomecareRequests();
    }
  }, [doctorId]);

  const fetchHomecareRequests = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('doctorid', doctorId);

      const response = await fetch('https://backend.medapp.transev.site/management/homecare/gethomecarebydocid', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      const homecareRequests = (json.data || []).map(item => item.homecare);
      setRequests(homecareRequests);
    } catch (error) {
      console.error('Error fetching homecare requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (homeuid, newStatus) => {
    setUpdatingStatus(homeuid);
    try {
      const formData = new FormData();
      formData.append('homeuid', homeuid);
      formData.append('status', newStatus);

      const response = await fetch('http://localhost:5000/ops/updatehomecare', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        fetchHomecareRequests(); // Refresh after update
      } else {
        console.error('Failed to update status:', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredRequests = filter === 'All'
    ? requests
    : requests.filter(req => req.status.toLowerCase() === filter.toLowerCase());

  return (
    <div className="docdash-container-homecare">
      <DoctorNavbar />
      <div className="docdash-content-homecare">
        <DoctorSidebar />
        <main className="docdash-main">
          <section className="docdash-card">
            <h2 className="docdash-title">Homecare Requests 🏠</h2>

          <div
  style={{
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: '300px',
    width: '100%',
  }}
>
  <select
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
    style={{
      padding: '8px 14px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontWeight: '600',
      fontFamily: 'Roboto, sans-serif',
      fontSize: '1rem',
      cursor: 'pointer',
      backgroundColor: 'white',
      transition: 'border-color 0.3s ease',
    }}
  >
    <option value="All">All</option>
    <option value="Scheduled">Scheduled</option>
    <option value="Approved">Approved</option>
    <option value="Completed">Completed</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</div>

            {loading ? (
              <div className="docdash-loading">
                <FaSpinner className="docdash-spinner" />
                <span>Loading requests, please wait...</span>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="docdash-empty">No homecare requests found.</div>
            ) : (
              <div className="docdash-table-wrapper">
                <table className="docdash-table">
                  <thead>
                    <tr>
                      <th className="table-header-patient">Patient</th>
                      <th className="table-header-caretype">Care Type</th>
                      <th className="table-header-status">Status</th>
                      <th className="table-header-schedule">Schedule</th>
                      <th className="table-header-schedule">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.uid}>
                        <td data-label="Patient">{req.patientname || '-'}</td>
                        <td data-label="Care Type">{req.caretype || '-'}</td>
                        <td data-label="Status">
                          <span className={`docdash-status docdash-status-${req.status.toLowerCase()}`}>
                            {req.status}
                          </span>
                        </td>
                        <td data-label="Schedule">
                          {req.timefrom && req.timeto
                            ? `${new Date(req.timefrom).toLocaleString()} - ${new Date(req.timeto).toLocaleString()}`
                            : '-'}
                        </td>
                        <td data-label="Action" style={{ minWidth: '140px', padding: '14px 20px' }}>
  {(req.status !== 'Completed' && req.status !== 'Cancelled') ? (
    <select
      defaultValue=""
      onChange={(e) => updateStatus(req.uid, e.target.value)}
      disabled={updatingStatus === req.uid}
      style={{
        padding: '6px 12px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontWeight: '600',
        fontFamily: 'Roboto, sans-serif',
        fontSize: '0.95rem',
        cursor: updatingStatus === req.uid ? 'not-allowed' : 'pointer',
        backgroundColor: updatingStatus === req.uid ? '#b7e6eeff' : '#b7e6eeff',
        minWidth: '120px',
      }}
    >
      <option value="" disabled>Select</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  ) : (
    <span style={{ color: '#7f8c8d', fontStyle: 'italic', userSelect: 'none' }}>N/A</span>
  )}
</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default DoctorHomecareDashboard;

