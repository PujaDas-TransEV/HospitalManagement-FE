import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSpinner, FaClock } from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './AdminAppointmentBooking.css';

const AdminAppointmentBooking = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = 'http://192.168.0.106:5000';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');
    try {
      jwtDecode(token); // Validate token
    } catch {
      return navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    setLoadingDepartments(true);
    axios.get(`${BASE_URL}/facilityops/getallfacility`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setDepartments(data);
      })
      .catch(console.error)
      .finally(() => setLoadingDepartments(false));
  }, []);

  useEffect(() => {
    setLoadingPatients(true);
    axios.get(`${BASE_URL}/patientops/getallpatient`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setPatients(data);
      })
      .catch(console.error)
      .finally(() => setLoadingPatients(false));
  }, []);

  useEffect(() => {
    if (!selectedDepartment) return setDoctors([]);
    setLoadingDoctors(true);
    const fm = new FormData();
    fm.append('doctorspecialization', selectedDepartment);
    axios.post(`${BASE_URL}/selectivedoctordata`, fm)
      .then(res => {
        const data = res.data.data || [];
        setDoctors(data);
      })
      .catch(() => setDoctors([]))
      .finally(() => setLoadingDoctors(false));
  }, [selectedDepartment]);

  useEffect(() => {
    const doctor = doctors.find(d => d.uid === selectedDoctorId);
    setSelectedDoctor(doctor || null);
    setSelectedDate(null);
    setAvailableTimes([]);
    setSelectedTime('');
  }, [selectedDoctorId, doctors]);

  const isDateSelectable = date => {
    return selectedDoctor?.timetable?.some(t =>
      new Date(t.date).toDateString() === date.toDateString()
    );
  };

  const isPastAvailableDate = date => {
    const d = new Date(date.setHours(0, 0, 0, 0));
    return d < today && selectedDoctor?.timetable?.some(
      t => new Date(t.date).toDateString() === d.toDateString()
    );
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    setSelectedTime('');
    const entry = selectedDoctor?.timetable?.find(t =>
      new Date(t.date).toDateString() === date.toDateString()
    );
    if (!entry) return setAvailableTimes([]);
    const slots = [];
    entry.schedule.forEach(({ start_time, end_time }) => {
      const [sh, sm] = start_time.split(':').map(Number);
      const [eh, em] = end_time.split(':').map(Number);
      let curr = new Date(date);
      curr.setHours(sh, sm);
      const end = new Date(date);
      end.setHours(eh, em);
      while (curr < end) {
        slots.push(curr.toTimeString().slice(0, 5));
        curr.setHours(curr.getHours() + 1);
      }
    });
    setAvailableTimes(slots);
  };

  const handleBook = async e => {
    e.preventDefault();
    if (!selectedDoctor || !selectedPatient || !selectedDate || !selectedTime || !appointmentDetails) {
      setAppointmentStatus('Fill in all fields.');
      return;
    }
    setIsBooking(true);
    const apptime = `${selectedDate.toISOString().split('T')[0]} ${selectedTime}`;
    const form = new FormData();
    form.append('doctorid', selectedDoctor.uid);
    form.append('patinetid', selectedPatient);
    form.append('appoinmenttime', apptime);
    form.append('appointmentdetails', appointmentDetails);

    try {
      await axios.post(`${BASE_URL}/createappoinment`, form);
      setPopupMessage(`✅ Appointment booked with Dr. ${selectedDoctor.fullname} at ${apptime}`);
    } catch {
      setPopupMessage('❌ Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate('/appointment-management');
  };

  return (
    <div className="dashboard-container-adminappointment">
      <AdminNavbar />
      <div className="dashboard-content">
        <AdminSidebar />
        <div className="appointment-booking-container" style={{ backgroundColor: '#f0f9ff' }}>
          <h2>Admin - Book Appointment</h2>

          <label>Department</label>
          <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
            <option value="">-- Select Department --</option>
            {loadingDepartments ? (
              <option disabled><FaSpinner className="spin" /> Loading...</option>
            ) : (
              departments.map(dep => (
                <option key={dep.uid} value={dep.department_name}>{dep.department_name}</option>
              ))
            )}
          </select>

          <label>Doctor</label>
          <select value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)} disabled={!selectedDepartment}>
            <option value="">-- Select Doctor --</option>
            {loadingDoctors ? (
              <option disabled><FaSpinner className="spin" /> Loading...</option>
            ) : doctors.length === 0 ? (
              <option disabled>No doctors found</option>
            ) : (
              doctors.map(doc => (
                <option key={doc.uid} value={doc.uid}>Dr. {doc.fullname}</option>
              ))
            )}
          </select>

          <label>Patient</label>
          <select value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
            <option value="">-- Select Patient --</option>
            {loadingPatients ? (
              <option disabled><FaSpinner className="spin" /> Loading...</option>
            ) : (
              patients.map(p => (
                <option key={p.uid} value={p.uid}>{p.firstname}</option>
              ))
            )}
          </select>

          {selectedDoctor && (
            <>
              <label>Select Available Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                filterDate={date => date >= today && isDateSelectable(date)}
                dayClassName={date => {
                  const d = new Date(date.setHours(0, 0, 0, 0));
                  if (d.getTime() === today.getTime()) return 'cal-today';
                  if (isPastAvailableDate(d)) return 'cal-past-available';
                  if (d < today) return 'cal-disabled';
                  return isDateSelectable(d) ? 'cal-available' : 'cal-disabled';
                }}
                inline
              />

              {availableTimes.length > 0 && (
                <div>
                  <label><FaClock /> Available Time Slots</label>
                  <div className="timeslots-container">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`timeslot-button ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >{time}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <label>Reason for Appointment</label>
          <textarea
            value={appointmentDetails}
            onChange={e => setAppointmentDetails(e.target.value)}
            rows="3"
            placeholder="Enter reason..."
          />

          <button className="book-btnn" onClick={handleBook} disabled={isBooking}>
            {isBooking ? <><FaSpinner className="spin" /> Booking...</> : 'Book Appointment'}
          </button>

          {appointmentStatus && <p className="status-msg">{appointmentStatus}</p>}
        </div>

        {showPopup && (
          <div className="popup-overlay" onClick={handlePopupClose}>
            <div className="popup-box" onClick={e => e.stopPropagation()}>
              <p>{popupMessage}</p>
              <button onClick={handlePopupClose}>OK</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentBooking;
