
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AdminNavbar from '../Adminnavbar/AdminNavbar';
// import AdminSidebar from '../Adminsidebar/AdminSidebar';

// const CreateBillPage = () => {
//   const [patients, setPatients] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Lab reports for selected patient (used when purpose is Lab Test)
//   const [labReports, setLabReports] = useState([]);

//   const [formData, setFormData] = useState({
//     patientuid: '',
//     doctoruid: '',
//     purpose: '',
//     roomuid: '',
//     treatmenttype: '',
//     treatmentduration: '',
//     medicine_charge: 0,
//     lab_charge: 0,
//     homecare_charge: 0,
//     other_charges: 0,
//     discount_percent: 0,
//     insurance_provider: '',
//     insurance_coverage_percent: 0,
//     payment_method: 'cash',
//     notes: '',
//     created_by: 'admin',
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [patientsRes, doctorsRes, roomsRes] = await Promise.all([
//           fetch('http://localhost:5000/patientops/getallpatient').then(res => res.json()),
//           fetch('http://localhost:5000/doctorops/getalldoctor').then(res => res.json()),
//           fetch('http://localhost:5000/ops/getallrooms').then(res => res.json()),
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

//   // Fetch lab reports by patient ID when patient changes and purpose is "Lab Test"
//   useEffect(() => {
//     const fetchLabReports = async () => {
//       if (formData.patientuid && formData.purpose === 'Lab Test') {
//         try {
//           const response = await axios.post('http://localhost:5000/labreport/bypatientid', {
//             patientid: formData.patientuid,
//           });

//           if (response.data && Array.isArray(response.data.data)) {
//             // Filter lab test reports that contain "lab test" in typeoftest (case insensitive)
//             const labTestReports = response.data.data.filter(report =>
//               report.typeoftest.toLowerCase().includes('lab test')
//             );
//             setLabReports(labTestReports);
//           } else {
//             setLabReports([]);
//           }
//         } catch (error) {
//           console.error('Error fetching lab reports:', error);
//           setLabReports([]);
//         }
//       } else {
//         setLabReports([]);
//       }
//     };

//     fetchLabReports();
//   }, [formData.patientuid, formData.purpose]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'purpose') {
//       setFormData(prev => ({
//         ...prev,
//         purpose: value,
//         // Reset fields related to room & charges on purpose change
//         roomuid: '',
//         medicine_charge: 0,
//         lab_charge: 0,
//         homecare_charge: 0,
//         other_charges: 0,
//         // Reset treatment fields if purpose not admission
//         treatmenttype: value === 'Admission' ? prev.treatmenttype : '',
//         treatmentduration: value === 'Admission' ? prev.treatmentduration : '',
//       }));
//     } else if (name === 'patientuid') {
//       // When patient changes, reset lab reports and form fields that depend on patient if needed
//       setFormData(prev => ({
//         ...prev,
//         patientuid: value,
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/billing/createbill', formData);
//       alert('Bill created successfully!');
//       setFormData({
//         patientuid: '',
//         doctoruid: '',
//         purpose: '',
//         roomuid: '',
//         treatmenttype: '',
//         treatmentduration: '',
//         medicine_charge: 0,
//         lab_charge: 0,
//         homecare_charge: 0,
//         other_charges: 0,
//         discount_percent: 0,
//         insurance_provider: '',
//         insurance_coverage_percent: 0,
//         payment_method: 'cash',
//         notes: '',
//         created_by: 'admin',
//       });
//       setLabReports([]);
//     } catch (error) {
//       console.error('Error creating bill:', error);
//       alert('Failed to create bill. Please try again.');
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   const showRoomAndCharges = formData.purpose === 'Admission';
//   const showHomecareCharges = formData.purpose === 'Homecare';
//   const showLabCharges = formData.purpose === 'Lab Test';
//   const showTreatmentFields = formData.purpose === 'Admission';

//   return (
//     <div className="dashboard-container">
//       <AdminNavbar />
//       <div className="dashboard-content" style={{ display: 'flex' }}>
//         <AdminSidebar />
//         <div
//           style={{
//             maxWidth: 600,
//             margin: '30px auto',
//             fontFamily: 'Arial, sans-serif',
//             padding: 20,
//             border: '1px solid #ddd',
//             borderRadius: 8,
//             boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//             width: '100%',
//           }}
//         >
//           <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Create Bill</h2>
//           <form onSubmit={handleSubmit}>
//             {/* Patient */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="patientuid" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Patient
//               </label>
//               <select
//                 id="patientuid"
//                 name="patientuid"
//                 value={formData.patientuid}
//                 onChange={handleChange}
//                 required
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               >
//                 <option value="">Select Patient</option>
//                 {patients.map((p) => (
//                   <option key={p.uid} value={p.uid}>
//                     {p.firstname} {p.lastname}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Doctor */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="doctoruid" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Doctor
//               </label>
//               <select
//                 id="doctoruid"
//                 name="doctoruid"
//                 value={formData.doctoruid}
//                 onChange={handleChange}
//                 required
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               >
//                 <option value="">Select Doctor</option>
//                 {doctors.map((d) => (
//                   <option key={d.uid} value={d.uid}>
//                     {d.fullname}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Purpose */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="purpose" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Purpose
//               </label>
//               <select
//                 id="purpose"
//                 name="purpose"
//                 value={formData.purpose}
//                 onChange={handleChange}
//                 required
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               >
//                 <option value="">Select Purpose</option>
//                 <option value="Admission">Admission</option>
//                 <option value="Appointment">Appointment</option>
//                 <option value="Doctor Homecare">Doctor Homecare</option>
//                 <option value="Lab Test">Lab Test</option>
//               </select>
//             </div>

//             {/* Room selection for Admission */}
//             {showRoomAndCharges && (
//               <div style={{ marginBottom: 15 }}>
//                 <label htmlFor="roomuid" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                   Room
//                 </label>
//                 <select
//                   id="roomuid"
//                   name="roomuid"
//                   value={formData.roomuid}
//                   onChange={handleChange}
//                   required={showRoomAndCharges}
//                   style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                 >
//                   <option value="">Select Room</option>
//                   {rooms.map((r) => (
//                     <option key={r.uid} value={r.uid}>
//                       {r.room_number} - {r.room_type}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Treatment Type and Duration only for Admission */}
//             {showTreatmentFields && (
//               <>
//                 <div style={{ marginBottom: 15 }}>
//                   <label htmlFor="treatmenttype" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                     Treatment Type
//                   </label>
//                   <input
//                     id="treatmenttype"
//                     name="treatmenttype"
//                     type="text"
//                     value={formData.treatmenttype}
//                     onChange={handleChange}
//                     style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 15 }}>
//                   <label htmlFor="treatmentduration" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                     Treatment Duration
//                   </label>
//                   <input
//                     id="treatmentduration"
//                     name="treatmentduration"
//                     type="text"
//                     value={formData.treatmentduration}
//                     onChange={handleChange}
//                     style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                   />
//                 </div>
//               </>
//             )}

//             {/* Charges sections */}
//             {/* Admission charges */}
//             {showRoomAndCharges && (
//               <>
//                 <div style={{ marginBottom: 15 }}>
//                   <label htmlFor="medicine_charge" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                     Medicine Charge
//                   </label>
//                   <input
//                     id="medicine_charge"
//                     name="medicine_charge"
//                     type="number"
//                     min="0"
//                     value={formData.medicine_charge}
//                     onChange={handleChange}
//                     style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 15 }}>
//                   <label htmlFor="lab_charge" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                     Lab Charge
//                   </label>
//                   <input
//                     id="lab_charge"
//                     name="lab_charge"
//                     type="number"
//                     min="0"
//                     value={formData.lab_charge}
//                     onChange={handleChange}
//                     style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                   />
//                 </div>
//               </>
//             )}

//             {/* Homecare Charges */}
//             {showHomecareCharges && (
//               <div style={{ marginBottom: 15 }}>
//                 <label htmlFor="homecare_charge" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                   Homecare Charge
//                 </label>
//                 <input
//                   id="homecare_charge"
//                   name="homecare_charge"
//                   type="number"
//                   min="0"
//                   value={formData.homecare_charge}
//                   onChange={handleChange}
//                   style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                 />
//               </div>
//             )}

//             {/* Lab Test Charges */}
//             {showLabCharges && (
//               <div style={{ marginBottom: 15 }}>
//                 <label htmlFor="lab_charge" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                   Lab Test Charge
//                 </label>
//                 <input
//                   id="lab_charge"
//                   name="lab_charge"
//                   type="number"
//                   min="0"
//                   value={formData.lab_charge}
//                   onChange={handleChange}
//                   style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                 />
//               </div>
//             )}

//             {/* Other Charges */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="other_charges" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Other Charges
//               </label>
//               <input
//                 id="other_charges"
//                 name="other_charges"
//                 type="number"
//                 min="0"
//                 value={formData.other_charges}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             {/* Discount */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="discount_percent" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Discount Percent
//               </label>
//               <input
//                 id="discount_percent"
//                 name="discount_percent"
//                 type="number"
//                 min="0"
//                 max="100"
//                 value={formData.discount_percent}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             {/* Insurance */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="insurance_provider" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Insurance Provider
//               </label>
//               <input
//                 id="insurance_provider"
//                 name="insurance_provider"
//                 type="text"
//                 value={formData.insurance_provider}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="insurance_coverage_percent" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Insurance Coverage Percent
//               </label>
//               <input
//                 id="insurance_coverage_percent"
//                 name="insurance_coverage_percent"
//                 type="number"
//                 min="0"
//                 max="100"
//                 value={formData.insurance_coverage_percent}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             {/* Payment Method */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="payment_method" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Payment Method
//               </label>
//               <select
//                 id="payment_method"
//                 name="payment_method"
//                 value={formData.payment_method}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               >
//                 <option value="cash">Cash</option>
//                 <option value="credit">Credit</option>
//                 <option value="insurance">Insurance</option>
//               </select>
//             </div>

//             {/* Notes */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="notes" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Notes
//               </label>
//               <textarea
//                 id="notes"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 rows="3"
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             <button
//               type="submit"
//               style={{
//                 backgroundColor: '#4CAF50',
//                 color: 'white',
//                 padding: '10px 20px',
//                 border: 'none',
//                 borderRadius: 4,
//                 cursor: 'pointer',
//                 width: '100%',
//                 fontSize: 16,
//               }}
//             >
//               Create Bill
//             </button>
//           </form>

//           {/* Display fetched Lab Tests and Symptoms when purpose is Lab Test */}
//           {formData.purpose === 'Lab Test' && labReports.length > 0 && (
//             <div style={{ marginTop: 30 }}>
//               <h3>Lab Tests and Symptoms for Selected Patient</h3>
//               {labReports.map((report) => (
//                 <div
//                   key={report._id || report.id}
//                   style={{
//                     border: '1px solid #ccc',
//                     padding: 10,
//                     marginBottom: 10,
//                     borderRadius: 4,
//                     backgroundColor: '#f9f9f9',
//                   }}
//                 >
//                   <p>
//                     <strong>Type of Test:</strong> {report.typeoftest}
//                   </p>
//                   <p>
//                     <strong>Symptoms:</strong> {report.patientsymptoms}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {formData.purpose === 'Lab Test' && labReports.length === 0 && formData.patientuid && (
//             <p style={{ marginTop: 20, fontStyle: 'italic' }}>No Lab Test reports found for this patient.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateBillPage;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import AdminNavbar from '../Adminnavbar/AdminNavbar';
// import AdminSidebar from '../Adminsidebar/AdminSidebar';

// const CreateBillPage = () => {
//   const [patients, setPatients] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Lab reports for selected patient (used when purpose is Lab Test)
//   const [labReports, setLabReports] = useState([]);

//   // Allowed payment methods for Admission bills - admin configurable
//   // You can fetch from backend or update this dynamically later
//   const [admissionPaymentMethods, setAdmissionPaymentMethods] = useState(['cash', 'credit']);

//   const [formData, setFormData] = useState({
//     patientemailid: '',
//     doctoruid: '',
//     purpose: '',
//     roomuid: '',
//     treatmenttype: '',
//     treatmentduration: '',
//     medicine_charge: 0,
//     lab_charge: 0,
//     homecare_charge: 0,
//     other_charges: 0,
//     discount_percent: 0,
//     insurance_provider: '',
//     insurance_coverage_percent: 0,
//     payment_method: 'cash',
//     notes: '',
//     created_by: 'admin',
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [patientsRes, doctorsRes, roomsRes] = await Promise.all([
//           fetch('http://localhost:5000/patientops/getallpatient').then(res => res.json()),
//           fetch('http://localhost:5000/doctorops/getalldoctor').then(res => res.json()),
//           fetch('http://localhost:5000/ops/getallrooms').then(res => res.json()),
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

//   // Fetch lab reports by patient ID when patient changes and purpose is "Lab Test"
//   useEffect(() => {
//     const fetchLabReports = async () => {
//       if (formData.patientuid && formData.purpose === 'Lab Test') {
//         try {
//           const response = await axios.post('http://localhost:5000/labreport/bypatientid', {
//             patientid: formData.patientuid,
//           });

//           if (response.data && Array.isArray(response.data.data)) {
//             // Filter lab test reports that contain "lab test" in typeoftest (case insensitive)
//             const labTestReports = response.data.data.filter(report =>
//               report.typeoftest.toLowerCase().includes('lab test')
//             );
//             setLabReports(labTestReports);
//           } else {
//             setLabReports([]);
//           }
//         } catch (error) {
//           console.error('Error fetching lab reports:', error);
//           setLabReports([]);
//         }
//       } else {
//         setLabReports([]);
//       }
//     };

//     fetchLabReports();
//   }, [formData.patientuid, formData.purpose]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === 'purpose') {
//       setFormData(prev => ({
//         ...prev,
//         purpose: value,
//         // Reset fields related to room & charges on purpose change
//         roomuid: '',
//         medicine_charge: 0,
//         lab_charge: 0,
//         homecare_charge: 0,
//         other_charges: 0,
//         // Reset treatment fields if purpose not admission
//         treatmenttype: value === 'Admission' ? prev.treatmenttype : '',
//         treatmentduration: value === 'Admission' ? prev.treatmentduration : '',
//         // Reset payment_method to first allowed if purpose changes to Admission
//         payment_method: value === 'Admission' ? admissionPaymentMethods[0] : 'cash',
//       }));
//     } else if (name === 'patientuid') {
//       // When patient changes, reset lab reports and form fields that depend on patient if needed
//       setFormData(prev => ({
//         ...prev,
//         patientuid: value,
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/billing/createbill', formData);
//       alert('Bill created successfully!');
//       setFormData({
//         patientemailid: '',
//         doctoruid: '',
//         purpose: '',
//         roomuid: '',
//         treatmenttype: '',
//         treatmentduration: '',
//         medicine_charge: 0,
//         lab_charge: 0,
//         homecare_charge: 0,
//         other_charges: 0,
//         discount_percent: 0,
//         insurance_provider: '',
//         insurance_coverage_percent: 0,
//         payment_method: 'cash',
//         notes: '',
//         created_by: 'admin',
//       });
//       setLabReports([]);
//     } catch (error) {
//       console.error('Error creating bill:', error);
//       alert('Failed to create bill. Please try again.');
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   const showRoomAndCharges = formData.purpose === 'Admission';
//   const showHomecareCharges = formData.purpose === 'Homecare';
//   const showLabCharges = formData.purpose === 'Lab Test';
//   const showTreatmentFields = formData.purpose === 'Admission';

//   return (
//     <div className="dashboard-container">
//       <AdminNavbar />
//       <div className="dashboard-content" style={{ display: 'flex' }}>
//         <AdminSidebar />
//         <div
//           style={{
//             maxWidth: 600,
//             margin: '30px auto',
//             fontFamily: 'Arial, sans-serif',
//             padding: 20,
//             border: '1px solid #ddd',
//             borderRadius: 8,
//             boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//             width: '100%',
//           }}
//         >
//           <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Create Bill</h2>
//           <form onSubmit={handleSubmit}>
//             {/* Patient */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="patientuid" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Patient
//               </label>
//               <select
//                 id="patientuid"
//                 name="patientuid"
//                 value={formData.patientemailid}
//                 onChange={handleChange}
//                 required
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               >
//                 <option value="">Select Patient</option>
//                 {patients.map((p) => (
//                   <option key={p.uid} value={p.uid}>
//                     {p.firstname} {p.lastname}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Doctor */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="doctoruid" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Doctor
//               </label>
//               <select
//                 id="doctoruid"
//                 name="doctoruid"
//                 value={formData.doctoruid}
//                 onChange={handleChange}
//                 required
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               >
//                 <option value="">Select Doctor</option>
//                 {doctors.map((d) => (
//                   <option key={d.uid} value={d.uid}>
//                     {d.fullname}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Purpose */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="purpose" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Purpose
//               </label>
//               <select
//                 id="purpose"
//                 name="purpose"
//                 value={formData.purpose}
//                 onChange={handleChange}
//                 required
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               >
//                 <option value="">Select Purpose</option>
//                 <option value="Admission">Admission</option>
//                 <option value="Appointment">Appointment</option>
//                 <option value="Doctor Homecare">Doctor Homecare</option>
//                 <option value="Lab Test">Lab Test</option>
//               </select>
//             </div>

//             {/* Room selection for Admission */}
//             {showRoomAndCharges && (
//               <div style={{ marginBottom: 15 }}>
//                 <label htmlFor="roomuid" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                   Room
//                 </label>
//                 <select
//                   id="roomuid"
//                   name="roomuid"
//                   value={formData.roomuid}
//                   onChange={handleChange}
//                   required={showRoomAndCharges}
//                   style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                 >
//                   <option value="">Select Room</option>
//                   {rooms.map((r) => (
//                     <option key={r.uid} value={r.uid}>
//                       {r.room_number} - {r.room_type}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Treatment Type and Duration only for Admission */}
//             {showTreatmentFields && (
//               <>
//                 <div style={{ marginBottom: 15 }}>
//                   <label htmlFor="treatmenttype" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                     Treatment Type
//                   </label>
//                   <input
//                     id="treatmenttype"
//                     name="treatmenttype"
//                     type="text"
//                     value={formData.treatmenttype}
//                     onChange={handleChange}
//                     style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                   />
//                 </div>

//                 <div style={{ marginBottom: 15 }}>
//                   <label htmlFor="treatmentduration" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                     Treatment Duration
//                   </label>
//                   <input
//                     id="treatmentduration"
//                     name="treatmentduration"
//                     type="text"
//                     value={formData.treatmentduration}
//                     onChange={handleChange}
//                     style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                   />
//                 </div>
//               </>
//             )}

//             {/* Medicine Charge - only for Admission */}
//             {formData.purpose === 'Admission' && (
//               <div style={{ marginBottom: 15 }}>
//                 <label htmlFor="medicine_charge" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                   Medicine Charge
//                 </label>
//                 <input
//                   id="medicine_charge"
//                   name="medicine_charge"
//                   type="number"
//                   min="0"
//                   value={formData.medicine_charge}
//                   onChange={handleChange}
//                   style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                 />
//               </div>
//             )}

//             {/* Lab Charge - only for Lab Test */}
//             {showLabCharges && (
//               <div style={{ marginBottom: 15 }}>
//                 <label htmlFor="lab_charge" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                   Lab Charge
//                 </label>
//                 <input
//                   id="lab_charge"
//                   name="lab_charge"
//                   type="number"
//                   min="0"
//                   value={formData.lab_charge}
//                   onChange={handleChange}
//                   style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                 />
//               </div>
//             )}

//             {/* Homecare Charge - only for Homecare */}
//             {showHomecareCharges && (
//               <div style={{ marginBottom: 15 }}>
//                 <label htmlFor="homecare_charge" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                   Homecare Charge
//                 </label>
//                 <input
//                   id="homecare_charge"
//                   name="homecare_charge"
//                   type="number"
//                   min="0"
//                   value={formData.homecare_charge}
//                   onChange={handleChange}
//                   style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//                 />
//               </div>
//             )}

//             {/* Other Charges - always shown */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="other_charges" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Other Charges
//               </label>
//               <input
//                 id="other_charges"
//                 name="other_charges"
//                 type="number"
//                 min="0"
//                 value={formData.other_charges}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             {/* Discount Percent */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="discount_percent" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Discount Percent
//               </label>
//               <input
//                 id="discount_percent"
//                 name="discount_percent"
//                 type="number"
//                 min="0"
//                 max="100"
//                 value={formData.discount_percent}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             {/* Insurance Provider */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="insurance_provider" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Insurance Provider
//               </label>
//               <input
//                 id="insurance_provider"
//                 name="insurance_provider"
//                 type="text"
//                 value={formData.insurance_provider}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             {/* Insurance Coverage Percent */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="insurance_coverage_percent" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Insurance Coverage Percent
//               </label>
//               <input
//                 id="insurance_coverage_percent"
//                 name="insurance_coverage_percent"
//                 type="number"
//                 min="0"
//                 max="100"
//                 value={formData.insurance_coverage_percent}
//                 onChange={handleChange}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             {/* Payment Method */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="payment_method" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Payment Method
//               </label>
//               <select
//                 id="payment_method"
//                 name="payment_method"
//                 value={formData.payment_method}
//                 onChange={handleChange}
//                 required
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               >
//                 {formData.purpose === 'Admission'
//                   ? admissionPaymentMethods.map((method) => (
//                       <option key={method} value={method}>
//                         {method.charAt(0).toUpperCase() + method.slice(1)}
//                       </option>
//                     ))
//                   : ['cash', 'credit', 'insurance'].map((method) => (
//                       <option key={method} value={method}>
//                         {method.charAt(0).toUpperCase() + method.slice(1)}
//                       </option>
//                     ))}
//               </select>
//               {formData.purpose === 'Admission' && (
//                 <p style={{ fontSize: 12, color: '#555', marginTop: 5 }}>
//                   * For admissions, acceptable payment methods are: {admissionPaymentMethods.join(', ')}.
//                 </p>
//               )}
//             </div>

//             {/* Notes */}
//             <div style={{ marginBottom: 15 }}>
//               <label htmlFor="notes" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
//                 Notes
//               </label>
//               <textarea
//                 id="notes"
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 rows={3}
//                 style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               style={{
//                 backgroundColor: '#007bff',
//                 color: '#fff',
//                 border: 'none',
//                 padding: '10px 20px',
//                 borderRadius: 4,
//                 cursor: 'pointer',
//                 width: '100%',
//                 fontSize: 16,
//               }}
//             >
//               Create Bill
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateBillPage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const CreateBillPage = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [labReports, setLabReports] = useState([]);
  const [admissionPaymentMethods, setAdmissionPaymentMethods] = useState(['cash', 'credit']);

  const [formData, setFormData] = useState({
    patientemailid: '',
    doctoruid: '',
    purpose: '',
    roomuid: '',
    treatmenttype: '',
    treatmentduration: '',
    medicine_charge: 0,
    lab_charge: 0,
    homecare_charge: 0,
    other_charges: 0,
    discount_percent: 0,
    insurance_provider: '',
    insurance_coverage_percent: 0,
    payment_method: 'cash',
    notes: '',
    created_by: 'admin',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes, roomsRes] = await Promise.all([
          fetch('http://localhost:5000/patientops/getallpatient').then(res => res.json()),
          fetch('http://localhost:5000/doctorops/getalldoctor').then(res => res.json()),
          fetch('http://localhost:5000/ops/getallrooms').then(res => res.json()),
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

  useEffect(() => {
    // Fetch lab reports if needed - adjust if you want to use patientemailid instead of UID
  }, [formData.patientemailid, formData.purpose]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'purpose') {
      setFormData(prev => ({
        ...prev,
        purpose: value,
        roomuid: '',
        medicine_charge: 0,
        lab_charge: 0,
        homecare_charge: 0,
        other_charges: 0,
        treatmenttype: value === 'Admission' ? prev.treatmenttype : '',
        treatmentduration: value === 'Admission' ? prev.treatmentduration : '',
        payment_method: value === 'Admission' ? admissionPaymentMethods[0] : 'cash',
      }));
    } else if (name === 'patientuid') {
      // When patient changes, find that patient's email and set in formData.patientemailid
      const selectedPatient = patients.find(p => p.uid === value);
      setFormData(prev => ({
        ...prev,
        patientemailid: selectedPatient ? selectedPatient.email : '',
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/billing/createbill', formData);
      alert('Bill created successfully!');
      setFormData({
        patientemailid: '',
        doctoruid: '',
        purpose: '',
        roomuid: '',
        treatmenttype: '',
        treatmentduration: '',
        medicine_charge: 0,
        lab_charge: 0,
        homecare_charge: 0,
        other_charges: 0,
        discount_percent: 0,
        insurance_provider: '',
        insurance_coverage_percent: 0,
        payment_method: 'cash',
        notes: '',
        created_by: 'admin',
      });
      setLabReports([]);
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to create bill. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  const showRoomAndCharges = formData.purpose === 'Admission';
  const showHomecareCharges = formData.purpose === 'Homecare';
  const showLabCharges = formData.purpose === 'Lab Test';
  const showTreatmentFields = formData.purpose === 'Admission';

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
              <label htmlFor="patientuid" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
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
                {patients.map((p) => (
                  <option key={p.uid} value={p.uid}>
                    {p.firstname} {p.lastname}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="doctoruid" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Doctor
              </label>
              <select
                id="doctoruid"
                name="doctoruid"
                value={formData.doctoruid}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d.uid} value={d.uid}>
                    {d.fullname}
                  </option>
                ))}
              </select>
            </div>

            {/* Purpose */}
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="purpose" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
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

            {/* Room selection for Admission */}
            {showRoomAndCharges && (
              <div style={{ marginBottom: 15 }}>
                <label htmlFor="roomuid" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                  Room
                </label>
                <select
                  id="roomuid"
                  name="roomuid"
                  value={formData.roomuid}
                  onChange={handleChange}
                  required={showRoomAndCharges}
                  style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                >
                  <option value="">Select Room</option>
                  {rooms.map((r) => (
                    <option key={r.uid} value={r.uid}>
                      {r.room_number} - {r.room_type}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Treatment Type and Duration only for Admission */}
            {showTreatmentFields && (
              <>
                <div style={{ marginBottom: 15 }}>
                  <label htmlFor="treatmenttype" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
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
                  <label htmlFor="treatmentduration" style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                    Treatment Duration
                  </label>
                  <input
                    id="treatmentduration"
                    name="treatmentduration"
                    type="text"
                    value={formData.treatmentduration}
                    onChange={handleChange}
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </div>
              </>
            )}

            {/* Charges and other fields - omitted here for brevity; use your original code for them */}

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
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
