import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlusCircle, FaTrash, FaCalendarAlt, FaClock, FaSpinner, FaEdit } from 'react-icons/fa';
import './Timeschedule.css';
import medicalBg from '../../Assests/background.jpg';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
const API = {
  doctors: 'http://192.168.0.106:5000/doctorops/getalldoctor',
  create: 'http://192.168.0.106:5000/doctors/createdoctortimetable',
  update: 'http://192.168.0.106:5000/doctors/updatedoctortimetable',
};

const DoctorSchedulePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([{ start_time: '', end_time: '' }]);
  const [loading, setLoading] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(API.doctors);
      if (res.data?.data) setDoctors(res.data.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Failed to fetch doctors.');
    }
  };

  const addSlot = () => setSlots(prev => [...prev, { start_time: '', end_time: '' }]);
  const removeSlot = idx => setSlots(prev => prev.filter((_, i) => i !== idx));
  const updateSlot = (idx, field, value) => {
    setSlots(prev => {
      const newSlots = [...prev];
      newSlots[idx][field] = value;
      return newSlots;
    });
  };

  const handleEditTimetable = (doctorId, selectedDate) => {
    setEditingTimetable({ doctorid: doctorId, date: selectedDate });
    setSelectedDoctor(doctorId);
    setDate(selectedDate);

    const doctor = doctors.find(d => d.uid === doctorId);
    if (!doctor) {
      setSlots([{ start_time: '', end_time: '' }]);
      return;
    }

    const timetableEntry = doctor.timetable.find(t => t.date === selectedDate);
    if (timetableEntry && timetableEntry.schedule?.length) {
      setSlots(timetableEntry.schedule);
    } else {
      setSlots([{ start_time: '', end_time: '' }]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedDoctor) return alert('Please select a doctor.');
    if (!date) return alert('Please select a date.');
    if (slots.some(slot => !slot.start_time || !slot.end_time))
      return alert('All time slots must have start and end time.');

    setLoading(true);
    const payload = { doctorid: selectedDoctor, date, schedule: slots };

    try {
      if (editingTimetable) {
        // Update existing timetable
        await axios.patch(API.update, payload);
        alert('Schedule updated successfully!');
      } else {
        // Create new timetable
        await axios.post(API.create, payload);
        alert('Schedule created successfully!');
      }

      await fetchDoctors();

      setSelectedDoctor('');
      setDate('');
      setSlots([{ start_time: '', end_time: '' }]);
      setEditingTimetable(null);
    } catch (error) {
      console.error('Failed to save schedule:', error);

      // Improved error handling:
      if (error.response) {
        // Server responded with status code outside 2xx
        alert(`Error ${error.response.status}: ${error.response.data?.message || JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // Request sent but no response received
        alert('No response from server. Please check your network.');
      } else {
        // Something else went wrong setting up the request
        alert('Error setting up request: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="doctor-scheduler-page">
      <AdminNavbar />
      <div className="doctor-management-content">
        <AdminSidebar />
    <div
  className="doctor-schedule-page"
 
>
      <h1>
        <FaCalendarAlt style={{ marginRight: 10 }} /> Doctor Timetable Scheduler
      </h1>

      <form onSubmit={handleSubmit} className="schedule-form">
        <label>
          Doctor:
          <select
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map(doc => (
              <option key={doc.uid} value={doc.uid}>
                {doc.fullname} — {doc.specialization} ({doc.qualification})
              </option>
            ))}
          </select>
        </label>

        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </label>

        <div className="slots-list">
          {slots.map((slot, idx) => (
            <div key={idx} className="slot">
              <FaClock className="icon" />
              <input
                type="time"
                value={slot.start_time}
                onChange={e => updateSlot(idx, 'start_time', e.target.value)}
                required
              />
              <span>to</span>
              <input
                type="time"
                value={slot.end_time}
                onChange={e => updateSlot(idx, 'end_time', e.target.value)}
                required
              />
              {slots.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlot(idx)}
                  className="icon-button"
                  aria-label="Remove slot"
                  title="Remove slot"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
  type="button"
  onClick={addSlot}
  className="add-slot-btn"
  aria-label="Add slot"
  style={{ width: '150px', justifyContent: 'center', gap: '6px' }}
>
  <FaPlusCircle /> Add Slot
</button>

        <button
  type="submit"
  className="submit-btn"
  disabled={loading}
  style={{ width: '180px', margin: '0 auto', display: 'block' }}
>
  {loading ? <FaSpinner className="spin" /> : editingTimetable ? 'Update Schedule' : 'Create Schedule'}
</button>

      </form>

      <hr style={{ margin: '40px 0' }} />

      <h2>All Doctors' Timetables</h2>
      {doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        doctors.map(doc => (
          <div key={doc.uid} className="doctor-block" style={{ marginBottom: 30 }}>
            <h3>
              {doc.fullname} — {doc.specialization} ({doc.qualification})
            </h3>
            {doc.timetable.length === 0 ? (
              <p><i>No timetables available.</i></p>
            ) : (
              <table
                className="timetable-table"
                border="1"
                cellPadding="8"
                style={{ borderCollapse: 'collapse', width: '100%' }}
              >
                <thead style={{ backgroundColor: '#eee' }}>
                  <tr>
                    <th>Date</th>
                    <th>Time Slots</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {doc.timetable.map((entry, idx) => (
                    <tr key={idx}>
                      <td>{entry.date}</td>
                      <td>
                        {entry.schedule.map((slot, i) => (
                          <div key={i}>
                            {slot.start_time} - {slot.end_time}
                          </div>
                        ))}
                      </td>
                      <td>
                        <button
                          onClick={() => handleEditTimetable(doc.uid, entry.date)}
                          title="Edit Timetable"
                          style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'blue' }}
                          aria-label={`Edit timetable for ${doc.fullname} on ${entry.date}`}
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
    </div>
    </div>
  );
};

export default DoctorSchedulePage;
