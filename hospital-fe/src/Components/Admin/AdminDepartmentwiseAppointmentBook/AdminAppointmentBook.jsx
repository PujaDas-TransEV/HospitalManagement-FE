
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode to decode the token

import AdminNavbar from '../Adminnavbar/AdminNavbar';
import Adminsidebar from '../Adminsidebar/AdminSidebar';

const AppointmentBookingPage = () => {
  const { departmentId } = useParams(); // Get departmentId from URL
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]); // New state to store patients
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(''); // New state to store selected patient
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [patientId, setPatientId] = useState(null);
  const navigate = useNavigate();

  // Fetch patient profile on page load
  useEffect(() => {
    const fetchPatientProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        navigate('/login'); // Redirect if no token is found
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid; // Extracting patient ID from token
        setPatientId(patientId);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    };

    fetchPatientProfile();
  }, [navigate]);

  // Fetch doctors based on departmentId
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const formData = new FormData();
        formData.append('doctorspecialization', departmentId);

        const response = await axios.post('http://localhost:5000/selectivedoctordata', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data.data) {
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

  // Fetch patients for the dropdown
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/patientops/getallpatient');
        console.log(response.data);
        if (response.data) {
          const patientList = response.data.map((patient) => ({
            id: patient.uid,
            name: patient.firstname,
          }));
          setPatients(patientList);
        } else {
          setPatients([]);
          setAppointmentStatus('No patients available.');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        setPatients([]);
        setAppointmentStatus('Error fetching patient data.');
      }
    };

    fetchPatients();
  }, []);

  // Handle changes in doctor selection
  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedDate('');
    setSelectedTime('');
  };

  // Handle changes in patient selection
  const handlePatientChange = (event) => {
    setSelectedPatient(event.target.value);
  };

  // Handle changes in date selection
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setSelectedTime('');
  };

  // Handle changes in time selection
  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  // Handle changes in appointment details
  const handleDetailsChange = (event) => {
    setAppointmentDetails(event.target.value);
  };

  // Handle appointment booking
  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedPatient || !selectedDate || !selectedTime || !appointmentDetails || !patientId) {
      setAppointmentStatus('Please fill all the required fields.');
      return;
    }

    // Log selected doctor and patient for debugging
    console.log('Selected Doctor:', selectedDoctor);
    console.log('Selected Patient:', selectedPatient);

    const doctor = doctors.find((doc) => doc.id === selectedDoctor);
    if (!doctor) {
      setAppointmentStatus('Invalid doctor selection.');
      console.log('Doctor not found:', selectedDoctor);
      return;
    }

    // Log doctor and patient ID and selected time for debugging
    console.log('Doctor ID:', doctor.id);
    console.log('Patient ID:', selectedPatient);
    console.log('Selected Time:', selectedTime);

    const appointmentDateTime = `${selectedDate} ${selectedTime}`; // Combine date and time

    try {
      const formData = new FormData();
      formData.append('doctorid', doctor.id); // Ensure doctor.id is correct
      formData.append('patinetid', selectedPatient); // Ensure selectedPatient is correct
      formData.append('appoinmenttime', appointmentDateTime);
      formData.append('appointmentdetails', appointmentDetails);

      console.log('Form Data:', formData); // Log the formData to see its content before sending

      const response = await axios.post('http://localhost:5000/createappoinment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Log the response to check the returned data
      console.log('Response:', response.data);

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
      <AdminNavbar />
      <div className="dashboard-content">
        <Adminsidebar />
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

          {/* Patient Selection */}
          <div className="patient-selection">
            <label>Select Patient:</label>
            <select value={selectedPatient} onChange={handlePatientChange}>
              <option value="">-- Select Patient --</option>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (UID: {patient.id})
                  </option>
                ))
              ) : (
                <option value="">No patients available</option>
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
