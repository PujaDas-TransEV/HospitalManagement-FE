
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // fixed import
import './Departmentwisebook.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import { FaSpinner } from 'react-icons/fa';

// ...

<div className="popup-overlay" style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
  <FaSpinner className="spin" />
  <p>Booking appointment...</p>
</div>

const departmentTimes = {
  cardiology: ["09:00:00", "10:00:00", "11:00:00"],
  neurology: ["10:00:00", "12:00:00", "14:00:00"],
  dermatology: ["11:00:00", "13:00:00", "15:00:00"],
  orthopedics: ["12:00:00", "13:00:00", "18:00:00"],
  pediatrics: ["13:00:00", "14:00:00", "18:00:00"],
  surgery: ["13:00:00", "13:00:00", "18:00:00"],
};

const AppointmentBookingPage = () => {
  const { departmentId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }
      try {
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid;
        setPatientId(patientId);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate("/login");
      }
    };
    fetchPatientProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const formData = new FormData();
        formData.append('doctorspecialization', departmentId);
        const response = await axios.post('http://192.168.0.106:5000/selectivedoctordata', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response.data.data && Array.isArray(response.data.data)) {
          const doctorList = response.data.data.map((doctor) => ({
            id: doctor.uid,
            name: doctor.fullname,
            specialization: doctor.specialization,
          }));
          setDoctors(doctorList);
          setAppointmentStatus('');
        } else {
          setDoctors([]);
          setAppointmentStatus('No doctors available for this specialization.');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        if (error.response && error.response.status === 404) {
        // If 404, show no doctors available message
        setDoctors([]);
        setAppointmentStatus('No doctors available for this specialization.');
      } else {
        setDoctors([]);
        setAppointmentStatus('Error fetching doctor data.');
      }
    }
  };
      

    if (departmentId) fetchDoctors();
    else setAppointmentStatus('Invalid department ID.');
  }, [departmentId]);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentDetails || !patientId) {
      setAppointmentStatus('Please fill all the required fields.');
      return;
    }

    const doctor = doctors.find((doc) => doc.id === selectedDoctor);
    if (!doctor) {
      setAppointmentStatus('Invalid doctor selection.');
      return;
    }

    const appointmentDateTime = `${selectedDate} ${selectedTime}`;

    try {
      setIsBooking(true);
      setAppointmentStatus('');
      const formData = new FormData();
      formData.append('doctorid', doctor.id);
      formData.append('patinetid', patientId);
      formData.append('appoinmenttime', appointmentDateTime);
      formData.append('appointmentdetails', appointmentDetails);

      const response = await axios.post('http://192.168.0.106:5000/createappoinment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setIsBooking(false);

      if (response.data && response.data.message) {
        setAppointmentStatus(`Appointment successfully booked with Dr. ${doctor.name} for ${appointmentDateTime}.`);
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
          navigate('/patient-Appointments');
        }, 2000);
      } else {
        setAppointmentStatus('Error booking the appointment.');
      }
    } catch (error) {
      setIsBooking(false);
      console.error('Error booking appointment:', error);
      setAppointmentStatus('Error booking the appointment.');
    }
  };

  return (
    <div className="dashboard-container-department">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
        <div className="appointment-booking-container">
          <h2>Book Appointment - {departmentId}</h2>

          <form
            className="appointment-form"style={{ backgroundColor: '#e0f7fa'}}
            onSubmit={(e) => {
              e.preventDefault();
              handleBookAppointment();
            }}
          >
            <div className="form-group">
              <label>Select Doctor:</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                <option value="">-- Select Doctor --</option>
                {doctors.length > 0
                  ? doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} (UID: {doctor.id})
                      </option>
                    ))
                  : (
                    <option value="" disabled>No doctors available</option>
                  )}
              </select>
            </div>

            <div className="form-group">
              <label>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Time:</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
                disabled={!selectedDate}
              >
                <option value="">-- Select Time --</option>
                {(departmentTimes[departmentId] || []).map((time) => {
                  const [hourStr, minute] = time.split(':');
                  const hour = parseInt(hourStr, 10);
                  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
                  const ampm = hour < 12 ? 'AM' : 'PM';
                  const timeLabel = `${hour12}:${minute} ${ampm}`;
                  return (
                    <option key={time} value={time}>
                      {timeLabel}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label> Reason Of Appointment:</label>
              <textarea
                value={appointmentDetails}
                onChange={(e) => setAppointmentDetails(e.target.value)}
                placeholder="Enter appointment reason"
                required
                rows={4}
              />
            </div>

           
            <button
  type="submit"
  disabled={isBooking}
  className="book-btn"
  style={{ 
    display: 'block',      // makes the button a block element so margin auto works
    margin: '0 auto',      // centers the button horizontally
    width: '250px',
    backgroundColor: '#1f6695'  // camelCase for React inline styles
  }}
>
  Book Appointment
</button>



            {appointmentStatus && !showPopup && (
              <div className="appointment-status">{appointmentStatus}</div>
            )}
          </form>

          {/* Spinner Popup during booking */}
          {isBooking && (
            // <div className="popup-overlay">
            //   <div className="spinner-popup"style={{ backgroundColor: '#e0f7fa'}}>
            //     <div className="spinner"></div>
            <div className="popup-overlay" style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
  <FaSpinner className="spin" />
                <p>Booking appointment...</p>
              </div>
        
          )}

          {/* Success Popup */}
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
    </div>
  );
};

export default AppointmentBookingPage;
