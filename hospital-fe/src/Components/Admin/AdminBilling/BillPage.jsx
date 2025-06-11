
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Added for redirect
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const CreateBillPage = () => {
  const navigate = useNavigate(); // Initialize navigate

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const admissionPaymentMethods = ['cash', 'credit'];

  const initialFormData = {
    patientemailid: '',
    doctoremailid: '',
    purpose: '',
    rooms: '',
    treatmenttype: '',
    treatmentduration: '',
    medicine_charge: 0,
    lab_charge: 0,
    other_charges: 0,
    discount_percent: 0,
    insurance_provider: '',
    insurance_coverage_percent: 0,
    payment_method: 'cash',
    notes: '',
    created_by: 'admin',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, roomsRes] = await Promise.all([
          fetch('http://192.168.0.106:5000/patientops/getallpatient').then(res => res.json()),
          fetch('http://192.168.0.106:5000/doctorops/getalldoctor').then(res => res.json()),
          fetch('http://192.168.0.106:5000/ops/getallrooms').then(res => res.json()),
        ]);

        if (Array.isArray(patientsRes)) setPatients(patientsRes);
        if (doctorsRes && Array.isArray(doctorsRes.data)) setDoctors(doctorsRes.data);
        if (roomsRes && Array.isArray(roomsRes.data)) setRooms(roomsRes.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'purpose') {
      setFormData(prev => ({
        ...prev,
        purpose: value,
        // Reset fields only if purpose changed to non-Admission
        rooms: value === 'Admission' ? prev.rooms : '',
        medicine_charge: value === 'Admission' ? prev.medicine_charge : 0,
        lab_charge: value === 'Admission' ? prev.lab_charge : 0,
        other_charges: value === 'Admission' ? prev.other_charges : 0,
        treatmenttype: value === 'Admission' ? prev.treatmenttype : '',
        treatmentduration: value === 'Admission' ? prev.treatmentduration : '',
        payment_method: value === 'Admission' ? admissionPaymentMethods[0] : 'cash',
      }));
    } else if (name === 'patientuid') {
      const selectedPatient = patients.find(p => p.uid === value);
      setFormData(prev => ({
        ...prev,
        patientemailid: selectedPatient ? selectedPatient.email : '',
      }));
    } else if (name === 'doctoruid') {
      const selectedDoctor = doctors.find(d => d.uid === value);
      setFormData(prev => ({
        ...prev,
        doctoremailid: selectedDoctor ? selectedDoctor.email : '',
      }));
    } else if (name === 'roomuid') {
      const selectedRoom = rooms.find(r => r.uid === value);
      setFormData(prev => ({
        ...prev,
        rooms: selectedRoom ? selectedRoom.room_type : '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data for URL-encoded form submission
      const payload = new URLSearchParams();
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      }

      await axios.post('http://192.168.0.106:5000/billing/createbill', payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      alert('Bill created successfully!');

      setFormData(initialFormData);
      navigate('/admin-billing');  // Redirect after successful creation
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to create bill. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  const showRoomAndCharges = formData.purpose === 'Admission';
  // Always show treatment fields (no condition)

  // Determine available payment methods based on purpose
  const paymentMethods =
    formData.purpose === 'Admission'
      ? admissionPaymentMethods
      : ['cash', 'credit', 'debit', 'online'];

  return (
    <div className="dashboard-container">
      <AdminNavbar />
      <div className="dashboard-content" style={{ display: 'flex' }}>
        <AdminSidebar />
        <div
          style={{
            maxWidth: 600,
            margin: '30px auto',
            fontFamily: 'Arial, sans-serif',
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            width: '100%',
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Create Bill</h2>
          <form onSubmit={handleSubmit}>
            {/* Patient */}
            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="patientuid"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Patient
              </label>
              <select
                id="patientuid"
                name="patientuid"
                value={patients.find(p => p.email === formData.patientemailid)?.uid || ''}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.uid} value={p.uid}>
                    {p.firstname} {p.lastname}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="doctoruid"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Doctor
              </label>
              <select
                id="doctoruid"
                name="doctoruid"
                value={doctors.find(d => d.email === formData.doctoremailid)?.uid || ''}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Select Doctor</option>
                {doctors.map(d => (
                  <option key={d.uid} value={d.uid}>
                    {d.fullname}
                  </option>
                ))}
              </select>
            </div>

            {/* Purpose */}
            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="purpose"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Purpose
              </label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Select Purpose</option>
                <option value="Admission">Admission</option>
                <option value="Appointment">Appointment</option>
                <option value="Doctor Homecare">Doctor Homecare</option>
                <option value="Lab Test">Lab Test</option>
              </select>
            </div>

            {/* Room (Admission only) */}
            {showRoomAndCharges && (
              <div style={{ marginBottom: 15 }}>
                <label
                  htmlFor="roomuid"
                  style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
                >
                  Room
                </label>
                <select
                  id="roomuid"
                  name="roomuid"
                  value={rooms.find(r => r.room_type === formData.rooms)?.uid || ''}
                  onChange={handleChange}
                  required={showRoomAndCharges}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  <option value="">Select Room</option>
                  {rooms.map(r => (
                    <option key={r.uid} value={r.uid}>
                      {r.room_number} - {r.room_type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Treatment Type & Duration (always shown now) */}
            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="treatmenttype"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Treatment Type
              </label>
              <input
                id="treatmenttype"
                name="treatmenttype"
                type="text"
                value={formData.treatmenttype}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="treatmentduration"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Treatment Duration (days)
              </label>
              <input
                id="treatmentduration"
                name="treatmentduration"
                type="number"
                min="1"
                value={formData.treatmentduration}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            {/* Charges */}
            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="medicine_charge"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Medicine Charge
              </label>
              <input
                id="medicine_charge"
                name="medicine_charge"
                type="number"
                min="0"
                value={formData.medicine_charge}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="lab_charge"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Lab Charge
              </label>
              <input
                id="lab_charge"
                name="lab_charge"
                type="number"
                min="0"
                value={formData.lab_charge}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="other_charges"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Other Charges
              </label>
              <input
                id="other_charges"
                name="other_charges"
                type="number"
                min="0"
                value={formData.other_charges}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            {/* Discount */}
            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="discount_percent"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Discount Percent (%)
              </label>
              <input
                id="discount_percent"
                name="discount_percent"
                type="number"
                min="0"
                max="100"
                value={formData.discount_percent}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            {/* Insurance */}
            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="insurance_provider"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Insurance Provider
              </label>
              <input
                id="insurance_provider"
                name="insurance_provider"
                type="text"
                value={formData.insurance_provider}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="insurance_coverage_percent"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Insurance Coverage Percent (%)
              </label>
              <input
                id="insurance_coverage_percent"
                name="insurance_coverage_percent"
                type="number"
                min="0"
                max="100"
                value={formData.insurance_coverage_percent}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            {/* Payment Method */}
            {/* <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="payment_method"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Payment Method
              </label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </option>
                ))}
              </select>
            </div> */}

            {/* Notes */}
            <div style={{ marginBottom: 15 }}>
              <label
                htmlFor="notes"
                style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                width: '100%',
                fontSize: 16,
              }}
            >
              Create Bill
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBillPage;
