import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DoctorTime.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const API_URL = 'http://localhost:5000/doctorops/getalldoctor';

const DepartmentwiseTimetable = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setDoctors(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const grouped = doctors.reduce((acc, doc) => {
    const dept = doc.specialization || 'Unknown';
    acc[dept] = acc[dept] || [];
    acc[dept].push(doc);
    return acc;
  }, {});

  return (
    <div className="dashboard-container-patient">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
        <div className="timetable-page">
          <h1>Doctor Timetables</h1>
          {loading ? (
            <p className="loading">Loading doctor timetables…</p>
          ) : (
            Object.entries(grouped).map(([dept, docs]) => (
              <div key={dept} className="dept-block">
                <h2>{dept.charAt(0).toUpperCase() + dept.slice(1)}</h2>
                {docs.map(doc => (
                  <div key={doc.uid} className="doctors-card">
                    <h3> Dr. {doc.fullname} ({doc.qualification})</h3>
                    {doc.timetable.length > 0 ? (
                      <table className="timetable-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Slots</th>
                          </tr>
                        </thead>
                        <tbody>
                          {doc.timetable.map((tm, i) => (
                            <tr key={i}>
                              <td>
                                {tm.date} (
                                {new Date(tm.date).toLocaleDateString('en-US', { weekday: 'long' })}
                                )
                              </td>
                              <td>
                                {tm.schedule.map((slot, j) => (
                                  <div key={j}>{slot.start_time} – {slot.end_time}</div>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-timetable"><i>No timetable available</i></p>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentwiseTimetable;
