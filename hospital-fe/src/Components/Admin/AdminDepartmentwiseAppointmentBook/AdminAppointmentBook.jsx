
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaSpinner } from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './AdminAppointmentBooking.css'; // You'll need matching CSS

const AppointmentBookingPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState('');
 const [appointmentStatus, setAppointmentStatus] = useState('');
  const [booking, setBooking] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [patientId, setPatientId] = useState(null);
  const navigate = useNavigate();

  // Get patient ID from token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');
    try {
      const { userid } = jwtDecode(token);
      setPatientId(userid);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch departments
  useEffect(() => {
    setLoadingDepartments(true);
    axios
      .get('http://192.168.0.106:5000/facilityops/getallfacility')
      .then(resp => {
        const data = Array.isArray(resp.data) ? resp.data : resp.data.data || [];
        setDepartments(data);
      })
      .catch(console.error)
      .finally(() => setLoadingDepartments(false));
  }, []);

  // Fetch doctors
  useEffect(() => {
    if (!selectedDepartment) {
      setDoctors([]);
      return;
    }
    setLoadingDoctors(true);
    const fm = new FormData();
    fm.append('doctorspecialization', selectedDepartment);

    axios
      .post('http://192.168.0.106:5000/selectivedoctordata', fm)
      .then(resp => {
        const docs = resp.data.data || [];
        setDoctors(docs.map(d => ({ id: d.uid, name: d.fullname })));
      })
      .catch(console.error)
      .finally(() => setLoadingDoctors(false));
  }, [selectedDepartment]);

  // Fetch patients
  useEffect(() => {
    setLoadingPatients(true);
    axios
      .get('http://192.168.0.106:5000/patientops/getallpatient')
      .then(resp => {
        const pat = Array.isArray(resp.data) ? resp.data : resp.data.data || [];
        setPatients(pat.map(p => ({ id: p.uid, name: p.firstname })));
      })
      .catch(console.error)
      .finally(() => setLoadingPatients(false));
  }, []);

  const handleBookAppointment = async () => {
    if (
      !selectedDoctor ||
      !selectedPatient ||
      !selectedDate ||
      !selectedTime ||
      !appointmentDetails ||
      !patientId
    ) {
      setPopupMessage('Please fill all fields');
      setShowPopup(true);
      return;
    }

    setBooking(true);
    const fm = new FormData();
    fm.append('doctorid', selectedDoctor);
    fm.append('patinetid', selectedPatient);
    fm.append('appoinmenttime', `${selectedDate} ${selectedTime}`);
    fm.append('appointmentdetails', appointmentDetails);

    try {
      const resp = await axios.post(
        'http://192.168.0.106:5000/createappoinment',
        fm
      );
      // const msg = resp.data.message || 'Appointment booked successfully!';
      const msg = `Appointment successfully booked with Dr. ${doctors.find(doc => doc.id === selectedDoctor)?.name || 'Unknown'} for ${selectedDate} ${selectedTime}.`;

      setPopupMessage(msg);
      setShowPopup(true);
    } catch (err) {
      setPopupMessage('Booking failed. Please try again.');
      setShowPopup(true);
    } finally {
      setBooking(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/appointment-management');
  };

  return (
    <div className="dashboard-container-adminappointment">
      <AdminNavbar />
      <div className="dashboard-content">
        <AdminSidebar />
        <div className="appointment-booking-container"style={{ backgroundColor: '#e0f7fa'}}>
        
          <h2>Book Appointment</h2>

          {/* Department */}
          <label>Department</label>
          <select
            value={selectedDepartment}
            onChange={e => {
              setSelectedDepartment(e.target.value);
              setSelectedDoctor('');
            }}
          >
            <option value="">-- Select Department --</option>
            {loadingDepartments ? (
              <option value="">
                <FaSpinner className="spin" /> Loading...
              </option>
            ) : (
              departments.map(d => (
                <option key={d.uid} value={d.department_name}>
                  {d.department_name}
                </option>
              ))
            )}
          </select>

          {/* Doctor */}
          <label>Doctor</label>
          <select
            disabled={!selectedDepartment}
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value)}
          >
            <option value="">-- Select Doctor --</option>
            {loadingDoctors ? (
              <option value="">
                <FaSpinner className="spin" /> Loading...
              </option>
            ) : (
              doctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))
            )}
          </select>

          {/* Patient */}
          <label>Patient</label>
          <select
            value={selectedPatient}
            onChange={e => setSelectedPatient(e.target.value)}
          >
            <option value="">-- Select Patient --</option>
            {loadingPatients ? (
              <option value="">
                <FaSpinner className="spin" /> Loading...
              </option>
            ) : (
              patients.map(pat => (
                <option key={pat.id} value={pat.id}>
                  {pat.name}
                </option>
              ))
            )}
          </select>

          {/* Date & Time */}
          <label>Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />

          <label>Time</label>
          <select
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
          >
            <option value="">-- Select Time --</option>
            {['10:00:00','11:00:00','12:00:00','13:00:00','14:00:00','15:00:00'].map(t => (
              <option key={t} value={t}>
                {t.slice(0,5)}
              </option>
            ))}
          </select>

          <label>Reason For appointment Booking</label>
          <textarea
            value={appointmentDetails}
            onChange={e => setAppointmentDetails(e.target.value)}
            placeholder="Enter details..."
          />

          <button
            onClick={handleBookAppointment}
            disabled={booking}
            className="book-btnn"
          >
            {booking ? <FaSpinner className="spin" /> : 'Book Appointment'}
          </button>
        </div>

        {showPopup && (
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-box" onClick={e => e.stopPropagation()}>
              <p>{popupMessage}</p>
           
              <button onClick={handleClosePopup}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
