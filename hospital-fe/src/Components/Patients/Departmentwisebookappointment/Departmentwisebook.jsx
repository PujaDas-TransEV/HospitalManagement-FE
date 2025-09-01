import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import { FaSpinner, FaClock } from 'react-icons/fa';
import { format } from 'date-fns'; // ✅ import for local date formatting
import './Departmentwisebook.css';

const AppointmentBookingPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorUid, setSelectedDoctorUid] = useState('');
  const [selectedDoctorData, setSelectedDoctorData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  useEffect(() => {
    async function loadDoctors() {
      try {
        const form = new FormData();
        form.append('doctorspecialization', departmentId);
        const res = await axios.post('https://backend.medapp.transev.site/selectivedoctordata', form);
        setDoctors(res.data.data || []);
      } catch (err) {
        console.error(err);
        setDoctors([]);
      }
    }
    if (departmentId) loadDoctors();
  }, [departmentId]);

  useEffect(() => {
    const doc = doctors.find(d => d.uid === selectedDoctorUid);
    setSelectedDoctorData(doc || null);
    setSelectedDate(null);
    setAvailableTimes([]);
    setSelectedTime('');
  }, [selectedDoctorUid, doctors]);

  const isDateSelectable = date => {
    return selectedDoctorData?.timetable.some(t =>
      new Date(t.date).toDateString() === date.toDateString()
    );
  };

  const isPastAvailableDate = date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today && selectedDoctorData?.timetable.some(
      t => new Date(t.date).toDateString() === d.toDateString()
    );
  };

  const handleDateChange = pickedDate => {
    const date = new Date(pickedDate); // clone
    setSelectedDate(date);
    setSelectedTime('');

    const entry = selectedDoctorData?.timetable.find(t =>
      new Date(t.date).toDateString() === date.toDateString()
    );

    if (!entry) return setAvailableTimes([]);

    const slots = entry.schedule.map(({ start_time }) => start_time);
    setAvailableTimes(slots);
  };

  const handleBook = async e => {
    e.preventDefault();

    if (!selectedDoctorData || !selectedDate || !selectedTime || !appointmentDetails || !patientId) {
      return setAppointmentStatus('Please fill in all fields.');
    }

    setIsBooking(true);

    const localDate = format(selectedDate, 'yyyy-MM-dd'); // ✅ FIX: format in local timezone
    const appointmentTime = `${localDate} ${selectedTime}`;

    try {
      const form = new FormData();
      form.append('doctorid', selectedDoctorData.uid);
      form.append('patinetid', patientId);
      form.append('appoinmenttime', appointmentTime);
      form.append('appointmentdetails', appointmentDetails);

      await axios.post('https://backend.medapp.transev.site/createappoinment', form);

      setShowPopup(true);
      setAppointmentStatus(`Booked with Dr. ${selectedDoctorData.fullname} at ${appointmentTime}`);
      setTimeout(() => navigate('/patient-Appointments'), 2000);
    } catch {
      setAppointmentStatus('Booking error. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="page-background">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
        <div className="booking-overlay">
          <form onSubmit={handleBook} className="booking-form">
            <h2>Book Appointment — {departmentId}</h2>

            <div className="form-group">
              <label>Select Doctor</label>
              <select
                value={selectedDoctorUid}
                onChange={e => setSelectedDoctorUid(e.target.value)}
                required
              >
                <option value="">-- Choose Doctor --</option>
                {doctors.map(d => (
                  <option key={d.uid} value={d.uid}>
                    Dr. {d.fullname}
                  </option>
                ))}
              </select>
            </div>

            {selectedDoctorData && (
              <>
                <div className="form-group calendar-group">
                  <label>Select Available Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    filterDate={date => date >= today && isDateSelectable(date)}
                    dayClassName={date => {
                      const d = new Date(date);
                      d.setHours(0, 0, 0, 0);
                      if (d.getTime() === today.getTime()) return 'cal-today';
                      if (isPastAvailableDate(d)) return 'cal-past-available';
                      if (d < today) return 'cal-disabled';
                      return isDateSelectable(d) ? 'cal-available' : 'cal-disabled';
                    }}
                    inline
                  />
                </div>

                {availableTimes.length > 0 && (
                  <div className="form-group timeslot-group">
                    <label><FaClock /> Available Time Slots</label>
                    <div className="timeslots-container">
                      {availableTimes.map(time => (
                        <button
                          key={time}
                          type="button"
                          className={`timeslot-button ${selectedTime === time ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="form-group">
              <label>Reason for Appointment</label>
              <textarea
                rows="3"
                required
                value={appointmentDetails}
                onChange={e => setAppointmentDetails(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isBooking}>
              {isBooking ? (
                <>
                  <FaSpinner className="spin" /> Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>

            {appointmentStatus && <p className="status-msg">{appointmentStatus}</p>}
          </form>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Success!</h3>
              <p>{appointmentStatus}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
