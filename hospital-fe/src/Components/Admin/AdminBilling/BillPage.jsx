import React, { useState } from 'react';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
const patients = [
  { id: 'P001', name: 'John Doe' },
  { id: 'P002', name: 'Jane Smith' },
  { id: 'P003', name: 'Alice Johnson' },
];

const purposes = [
  { id: 'consultation', label: 'Consultation', amount: 100 },
  { id: 'appointment', label: 'Appointment', amount: 150 },
  { id: 'treatment', label: 'Treatment', amount: 300 },
];

const rooms = [
  { id: 'room1', label: 'Room 1', extraCharge: 50 },
  { id: 'room2', label: 'Room 2', extraCharge: 100 },
  { id: 'room3', label: 'Room 3', extraCharge: 150 },
];

const CreateBillPage = () => {
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [room, setRoom] = useState('');
  const [amount, setAmount] = useState(0);

  // Update patient name when patient ID changes
  const handlePatientIdChange = (e) => {
    const id = e.target.value;
    setPatientId(id);
    const patient = patients.find((p) => p.id === id);
    setPatientName(patient ? patient.name : '');
  };

  // Update amount when purpose or room changes
  const updateAmount = (selectedPurpose, selectedRoom) => {
    const purposeObj = purposes.find((p) => p.id === selectedPurpose);
    const roomObj = rooms.find((r) => r.id === selectedRoom);

    // Calculate amount: base purpose amount + room extra charge (except for appointment which has separate amount)
    let baseAmount = purposeObj ? purposeObj.amount : 0;

    // For appointment purpose, only the appointment amount applies (no room charges)
    if (selectedPurpose === 'appointment') {
      setAmount(purposeObj.amount);
    } else {
      setAmount(baseAmount + (roomObj ? roomObj.extraCharge : 0));
    }
  };

  const handlePurposeChange = (e) => {
    const val = e.target.value;
    setPurpose(val);
    updateAmount(val, room);
  };

  const handleRoomChange = (e) => {
    const val = e.target.value;
    setRoom(val);
    updateAmount(purpose, val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId || !patientName || !purpose) {
      alert('Please fill all required fields');
      return;
    }
    alert(`Bill created for ${patientName} with amount $${amount}`);
    // Reset form
    setPatientId('');
    setPatientName('');
    setPurpose('');
    setRoom('');
    setAmount(0);
  };

  return (
    <div className="dashboard-container">
      <AdminNavbar />
      <div className="dashboard-content">
        <AdminSidebar />
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: 600,
      margin: '30px auto',
      padding: 20,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: 20, color: '#333' }}>Create New Bill</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {/* Patient ID */}
        <label style={{ fontWeight: '600' }}>
          Patient ID <span style={{ color: 'red' }}>*</span>
          <input
            type="text"
            value={patientId}
            onChange={handlePatientIdChange}
            placeholder="Enter Patient ID"
            style={{
              marginTop: 5,
              padding: '8px 12px',
              fontSize: 16,
              borderRadius: 4,
              border: '1px solid #ccc',
              width: '100%'
            }}
            list="patient-ids"
          />
          <datalist id="patient-ids">
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </datalist>
        </label>

        {/* Patient Name */}
        <label style={{ fontWeight: '600' }}>
          Patient Name <span style={{ color: 'red' }}>*</span>
          <select
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            style={{
              marginTop: 5,
              padding: '8px 12px',
              fontSize: 16,
              borderRadius: 4,
              border: '1px solid #ccc',
              width: '100%'
            }}
          >
            <option value="">Select Patient Name</option>
            {patients.map((p) => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </label>

        {/* Purpose */}
        <label style={{ fontWeight: '600' }}>
          Purpose <span style={{ color: 'red' }}>*</span>
          <select
            value={purpose}
            onChange={handlePurposeChange}
            style={{
              marginTop: 5,
              padding: '8px 12px',
              fontSize: 16,
              borderRadius: 4,
              border: '1px solid #ccc',
              width: '100%'
            }}
          >
            <option value="">Select Purpose</option>
            {purposes.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>

        {/* Room */}
        <label style={{ fontWeight: '600' }}>
          Room
          <select
            value={room}
            onChange={handleRoomChange}
            disabled={purpose === 'appointment'}
            style={{
              marginTop: 5,
              padding: '8px 12px',
              fontSize: 16,
              borderRadius: 4,
              border: '1px solid #ccc',
              width: '100%',
              backgroundColor: purpose === 'appointment' ? '#e9ecef' : 'white',
              cursor: purpose === 'appointment' ? 'not-allowed' : 'pointer'
            }}
          >
            <option value="">Select Room</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          {purpose === 'appointment' && (
            <small style={{ color: '#6c757d' }}>Room selection disabled for Appointment purpose</small>
          )}
        </label>

        {/* Amount Display */}
        <div style={{
          fontWeight: '700',
          fontSize: 18,
          marginTop: 10,
          padding: 10,
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: 4,
          textAlign: 'center'
        }}>
          Total Amount: ${amount.toFixed(2)}
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            marginTop: 20,
            padding: '10px 20px',
            fontSize: 18,
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
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
