
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import AdminNavbar from '../Adminnavbar/AdminNavbar';
// import AdminSidebar from '../Adminsidebar/AdminSidebar';
// import { FaSpinner } from 'react-icons/fa';
// import './Bill.css';

// const CreateBillPage = () => {
//   const navigate = useNavigate();
//   const [patients, setPatients] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingDropdown, setLoadingDropdown] = useState({
//     patients: true,
//     doctors: true,
//     rooms: true,
//   });

//   const admissionPaymentMethods = ['cash', 'credit'];
//   const initialFormData = { /*... same as before ...*/ };
//   const [formData, setFormData] = useState(initialFormData);
// const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [patientsRes, doctorsRes, roomsRes] = await Promise.all([
//           fetch('https://backend.medapp.transev.site/patientops/getallpatient').then(res => res.json()),
//           fetch('https://backend.medapp.transev.site/doctorops/getalldoctor').then(res => res.json()),
//           fetch('https://backend.medapp.transev.site/ops/getallrooms').then(res => res.json()),
//         ]);

//         if (Array.isArray(patientsRes)) setPatients(patientsRes);
//         if (doctorsRes && Array.isArray(doctorsRes.data)) setDoctors(doctorsRes.data);
//         if (roomsRes && Array.isArray(roomsRes.data)) setRooms(roomsRes.data);

//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'purpose') {
//       setFormData(prev => ({
//         ...prev,
//         purpose: value,
//         // Reset fields only if purpose changed to non-Admission
//         rooms: value === 'Admission' ? prev.rooms : '',
//         medicine_charge: value === 'Admission' ? prev.medicine_charge : 0,
//         lab_charge: value === 'Admission' ? prev.lab_charge : 0,
//         other_charges: value === 'Admission' ? prev.other_charges : 0,
//         treatmenttype: value === 'Admission' ? prev.treatmenttype : '',
//         treatmentduration: value === 'Admission' ? prev.treatmentduration : '',
//         payment_method: value === 'Admission' ? admissionPaymentMethods[0] : 'cash',
//       }));
//     } else if (name === 'patientuid') {
//       const selectedPatient = patients.find(p => p.uid === value);
//       setFormData(prev => ({
//         ...prev,
//         patientemailid: selectedPatient ? selectedPatient.email : '',
//       }));
//     } else if (name === 'doctoruid') {
//       const selectedDoctor = doctors.find(d => d.uid === value);
//       setFormData(prev => ({
//         ...prev,
//         doctoremailid: selectedDoctor ? selectedDoctor.email : '',
//       }));
//     } else if (name === 'roomuid') {
//       const selectedRoom = rooms.find(r => r.uid === value);
//       setFormData(prev => ({
//         ...prev,
//         rooms: selectedRoom ? selectedRoom.room_type : '',
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setSubmitting(true); // Show spinner

//   try {
//     const payload = new URLSearchParams();
//     for (const key in formData) {
//       if (formData[key] !== undefined && formData[key] !== null) {
//         payload.append(key, formData[key]);
//       }
//     }

//     await axios.post('https://backend.medapp.transev.site/billing/createbill', payload, {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     });

//     alert('Bill created successfully!');
//     setFormData(initialFormData);
//     navigate('/admin-billing');
//   } catch (error) {
//     console.error('Error creating bill:', error);
//     alert('Failed to create bill. Please try again.');
//   } finally {
//     setSubmitting(false); // Hide spinner
//   }
// };

//   // if (loading) return <div>Loading...</div>;

//   const showRoomAndCharges = formData.purpose === 'Admission';
//   // Always show treatment fields (no condition)

//   // Determine available payment methods based on purpose
//   const paymentMethods =
//     formData.purpose === 'Admission'
//       ? admissionPaymentMethods
//       : ['cash', 'credit', 'debit', 'online'];


//   return (
//     <div className="createbill-background">
//       <div className="createbill-overlay">
//         <AdminNavbar />
//         <div className="createbill-content">
//           <AdminSidebar />
//           <div className="createbill-form-container">
//             <h2>Create Bill</h2>
//             <form onSubmit={handleSubmit} style={{ backgroundColor: "#e0f7fa", padding: "20px", borderRadius: "8px" }} >
//               {[
//                 { label: 'Patient', name: 'patientuid', options: patients },
//                 { label: 'Doctor', name: 'doctoruid', options: doctors },
//                 { label: 'Room', name: 'roomuid', options: rooms, cond: formData.purpose === 'Admission' }
//               ].map((field, idx) => (
//                 field.cond !== false && (
//                   <div className="form-group" key={idx}>
//                     <label>{field.label}</label>
//                     { loadingDropdown[field.label.toLowerCase()] ? (
//                      <div className="loading-overlay"><FaSpinner className="spin large" /></div>
//                     ) : (
//                       <select name={field.name} value={formData[field.name]} onChange={handleChange} required>
//                         <option value="">{`Select ${field.label}`}</option>
//                         {field.options.map(o => (
//                           <option key={o.uid} value={o.uid}>
//                             {o.firstname ? `${o.firstname} ${o.lastname}` : field.label === 'Room' ? `${o.room_number} - ${o.room_type}` : o.fullname}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>
//                 )
//               ))}

