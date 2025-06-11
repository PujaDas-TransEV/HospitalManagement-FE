
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // fixed import (no braces)
import './Departmentwisebook.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

// Define different available times per department
const departmentTimes = {
  cardiology: ["09:00:00", "10:00:00", "11:00:00"],
  neurology: ["10:00:00", "12:00:00", "14:00:00"],
  dermatology: ["11:00:00", "13:00:00", "15:00:00"],
  orthopedics: ["12:00:00", "13:00:00", "18:00:00"],
  pediatrics: ["13:00:00", "14:00:00", "18:00:00"],
  surgery: ["13:00:00", "13:00:00", "18:00:00"],
  // Add other departments and their available times here
};

const AppointmentBookingPage = () => {
  const { departmentId } = useParams(); // Get the department from the URL params
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [patientId, setPatientId] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
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
        const patientId = decodedToken.userid;  // adjust if your token uses a different key
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

        const response = await axios.post('http://192.168.0.105:5000/selectivedoctordata', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.data && Array.isArray(response.data.data)) {
          const doctorList = response.data.data.map((doctor) => ({
            id: doctor.uid,
            name: doctor.fullname,
            specialization: doctor.specialization,
          }));
          setDoctors(doctorList);
        } else {
          setDoctors([]);
          setAppointmentStatus('No doctors available for this specialization.');
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
        setAppointmentStatus('Error fetching doctor data.');
      }
    };

    if (departmentId) {
      fetchDoctors();
    } else {
      setAppointmentStatus('Invalid department ID.');
    }
  }, [departmentId]);

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedDate('');
    setSelectedTime('');
    setAppointmentStatus('');
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime('');
    setAppointmentStatus('');
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
    setAppointmentStatus('');
  };

  const handleDetailsChange = (event) => {
    setAppointmentDetails(event.target.value);
    setAppointmentStatus('');
  };

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

      const formData = new FormData();
      formData.append('doctorid', doctor.id);
       formData.append('patinetid', patientId); 
      formData.append('appoinmenttime', appointmentDateTime);
      formData.append('appointmentdetails', appointmentDetails);

      const response = await axios.post('http://192.168.0.105:5000/createappoinment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setIsBooking(false);

      if (response.data && response.data.message) {
        setAppointmentStatus(`Appointment successfully booked with Dr. ${doctor.name} for ${appointmentDateTime}.`);
        
        setTimeout(() => {
          navigate('/patient-Appointments');
        }, 1500);

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
    <div className="dashboard-container">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />

        <div className="appointment-booking-container">
          <h2>Book Appointment - {departmentId}</h2>

          {/* Doctor Selection */}
          <div className="doctor-selection">
            <label>Select Doctor:</label>
            <select value={selectedDoctor} onChange={handleDoctorChange}>
              <option value="">-- Select Doctor --</option>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} (UID: {doctor.id})
                  </option>
                ))
              ) : (
                <option value="">No doctors available</option>
              )}
            </select>
          </div>

          {/* Date Selection */}
          {selectedDoctor && (
            <div className="date-selection">
              <label>Select Date:</label>
              <input type="date" value={selectedDate} onChange={handleDateChange} />
            </div>
          )}

          {/* Time Selection */}
          {selectedDate && (
            <div className="time-selection">
              <label>Select Time:</label>
              <select value={selectedTime} onChange={handleTimeChange}>
                <option value="">-- Select Time --</option>
                {(departmentTimes[departmentId] || []).map((time) => {
                  // Format to 12hr AM/PM
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
          )}

          {/* Appointment Details */}
          {selectedTime && (
            <div className="appointment-details">
              <label>Appointment Details:</label>
              <textarea
                value={appointmentDetails}
                onChange={handleDetailsChange}
                placeholder="Enter appointment details"
              />
            </div>
          )}

          {/* Booking Spinner */}
          {isBooking && (
            <div className="spinner" style={{ margin: '10px 0', color: '#007BFF', fontWeight: '600' }}>
              Booking appointment...
            </div>
          )}

          {/* Book Appointment Button */}
          <button onClick={handleBookAppointment} disabled={isBooking}>
            Book Appointment
          </button>

          {/* Appointment Status */}
          {appointmentStatus && <div className="appointment-status">{appointmentStatus}</div>}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
