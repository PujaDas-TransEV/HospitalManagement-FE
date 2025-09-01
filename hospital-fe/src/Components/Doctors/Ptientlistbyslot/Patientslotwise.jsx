import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Patientslotwise.css'; // CSS file for styling
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';
const DoctorSlotWisePatients = () => {
  const navigate = useNavigate();

  const [doctorId, setDoctorId] = useState(null);
  const [timetable, setTimetable] = useState([]); // [{date, slots: [{start_time, end_time}]}]
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]); // slots of selectedDate
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // Decode token and get doctorId
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');
    try {
      const decoded = jwtDecode(token);
      if (decoded.doctorid) setDoctorId(decoded.doctorid);
      else navigate('/login');
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch timetable on doctorId set
  useEffect(() => {
    if (!doctorId) return;

    const fetchTimetable = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('doctorid', doctorId);

        const res = await fetch('https://backend.medapp.transev.site/doctors/getbyid', {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();

        if (json.data && json.data.timetable) {
          setTimetable(json.data.timetable);
        } else {
          setTimetable([]);
        }
      } catch (err) {
        console.error('Error fetching timetable:', err);
        setTimetable([]);
      }
      setLoading(false);
    };

    fetchTimetable();
  }, [doctorId]);

  // When a date is clicked, show its slots
  const onDateClick = (dateObj) => {
    setSelectedDate(dateObj.date);
    setTimeSlots(dateObj.slots || []);
    setSelectedTimeSlot(null);
    setPatients([]);
  };

  // When time slot clicked, fetch patients for that datetime
  const onTimeSlotClick = async (startTime) => {
    if (!doctorId || !selectedDate) return;

    const appointmentDateTime = `${selectedDate} ${startTime}`;

    setSelectedTimeSlot(appointmentDateTime);
    setPatients([]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('doctorid', doctorId);
      formData.append('appoinmenttime', appointmentDateTime);

      const res = await fetch('https://backend.medapp.transev.site/doctors/patients/by-datetime', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      if (json.data) {
        setPatients(json.data);
      } else {
        setPatients([]);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setPatients([]);
    }

    setLoading(false);
  };

  return (
     <div className="appointment-bg">
      <DoctorNavbar />
      <div className="dashboard-content-appointment">
        <DoctorSidebar />
    <div className="slotwise-container">
      <h2 className="section-title">Patient List - Slot Wise</h2>

      {/* Timetable Dates (Calendar style) */}
      <div className="calendar-container">
        {timetable.length === 0 && !loading && (
          <p>No timetable available.</p>
        )}
        {loading && <p>Loading...</p>}

        <div className="dates-list">
          {timetable.map((dateObj) => (
            <button
              key={dateObj.date}
              className={`date-btn ${selectedDate === dateObj.date ? 'selected' : ''}`}
              onClick={() => onDateClick(dateObj)}
            >
              {new Date(dateObj.date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                weekday: 'short',
              })}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots for selected date */}
      {selectedDate && (
        <div className="slots-container">
          <h3>
            Available Slots for{' '}
            {new Date(selectedDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              weekday: 'long',
            })}
          </h3>
          {timeSlots.length === 0 ? (
            <p>No slots available for this date.</p>
          ) : (
            <div className="slots-list">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  className={`slot-btn ${
                    selectedTimeSlot === `${selectedDate} ${slot.start_time}` ? 'selected' : ''
                  }`}
                  onClick={() => onTimeSlotClick(slot.start_time)}
                >
                  {slot.start_time} - {slot.end_time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Patients List for selected slot */}
      {selectedTimeSlot && (
        <div className="patients-container">
          <h3>Patients for Slot: {selectedTimeSlot}</h3>
          {loading && <p>Loading patients...</p>}

          {!loading && patients.length === 0 && (
            <p>No patients found for this slot.</p>
          )}

          {!loading && patients.length > 0 && (
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.appointment_id}>
                    <td>{p.patient_name}</td>
                    <td>{p.email}</td>
                    <td>{p.phone}</td>
                    <td>{p.status}</td>
                    <td>{p.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default DoctorSlotWisePatients;
