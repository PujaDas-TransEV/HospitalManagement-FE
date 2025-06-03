
import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // don't forget to install jwt-decode package
import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import './Homecare.css';

const DoctorHomecareRequests = () => {
  const [requests, setRequests] = useState([]);
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Assuming your doctor ID is stored in decoded.doctorid
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
    try {
      const formData = new FormData();
      formData.append('doctorid', doctorId);

      const response = await fetch('http://localhost:5000/management/homecare/gethomecarebydocid', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      const homecareRequests = (json.data || []).map(item => item.homecare);
      setRequests(homecareRequests);
    } catch (error) {
      console.error('Error fetching homecare requests:', error);
      setRequests([]);
    }
  };

  return (
    <div className="dashboard-container">
      <DoctorNavbar />
      <div className="dashboard-content">
        <DoctorSidebar />

        <main className="homecare-main">
          <h2 className="title">Homecare Requests</h2>

          <div className="table-container">
            <div className="table-header">Patient</div>
            <div className="table-header">Care Type</div>
            <div className="table-header">Status</div>
            <div className="table-header">Time Frame</div>

            {requests.length === 0 ? (
              <div className="no-requests" style={{ gridColumn: '1 / -1' }}>
                No homecare requests found.
              </div>
            ) : (
              requests.map((req) => (
                <React.Fragment key={req.uid}>
                  <div className="table-cell">{req.patientname || '-'}</div>
                  <div className="table-cell">{req.caretype || '-'}</div>
                  <div className="table-cell">{req.status || '-'}</div>
                  <div className="table-cell">
                    {req.timefrom && req.timeto ? `${req.timefrom} to ${req.timeto}` : '-'}
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorHomecareRequests;
