import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Import jwt-decode to decode the token
import './Departmentwisebook.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const AppointmentBookingPage = () => {
  const { departmentId } = useParams(); // Get the department from the URL params
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');  // Store selected date
  const [selectedTime, setSelectedTime] = useState('');  // Store selected time
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [patientId, setPatientId] = useState(null);
  const navigate = useNavigate();  // To handle redirection if needed

  useEffect(() => {
    const fetchPatientProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login"); // Redirect if no token is found in localStorage
        return;
      }

      try {
        // Decode the access token to get patientId
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid;  // Assuming 'userid' is the key in your token

        setPatientId(patientId); // Set patientId from the decoded token
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate("/login"); // Redirect to login if token decoding fails
      }
    };

    fetchPatientProfile(); // Fetch patient profile when component is mounted
  }, [navigate]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        console.log("Fetching doctors for department:", departmentId);

        const formData = new FormData();
        formData.append('doctorspecialization', departmentId);

        // Fetch doctors from the backend
        const response = await axios.post('http://localhost:5000/selectivedoctordata', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.data && Array.isArray(response.data.data)) {
          const doctorList = response.data.data.map((doctor) => ({
            id: doctor.uid,
            name: doctor.fullname,
            specialization: doctor.specialization, // Store specialization as well
          }));
          setDoctors(doctorList); // Update the state with the doctor list
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
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime('');
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleDetailsChange = (event) => {
    setAppointmentDetails(event.target.value);
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

    const appointmentDateTime = `${selectedDate} ${selectedTime}`;  // Combine date and time

    try {
      // Create FormData and append patientId and appointment data
      const formData = new FormData();
      formData.append('doctorid', doctor.id);
      formData.append('patinetid', patientId);  // Ensure 'patientid' is used as per backend expectation
      formData.append('appoinmenttime', appointmentDateTime);  // Send appointment date and time
      formData.append('appointmentdetails', appointmentDetails);

      // Send request to backend to create appointment
      const response = await axios.post('http://localhost:5000/createappoinment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.message) {
        setAppointmentStatus(`Appointment successfully booked with Dr. ${doctor.name} for ${appointmentDateTime}.`);
      } else {
        setAppointmentStatus('Error booking the appointment.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setAppointmentStatus('Error booking the appointment.');
    }
  };

  return (
    <div className="dashboard-container">
    {/* Navbar at the top */}
    <PatientNavbar />
    
    <div className="dashboard-content">
      {/* Sidebar for navigation */}
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
                {doctor.name} (UID: {doctor.id}) {/* Display doctor name and UID */}
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
            <option value="10:00:00">10:00 AM</option>
            <option value="11:00:00">11:00 AM</option>
            <option value="12:00:00">12:00 PM</option>
            <option value="01:00:00">01:00 PM</option>
            <option value="02:00:00">02:00 PM</option>
            <option value="03:00:00">03:00 PM</option>
            {/* Add more time slots based on your availability */}
          </select>
        </div>
      )}

      {/* Appointment Details */}
      {selectedTime && (
        <div className="appointment-details">
          <label>Appointment Details:</label>
          <textarea value={appointmentDetails} onChange={handleDetailsChange} placeholder="Enter appointment details"></textarea>
        </div>
      )}

      {/* Book Appointment Button */}
      <button onClick={handleBookAppointment}>Book Appointment</button>

      {/* Appointment Status */}
      {appointmentStatus && <div className="appointment-status">{appointmentStatus}</div>}
    </div>
    </div>
    </div>
  );
};

export default AppointmentBookingPage;