//               {/* Other fields for purpose, charges, notes */}
//               <div className="form-group">
//                 <label>Purpose</label>
//                 <select name="purpose" value={formData.purpose} onChange={handleChange} required>
//                   <option value="">Select Purpose</option>
//                   {['Admission', 'Appointment', ' Homecare', 'Lab Test'].map(pur => (
//                     <option key={pur} value={pur}>{pur}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Input fields */}
//               {['treatmenttype','treatmentduration','medicine_charge','lab_charge','other_charges','discount_percent','insurance_provider','insurance_coverage_percent','notes']
//                 .map((f, i) => (
//                   <div className="form-group" key={i}>
//                     <label>{f.replace(/_/g, ' ').replace(/percent/gi, '%')}</label>
//                     { f === 'notes'
//                       ? <textarea name={f} value={formData[f]} onChange={handleChange} rows="4" />
//                       : <input type={f.includes('charge') || f.includes('percent') ? 'number' : 'text'} name={f} value={formData[f]} onChange={handleChange} />
//                     }
//                   </div>
//               ))}

//               {/* <button type="submit" className="submit-btn">Create Bill</button> */}
//           <div style={{ textAlign: 'center', marginTop: '20px' }}>
//   <button
//     type="submit"
//     className="submit-btn"
//     disabled={submitting}
//     style={{
//       backgroundColor: submitting ? '#6c757d' : '#007bff',
//       color: '#fff',
//       padding: '10px 24px',
//       border: 'none',
//       borderRadius: '5px',
//       fontSize: '16px',
//       cursor: submitting ? 'not-allowed' : 'pointer',
//       display: 'inline-flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: '8px'
//     }}
//   >
//     {submitting ? (
//       <>
//         <FaSpinner className="spin" />
//         Creating...
//       </>
//     ) : (
//       'Create Bill'
//     )}
//   </button>
// </div>


//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateBillPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { FaSpinner } from 'react-icons/fa';
import './Bill.css';

const CreateBillPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const admissionPaymentMethods = ['cash', 'credit'];

  const initialFormData = {
    patientuid: '',
    patientemailid: '',
    doctoruid: '',
    doctoremailid: '',
    roomuid: '',
    rooms: '',
    purpose: '',
    treatmenttype: '',
    treatmentduration: '',
    treatment_charge: 0,
    medicine_charge: 0,
    lab_charge: 0,
    other_charges: 0,
    room_charge: 0,
    discount_percent: 0,
    insurance_provider: '',
    insurance_coverage_percent: 0,
    notes: '',
    payment_method: 'cash',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, roomsRes] = await Promise.all([
          fetch('https://backend.medapp.transev.site/patientops/getallpatient').then(res => res.json()),
          fetch('https://backend.medapp.transev.site/doctorops/getalldoctor').then(res => res.json()),
          fetch('https://backend.medapp.transev.site/ops/getallrooms').then(res => res.json()),
        ]);

        console.log('patientsRes:', patientsRes);
        console.log('doctorsRes:', doctorsRes);
        console.log('roomsRes:', roomsRes);

        if (Array.isArray(patientsRes)) setPatients(patientsRes);
        if (Array.isArray(doctorsRes)) setDoctors(doctorsRes);
        if (Array.isArray(roomsRes)) setRooms(roomsRes);

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
        rooms: value === 'Admission' ? prev.rooms : '',
        roomuid: value === 'Admission' ? prev.roomuid : '',
        room_charge: value === 'Admission' ? prev.room_charge : 0,
        medicine_charge: value === 'Admission' ? prev.medicine_charge : 0,
        lab_charge: value === 'Admission' ? prev.lab_charge : 0,
        other_charges: value === 'Admission' ? prev.other_charges : 0,
        treatmenttype: value === 'Admission' ? prev.treatmenttype : '',
        treatmentduration: value === 'Admission' ? prev.treatmentduration : '',
        treatment_charge: value === 'Admission' ? prev.treatment_charge : 0,
        payment_method: value === 'Admission' ? admissionPaymentMethods[0] : 'cash',
        doctoruid: value === 'Homecare' ? '' : prev.doctoruid,
        doctoremailid: value === 'Homecare' ? '' : prev.doctoremailid,
      }));
    } else if (name === 'patientuid') {
      const selectedPatient = patients.find(p => p.uid === value);
      setFormData(prev => ({
        ...prev,
        patientuid: value,
        patientemailid: selectedPatient ? selectedPatient.email : '',
      }));
    } else if (name === 'doctoruid') {
      const selectedDoctor = doctors.find(d => d.uid === value);
      setFormData(prev => ({
        ...prev,
        doctoruid: value,
        doctoremailid: selectedDoctor ? selectedDoctor.email : '',
      }));
    } else if (name === 'roomuid') {
      const selectedRoom = rooms.find(r => r.uid === value);
      setFormData(prev => ({
        ...prev,
        roomuid: value,
        rooms: selectedRoom ? selectedRoom.room_type : '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new URLSearchParams();
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      }

      await axios.post('https://backend.medapp.transev.site/billing/createbill', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      alert('Bill created successfully!');
      setFormData(initialFormData);
      navigate('/admin-billing');
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to create bill. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const showRoom = formData.purpose === 'Admission';
  const hideDoctor = formData.purpose === 'Homecare';

  const paymentMethods =
    formData.purpose === 'Admission'
      ? admissionPaymentMethods
      : ['cash', 'credit', 'debit', 'online'];

  // if (loading) {
  //   return (
  //     <div className="loading-overlay">
  //       <FaSpinner className="spin large" />
  //       Loading data...
  //     </div>
  //   );
  // }

  return (
    <div className="createbill-background">
      <div className="createbill-overlay">
        <AdminNavbar />
        <div className="createbill-content">
          <AdminSidebar />
          <div className="createbill-form-container">
            <h2>Create Bill</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: "#e0f7fa", padding: "20px", borderRadius: "8px" }}>

              {/* Patient Dropdown */}
              <div className="form-group">
                <label>Patient</label>
                <select name="patientuid" value={formData.patientuid} onChange={handleChange} required>
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.uid} value={p.uid}>
                      {p.firstname} {p.lastname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor Dropdown */}
              {!hideDoctor && (
                <div className="form-group">
                  <label>Doctor</label>
                  <select name="doctoruid" value={formData.doctoruid} onChange={handleChange} required>
                    <option value="">Select Doctor</option>
                    {doctors.map((d) => (
                      <option key={d.uid} value={d.uid}>
                        {d.fullname}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Room Dropdown */}
              {showRoom && (
                <>
                  <div className="form-group">
                    <label>Room</label>
                    <select name="roomuid" value={formData.roomuid} onChange={handleChange} required>
                      <option value="">Select Room</option>
                      {rooms.map((r) => (
                        <option key={r.uid} value={r.uid}>
                          {r.room_number} - {r.room_type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Room Charge Input */}
                  <div className="form-group">
                    <label>Room Charge</label>
                    <input
                      type="number"
                      name="room_charge"
                      value={formData.room_charge}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </>
              )}

              {/* Purpose */}
              <div className="form-group">
                <label>Purpose</label>
                <select name="purpose" value={formData.purpose} onChange={handleChange} required>
                  <option value="">Select Purpose</option>
                  {['Admission', 'Appointment', 'Homecare', 'Lab Test'].map((pur) => (
                    <option key={pur} value={pur}>{pur}</option>
                  ))}
                </select>
              </div>

              {/* Input Fields */}
              {[
                'treatmenttype',
                'treatmentduration',
                'treatment_charge',
                'medicine_charge',
                'lab_charge',
                'other_charges',
                'discount_percent',
                'insurance_provider',
                'insurance_coverage_percent',
                'notes',
              ].map((field, i) => (
                <div className="form-group" key={i}>
                  <label>{field.replace(/_/g, ' ').replace(/percent/i, '%')}</label>
                  {field === 'notes' ? (
                    <textarea name={field} value={formData[field]} onChange={handleChange} rows="4" />
                  ) : (
                    <input
                      type={field.includes('charge') || field.includes('percent') || field.includes('amount') ? 'number' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      min={field.includes('charge') || field.includes('percent') || field.includes('amount') ? '0' : undefined}
                    />
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                  style={{
                    backgroundColor: submitting ? '#6c757d' : '#007bff',
                    color: '#fff',
                    padding: '10px 24px',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Bill'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBillPage;

