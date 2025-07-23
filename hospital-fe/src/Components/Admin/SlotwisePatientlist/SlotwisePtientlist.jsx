
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaBuilding,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaSpinner,
  FaTooth,
  FaHeartbeat,
  FaBrain,
  FaStethoscope,
} from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './Slotwisepatientlist.css';

const iconMap = {
  Dentist: <FaTooth className="facility-icon" />,
  Cardiology: <FaHeartbeat className="facility-icon" />,
  Neurology: <FaBrain className="facility-icon" />,
  General: <FaStethoscope className="facility-icon" />,
};

const getIconBySpec = (spec) => {
  // Return icon by specialization or default FaBuilding
  return iconMap[spec] || <FaBuilding className="facility-icon" />;
};

const AdminSlotwisePatientList = () => {
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientLists, setPatientLists] = useState({});
  const [loadingSpecs, setLoadingSpecs] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState({});

  useEffect(() => {
    axios
      .get('http://192.168.0.106:5000/facilityops/getallfacility')
      .then((resp) => {
        const specs = resp.data.data
          ?.map((f) => f.department_name)
          .filter((v, i, a) => a.indexOf(v) === i) || []; // unique specializations
        setSpecializations(specs);
      })
      .catch(console.error)
      .finally(() => setLoadingSpecs(false));
  }, []);

  const selectSpecialization = (spec) => {
    setSelectedSpec(spec);
    setDoctors([]);
    setSelectedDoctor(null);
    setLoadingDoctors(true);

    const form = new FormData();
    form.append('doctorspecialization', spec);

    axios
      .post('http://192.168.0.106:5000/doctors/getdoctorbyspc', form)
      .then((resp) => setDoctors(resp.data.data || []))
      .catch(console.error)
      .finally(() => setLoadingDoctors(false));
  };

  const togglePatients = (doctorId, date, startTime) => {
    const key = `${doctorId}-${date}-${startTime}`;
    if (patientLists[key]) {
      setPatientLists((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    } else {
      fetchPatients(doctorId, date, startTime);
    }
  };

  const fetchPatients = (doctorId, date, startTime) => {
    const key = `${doctorId}-${date}-${startTime}`;
    setLoadingPatients((prev) => ({ ...prev, [key]: true }));

    const form = new FormData();
    form.append('doctorid', doctorId);
    form.append('appoinmenttime', `${date} ${startTime}`);

    axios
      .post('http://192.168.0.106:5000/doctors/patients/by-datetime', form)
      .then((resp) => {
        setPatientLists((prev) => ({ ...prev, [key]: resp.data.data || [] }));
      })
      .catch(console.error)
      .finally(() => setLoadingPatients((prev) => ({ ...prev, [key]: false })));
  };

  const formatTime = (t) => {
    if (!t) return '';
    if (typeof t === 'string') {
      // If already string time format "HH:MM:SS", slice to "HH:MM"
      return t.slice(0, 5);
    }
    // If Date object, format to HH:MM
    return t.toTimeString().slice(0, 5);
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-page-wrappery">
        <AdminSidebar />
        <main className="admin-main-contents">
          <h2 className="admin-title">Slot‑Wise Patient List</h2>

          <div className="facility-container">
            {loadingSpecs ? (
              <FaSpinner className="icon spin" />
            ) : (
              specializations.map((spec) => (
                <div
                  key={spec}
                  className={`facility-card ${selectedSpec === spec ? 'active' : ''}`}
                  onClick={() => selectSpecialization(spec)}
                >
                  {getIconBySpec(spec)}
                  <span>{spec}</span>
                </div>
              ))
            )}
          </div>

          {selectedSpec && (
            <div className="doctor-container">
              <h3 className="section-title">Doctors in {selectedSpec}</h3>
              {loadingDoctors ? (
                <FaSpinner className="icon spin" />
              ) : doctors.length === 0 ? (
                <p className="empty">No doctors found.</p>
              ) : (
                doctors.map((doc) => (
                  <div
                    key={doc.uid}
                    className={`doctor-card ${selectedDoctor?.uid === doc.uid ? 'active' : ''}`}
                    onClick={() => setSelectedDoctor(doc)}
                  >
                    <FaUserMd className="doctor-icon" />
                    <span> Dr. {doc.fullname}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {selectedDoctor && (
            <div className="timetable-section">
              <h3>
                <FaCalendarAlt /> {selectedDoctor.fullname}'s Timetable
              </h3>
              {selectedDoctor.timetable?.length > 0 ? (
                selectedDoctor.timetable.map((day) => {
                  return (
                    <div key={day.date} className="day-block">
                      <div className="date-header">
                        <FaCalendarAlt /> {new Date(day.date).toDateString()}
                      </div>
                      <div className="slots-container">
                        {day.slots.map((slot) => {
                          const key = `${selectedDoctor.uid}-${day.date}-${slot.start_time}`;
                          const patients = patientLists[key];
                          const loading = loadingPatients[key];

                          return (
                         <div key={key} className={`slot-card ${patients ? 'expanded' : ''}`}>
                              <div className="slot-time">
                                <FaClock /> {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                              </div>
                              <button
                                className="view-btn"
                                onClick={() => togglePatients(selectedDoctor.uid, day.date, slot.start_time)}
                                disabled={loading}
                              >
                                <FaUsers /> {loading ? 'Loading...' : 'View Patients'}
                              </button>
                              {patients && (
                                <>
                                  {patients.length > 0 ? (
                                    <table className="patient-table">
                                      <thead>
                                        <tr>
                                          <th>Name</th>
                                          <th>Email</th>
                                          <th>Phone No</th>
                                          <th>Appointment Time</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {patients.map((p) => (
                                          <tr key={p.patient_uid}>
                                            <td>{p.patient_name}</td>
                                            <td>{p.email || 'N/A'}</td>
                                            <td>{p.phone || 'N/A'}</td>
                                            <td>{formatTime(new Date(p.appointment_time).toTimeString())}</td>
                                            <td>{p.status || 'N/A'}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <p className="no-patients">No patients in this slot.</p>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty">No timetable available.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminSlotwisePatientList;
