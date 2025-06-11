
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

import AdminNavbar from '../Adminnavbar/AdminNavbar';
import Adminsidebar from '../Adminsidebar/AdminSidebar';

const AppointmentBookingPage = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentDetails, setAppointmentDetails] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');
  const [patientId, setPatientId] = useState(null);
  const navigate = useNavigate();

  // Decode token and get patientId
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(accessToken);
      setPatientId(decodedToken.userid);
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://192.168.0.105:5000/facilityops/getallfacility');
        console.log('Departments API response:', response.data);

        // Assuming response.data is an array of departments
        if (Array.isArray(response.data)) {
          setDepartments(response.data);
        } else if (Array.isArray(response.data.data)) {
          setDepartments(response.data.data);
        } else {
          setDepartments([]);
          setAppointmentStatus('Unexpected department data format.');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
        setAppointmentStatus('Error fetching department data.');
      }
    };

    fetchDepartments();
  }, []);

  // Fetch doctors whenever department changes
  useEffect(() => {
    const fetchDoctors = async () => {
      if (!selectedDepartment) {
        setDoctors([]);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('doctorspecialization', selectedDepartment);

        const response = await axios.post('http://192.168.0.105:5000/selectivedoctordata', formData);
        if (response.data.data && Array.isArray(response.data.data)) {
          const doctorList = response.data.data.map((doctor) => ({
            id: doctor.uid,
            name: doctor.fullname,
            specialization: selectedDepartment,
          }));
          setDoctors(doctorList);
          setAppointmentStatus('');
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

    fetchDoctors();
  }, [selectedDepartment]);

  // Fetch all patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://192.168.0.105:5000/patientops/getallpatient');
        if (Array.isArray(response.data)) {
          const patientList = response.data.map((patient) => ({
            id: patient.uid,
            name: patient.firstname,
          }));
          setPatients(patientList);
          setAppointmentStatus('');
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

  const handleBookAppointment = async () => {
    if (
      !selectedDoctor ||
      !selectedPatient ||
      !selectedDate ||
      !selectedTime ||
      !appointmentDetails ||
      !patientId
    ) {
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
      const formData = new FormData();
      formData.append('doctorid', doctor.id);
      formData.append('patinetid', selectedPatient);
      formData.append('appoinmenttime', appointmentDateTime);
      formData.append('appointmentdetails', appointmentDetails);

      const response = await axios.post('http://192.168.0.105:5000/createappoinment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.message) {
        setAppointmentStatus(`Appointment booked with Dr. ${doctor.name} for ${appointmentDateTime}.`);
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
      <div className="dashboard-content" style={{ display: 'flex' }}>
        <Adminsidebar />
        <div className="appointment-booking-container" style={{ flex: 1, padding: '20px' }}>
          <h2>Book Appointment</h2>

          {/* Department Selection */}
          <div className="form-group">
            <label>Select Department:</label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedDoctor('');
                setSelectedDate('');
                setSelectedTime('');
                setAppointmentStatus('');
              }}
            >
              <option value="">-- Select Department --</option>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <option key={dept.uid} value={dept.department_name}>
                    {dept.department_name}
                  </option>
                ))
              ) : (
                <option disabled>No departments found</option>
              )}
            </select>
          </div>

          {/* Doctor Selection */}
          {selectedDepartment && (
            <div className="form-group">
              <label>Select Doctor:</label>
              <select
                value={selectedDoctor}
                onChange={(e) => {
                  setSelectedDoctor(e.target.value);
                  setSelectedDate('');
                  setSelectedTime('');
                  setAppointmentStatus('');
                }}
              >
                <option value="">-- Select Doctor --</option>
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} (UID: {doctor.id})
                    </option>
                  ))
                ) : (
                  <option disabled>No doctors available</option>
                )}
              </select>
            </div>
          )}

          {/* Patient Selection */}
          <div className="form-group">
            <label>Select Patient:</label>
            <select
              value={selectedPatient}
              onChange={(e) => {
                setSelectedPatient(e.target.value);
                setAppointmentStatus('');
              }}
            >
              <option value="">-- Select Patient --</option>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (UID: {patient.id})
                  </option>
                ))
              ) : (
                <option disabled>No patients available</option>
              )}
            </select>
          </div>

          {/* Date Selection */}
          {selectedDoctor && (
            <div className="form-group">
              <label>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime('');
                  setAppointmentStatus('');
                }}
              />
            </div>
          )}

          {/* Time Selection */}
          {selectedDate && (
            <div className="form-group">
              <label>Select Time:</label>
              <select
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  setAppointmentStatus('');
                }}
              >
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
            <div className="form-group">
              <label>Appointment Details:</label>
              <textarea
                value={appointmentDetails}
                onChange={(e) => {
                  setAppointmentDetails(e.target.value);
                  setAppointmentStatus('');
                }}
                placeholder="Enter appointment details"
              ></textarea>
            </div>
          )}

          {/* Book Appointment Button */}
          <button onClick={handleBookAppointment} style={{ marginTop: '10px' }}>
            Book Appointment
          </button>

          {/* Appointment Status */}
          {appointmentStatus && (
            <div className="appointment-status" style={{ marginTop: '15px', color: 'green' }}>
              {appointmentStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
