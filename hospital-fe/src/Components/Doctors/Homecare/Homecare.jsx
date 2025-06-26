
import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { FaSpinner } from 'react-icons/fa';
import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import './Homecare.css';

const DoctorHomecareDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(false);

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

      const response = await fetch('http://192.168.0.106:5000/management/homecare/gethomecarebydocid', {
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

  return (
    <div className="docdash-container-homecare">
      <DoctorNavbar />
      <div className="docdash-content-homecare">
        <DoctorSidebar />

        <main className="docdash-main">
          <section className="docdash-card">
            <h2 className="docdash-title">Homecare Requests  🏠</h2>

            {loading ? (
              <div className="docdash-loading">
                <FaSpinner className="docdash-spinner" />
                <span>Loading requests, please wait...</span>
              </div>
            ) : requests.length === 0 ? (
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

                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.uid}>
                        <td data-label="Patient">{req.patientname || '-'}</td>
                        <td data-label="Care Type">{req.caretype || '-'}</td>
                        <td data-label="Status">
                          <span className={`docdash-status docdash-status-${req.status.toLowerCase()}`}>
                            {req.status || '-'}
                          </span>
                        </td>
                        <td data-label="Schedule">
                          {req.timefrom && req.timeto
                            ? `${new Date(req.timefrom).toLocaleString()} - ${new Date(req.timeto).toLocaleString()}`
                            : '-'}
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
