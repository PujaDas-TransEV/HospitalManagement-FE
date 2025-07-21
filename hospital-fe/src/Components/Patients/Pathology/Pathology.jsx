
import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';  // fixed import name
import PatientNavbar from "../Navbar/PatientNavbar";
import PatientSidebar from "../Sidebar/PatientSidebar";
import './Pathology.css';

const API_URL = 'http://192.168.0.106:5000';

const PatientLabBookings = () => {
  const [formData, setFormData] = useState({
    labbookname: '',
    labbookdescription: '',
    cause: '',
    booking_time: '',
    doctor_reference: '',
    custom_doctor_name: '',
    attachment: null,
    labtesttype: '',
     tempbookingstatus: 'Booking'
  });
  const [labBookings, setLabBookings] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      setEmail(decoded.email);
      fetchBookings(decoded.email);
      fetchDoctors();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBookings = async (email) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/labbookofapatient`, {
        method: 'POST',
        body: new URLSearchParams({ email }),
      });
      const json = await res.json();
      if (json.labbook) setLabBookings(json.labbook);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_URL}/doctorops/getalldoctor`);
      const json = await res.json();
      if (json.data) setDoctors(json.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment') {
      setFormData(prev => ({ ...prev, attachment: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const getDoctorReferenceValue = () => {
    return formData.doctor_reference === 'custom'
      ? formData.custom_doctor_name
      : formData.doctor_reference;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append('email', email);

    Object.entries(formData).forEach(([k, v]) => {
      if (k === 'doctor_reference') {
        body.append('doctor_reference', getDoctorReferenceValue());
      } else if (k !== 'custom_doctor_name' && v) {
        body.append(k, v);
      }
    });

    try {
      const res = await fetch(`${API_URL}/labbook`, { method: 'POST', body });
      const json = await res.json();

      if (json.message) {
        setStatus('✅ Lab booking created.');
        fetchBookings(email);
        setFormData({
          labbookname: '',
          labbookdescription: '',
          cause: '',
          booking_time: '',
          doctor_reference: '',
          custom_doctor_name: '',
          attachment: null,
          labtesttype: '',
            tempbookingstatus: 'Booking'
        });
      } else {
        setStatus('❌ Creation failed.');
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      setStatus('❌ Creation failed.');
    }
  };

  const handleEdit = (booking) => {
    setEditData({ ...booking });
  };

  const handleUpdate = async () => {
    const body = new FormData();
    ['labbookname', 'labbookdescription', 'cause', 'booking_time', 'doctor_reference', 'labtesttype', 'attachment'].forEach(k => {
      if (editData[k]) body.append(k, editData[k]);
    });
    body.append('labbookid', editData.uid);
    body.append('email', email);

    try {
      const res = await fetch(`${API_URL}/labbookupdate`, { method: 'POST', body });
      const json = await res.json();

      if (json.message) {
        setStatus('✅ Booking updated.');
        setEditData(null);
        fetchBookings(email);
      } else {
        setStatus('❌ Update failed.');
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      setStatus('❌ Update failed.');
    }
  };

  // Sort bookings by created_at descending (newest first)
  const sortedBookings = [...labBookings].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <div className="dashboard-container">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
        <div className="lab-container-book">
          <h2>Book a Lab Test</h2>
          <form onSubmit={handleSubmit} className="lab-form-book">
            <select name="labtesttype" value={formData.labtesttype} onChange={handleChange} required>
              <option value="">-- Select Lab Test Type --</option>
              <option value="Blood Test">Blood Test</option>
              <option value="Urine Test">Urine Test</option>
              <option value="Malaria Test">Malaria Test</option>
              <option value="Sugar Test">Sugar Test</option>
              <option value="COVID-19 Test">COVID-19 Test</option>
            </select>

            <input name="labbookname" placeholder="Test Name" value={formData.labbookname} onChange={handleChange} required />
            <input name="labbookdescription" placeholder="Description" value={formData.labbookdescription} onChange={handleChange} />
            <input name="cause" placeholder="Cause" value={formData.cause} onChange={handleChange} required />
            <input type="datetime-local" name="booking_time" value={formData.booking_time} onChange={handleChange} required />

            <select name="doctor_reference" value={formData.doctor_reference} onChange={handleChange} required>
              <option value="">-- Select Doctor --</option>
              {doctors.map(d => (
                // <option key={d.uid} value={d.uid}>
                <option key={d.uid} value={d.fullname}>
                  {d.fullname} ({d.specialization})
                </option>
              ))}
              <option value="custom">Other (Enter manually)</option>
            </select>

            {formData.doctor_reference === 'custom' && (
              <input name="custom_doctor_name" placeholder="Enter Doctor Name" value={formData.custom_doctor_name} onChange={handleChange} required />
            )}

            <input
              type="file"
              name="attachment"
              onChange={handleChange}
              accept="image/*,application/pdf"
              style={{
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                margin: '10px 0',
                backgroundColor: '#f9f9f9',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            />

            <button type="submit">Book Now</button>
            {status && <p className="status">{status}</p>}
          </form>

          <h2>My Lab Bookings</h2>
          <div className="lab-bookings-list">
            {loading ? (
              <p>Loading bookings...</p>
            ) : sortedBookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              sortedBookings.map(b => (
                <div className="lab-booking-card" key={b.uid}>
                  <p><strong>Test:</strong> {b.labbookname}</p>
                  <p><strong>Description:</strong> {b.labbookdescription || '-'}</p>
                  <p><strong>Cause:</strong> {b.cause}</p>
                  <p><strong>Lab Test Type:</strong> {b.labtesttype || '-'}</p>
                  <p><strong>Time:</strong> {new Date(b.booking_time).toLocaleString()}</p>
                  <p><strong>Doctor:</strong> {b.doctor_reference}</p>
                    <p><strong>Status:</strong> {b.tempbookingstatus}</p>

                  {b.attachment_base64 && (
                    <div>
                      <strong>Attachment:</strong>
                      <img
                        src={`data:image/png;base64,${b.attachment_base64}`}
                        alt="Lab Attachment"
                        style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', marginTop: '10px' }}
                      />
                    </div>
                  )}

                  <p><strong>Created:</strong> {new Date(b.created_at).toLocaleString()}</p>
                  <button onClick={() => handleEdit(b)}>Edit</button>
                </div>
              ))
            )}
          </div>

          {editData && (
            <div className="edit-modal-labbook">
              <h3>Edit Booking</h3>
              <input name="labbookname" value={editData.labbookname} onChange={e => setEditData({ ...editData, labbookname: e.target.value })} required />
              <input name="labbookdescription" value={editData.labbookdescription} onChange={e => setEditData({ ...editData, labbookdescription: e.target.value })} />
              <input name="cause" value={editData.cause} onChange={e => setEditData({ ...editData, cause: e.target.value })} required />
              <input type="datetime-local" name="booking_time" value={editData.booking_time} onChange={e => setEditData({ ...editData, booking_time: e.target.value })} required />

              <select name="labtesttype" value={editData.labtesttype || ''} onChange={e => setEditData({ ...editData, labtesttype: e.target.value })} required>
                <option value="">-- Select Lab Test Type --</option>
                <option value="Blood Test">Blood Test</option>
                <option value="Urine Test">Urine Test</option>
                <option value="Malaria Test">Malaria Test</option>
                <option value="Sugar Test">Sugar Test</option>
                <option value="COVID-19 Test">COVID-19 Test</option>
              </select>

              <input type="file" name="attachment" onChange={e => setEditData({ ...editData, attachment: e.target.files[0] })} accept="image/*,application/pdf" />

              <div className="edit-buttons">
                <button onClick={handleUpdate}>Update</button>
                <button onClick={() => setEditData(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientLabBookings;
