import React, { useState } from 'react';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import './Appointment.css';

const departments = [
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'neurology', name: 'Neurology' },
  { id: 'orthopedics', name: 'Orthopedics' },
  { id: 'dermatology', name: 'Dermatology' },
  { id: 'pediatrics', name: 'Pediatrics' },
  {id: 'surgery', name:'surgery'}
];

const doctors = {
  cardiology: [
    { id: 1, name: 'Dr. John Smith', slots: ['10:00 AM', '11:00 AM', '02:00 PM'] },
    { id: 2, name: 'Dr. Sarah Lee', slots: ['09:00 AM', '12:00 PM', '03:00 PM'] },
  ],
  neurology: [
    { id: 1, name: 'Dr. David Wong', slots: ['11:00 AM', '01:00 PM', '04:00 PM'] },
    { id: 2, name: 'Dr. Emily Clark', slots: ['09:30 AM', '02:30 PM', '05:00 PM'] },
  ],
  // Add other departments and their doctors as needed
  surgery:[
    {id:1,name:'Dr.John De', slots: ['9:00 AM','4:00 PM']},
    {id:2,name:'Dr.P B Sarkar', slots:['11 AM','3 PM','8 PM']},
  

  ]
};

const DoctorAppointment = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('');

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedDoctor(null); // Reset doctor selection when department changes
    setSelectedSlot(''); // Reset slot when department changes
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedSlot(''); // Reset slot when doctor changes
  };

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  const handleBookAppointment = () => {
    if (!selectedDepartment || !selectedDoctor || !selectedSlot) {
      setAppointmentStatus('Please select department, doctor, and slot.');
      return;
    }
    setAppointmentStatus(`Appointment booked with Dr. ${selectedDoctor} for ${selectedSlot}.`);
  };

  return (
    <div className="appointment-container">
      {/* Patient Navbar */}
      <PatientNavbar />

      <div className="appointment-content">
        {/* Patient Sidebar */}
        <PatientSidebar />

        {/* Main Appointment Content */}
        <div className="appointment-main">
          <h2>Book an Appointment</h2>

          {/* Department Selection */}
          <div className="department-selection">
            <label htmlFor="department">Select Department:</label>
            <select id="department" value={selectedDepartment} onChange={handleDepartmentChange}>
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          {selectedDepartment && (
            <div className="doctor-selection">
              <label htmlFor="doctor">Select Doctor:</label>
              <select id="doctor" value={selectedDoctor} onChange={handleDoctorChange}>
                <option value="">-- Select Doctor --</option>
                {doctors[selectedDepartment]?.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Slot Selection */}
          {selectedDoctor && (
            <div className="slot-selection">
              <label htmlFor="slot">Select Slot:</label>
              <select id="slot" value={selectedSlot} onChange={handleSlotChange}>
                <option value="">-- Select Slot --</option>
                {doctors[selectedDepartment]?.find((doc) => doc.name === selectedDoctor)?.slots.map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          )}

          {/* Book Appointment Button */}
          <button onClick={handleBookAppointment} className="book-btn">
            Book Appointment
          </button>

          {/* Appointment Status Message */}
          {appointmentStatus && <div className="appointment-status">{appointmentStatus}</div>}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;
