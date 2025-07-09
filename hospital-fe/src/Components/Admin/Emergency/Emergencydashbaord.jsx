// import React, { useState, useEffect } from 'react';
// import './Emergencydashboard.css';

// const dummyPatients = [
//   {
//     id: 1,
//     patientName: "John Doe",
//     priority: "Critical",
//     arrival: new Date().toISOString(),
//     assignedDoctor: null,
//     treated: false,
//   },
//   {
//     id: 2,
//     patientName: "Jane Smith",
//     priority: "High",
//     arrival: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
//     assignedDoctor: null,
//     treated: false,
//   },
//   {
//     id: 3,
//     patientName: "Ali Hossain",
//     priority: "Medium",
//     arrival: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
//     assignedDoctor: null,
//     treated: false,
//   }
// ];

// const doctorList = [
//   "Dr. Sarah Khan",
//   "Dr. Raj Patel",
//   "Dr. Emily Carter",
//   "Dr. Omar Ali",
//   "Dr. Lisa Wong",
// ];

// const priorityOrder = {
//   Critical: 1,
//   High: 2,
//   Medium: 3,
// };

// const AdminEmergencyDashboard = () => {
//   const [emergencies, setEmergencies] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('priority'); // or 'arrival'

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [newPatientName, setNewPatientName] = useState('');
//   const [newPriority, setNewPriority] = useState('Medium');
//   const [newDoctor, setNewDoctor] = useState('');

//   useEffect(() => {
//     setEmergencies(dummyPatients);
//   }, []);

//   // Assign doctor to emergency patient from dashboard
//   const assignDoctor = (id) => {
//     const doctorName = prompt("Enter doctor's name to assign:");
//     if (!doctorName) return;

//     setEmergencies(prev =>
//       prev.map(p =>
//         p.id === id ? { ...p, assignedDoctor: doctorName } : p
//       )
//     );
//   };

//   // Mark emergency treated
//   const markTreated = (id) => {
//     if (!window.confirm("Mark this emergency case as treated?")) return;

//     setEmergencies(prev =>
//       prev.map(p =>
//         p.id === id ? { ...p, treated: true } : p
//       )
//     );
//   };

//   // Open modal for new patient admission
//   const openModal = () => {
//     setNewPatientName('');
//     setNewPriority('Medium');
//     setNewDoctor('');
//     setShowModal(true);
//   };

//   // Close modal
//   const closeModal = () => setShowModal(false);

//   // Submit new emergency patient admission
//   const handleNewAdmission = (e) => {
//     e.preventDefault();
//     if (!newPatientName.trim()) {
//       alert("Please enter patient name");
//       return;
//     }
//     if (!newDoctor) {
//       alert("Please assign a doctor");
//       return;
//     }

//     const newPatient = {
//       id: emergencies.length ? emergencies[emergencies.length - 1].id + 1 : 1,
//       patientName: newPatientName.trim(),
//       priority: newPriority,
//       arrival: new Date().toISOString(),
//       assignedDoctor: newDoctor,
//       treated: false,
//     };

//     setEmergencies(prev => [...prev, newPatient]);
//     closeModal();
//   };

//   // Filter and sort emergencies before rendering
//   const filteredEmergencies = emergencies
//     .filter(e =>
//       e.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       e.priority.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortBy === 'priority') {
//         return priorityOrder[a.priority] - priorityOrder[b.priority];
//       }
//       if (sortBy === 'arrival') {
//         return new Date(a.arrival) - new Date(b.arrival);
//       }
//       return 0;
//     });

//   // Count by priority
//   const countByPriority = (priority) =>
//     emergencies.filter(e => e.priority === priority && !e.treated).length;

//   return (
//     <div className="admin-emergency-page">
//       <h2>⛑ Emergency Admission Dashboard</h2>

//       <div className="controls">
//         <input
//           type="text"
//           placeholder="Search by patient or priority..."
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//         <select
//           value={sortBy}
//           onChange={e => setSortBy(e.target.value)}
//           className="sort-select"
//         >
//           <option value="priority">Sort by Priority</option>
//           <option value="arrival">Sort by Arrival Time</option>
//         </select>
//         <button className="new-admission-btn" onClick={openModal}>+ New Emergency Admission</button>
//       </div>

//       <div className="summary">
//         <span className="badge critical">Critical: {countByPriority('Critical')}</span>
//         <span className="badge high">High: {countByPriority('High')}</span>
//         <span className="badge medium">Medium: {countByPriority('Medium')}</span>
//       </div>

//       {filteredEmergencies.length === 0 ? (
//         <p>No emergencies found.</p>
//       ) : (
//         <div className="emergency-list">
//           {filteredEmergencies.map(e => (
//             <div
//               key={e.id}
//               className={`emergency-card priority-${e.priority.toLowerCase()} ${e.treated ? 'treated' : ''}`}
//             >
//               <div>
//                 <strong>{e.patientName}</strong><br />
//                 <small>Priority: <span className="badge">{e.priority}</span></small>
//               </div>
//               <div className="arrival-time">🕒 {new Date(e.arrival).toLocaleTimeString()}</div>
//               <div className="actions">
//                 {e.assignedDoctor ? (
//                   <span className="assigned-doctor">👨‍⚕️ {e.assignedDoctor}</span>
//                 ) : (
//                   <button onClick={() => assignDoctor(e.id)}>Assign Doctor</button>
//                 )}
//                 {!e.treated && (
//                   <button
//                     className="treated-btn"
//                     onClick={() => markTreated(e.id)}
//                   >
//                     Mark Treated
//                   </button>
//                 )}
//                 {e.treated && <span className="treated-label">Treated ✓</span>}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal for New Emergency Admission */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>New Emergency Admission</h3>
//             <form onSubmit={handleNewAdmission} className="admission-form">
//               <label>
//                 Patient Name:
//                 <input
//                   type="text"
//                   value={newPatientName}
//                   onChange={e => setNewPatientName(e.target.value)}
//                   required
//                   autoFocus
//                 />
//               </label>
//               <label>
//                 Priority:
//                 <select
//                   value={newPriority}
//                   onChange={e => setNewPriority(e.target.value)}
//                 >
//                   <option value="Critical">Critical</option>
//                   <option value="High">High</option>
//                   <option value="Medium">Medium</option>
//                 </select>
//               </label>
//               <label>
//                 Assign Doctor:
//                 <select
//                   value={newDoctor}
//                   onChange={e => setNewDoctor(e.target.value)}
//                   required
//                 >
//                   <option value="">-- Select Doctor --</option>
//                   {doctorList.map(doc => (
//                     <option key={doc} value={doc}>{doc}</option>
//                   ))}
//                 </select>
//               </label>

//               <div className="modal-buttons">
//                 <button type="submit" className="submit-btn">Admit Patient</button>
//                 <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminEmergencyDashboard;

import React, { useState, useEffect } from 'react';
import './Emergencydashboard.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
const dummyPatients = [
  {
    id: 1,
    patientName: "John Doe",
    priority: "Critical",
    arrival: new Date().toISOString(),
    assignedDoctor: null,
    assignedNurse: null,
    ward: null,
    room: null,
    bed: null,
    treated: false,
  },
  {
    id: 2,
    patientName: "Jane Smith",
    priority: "High",
    arrival: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    assignedDoctor: null,
    assignedNurse: null,
    ward: null,
    room: null,
    bed: null,
    treated: false,
  },
  {
    id: 3,
    patientName: "Ali Hossain",
    priority: "Medium",
    arrival: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    assignedDoctor: null,
    assignedNurse: null,
    ward: null,
    room: null,
    bed: null,
    treated: false,
  }
];

const doctorList = [
  "Dr. Sarah Khan",
  "Dr. Raj Patel",
  "Dr. Emily Carter",
  "Dr. Omar Ali",
  "Dr. Lisa Wong",
];

const nurseList = [
  "Nurse Fatima",
  "Nurse Anita",
  "Nurse Priya",
  "Nurse Kamal",
  "Nurse Rahim",
];

const wardList = [
  "Ward A",
  "Ward B",
  "Ward C",
  "Ward D",
];

const roomList = [
  "Room 101",
  "Room 102",
  "Room 201",
  "Room 202",
];

const bedList = [
  "Bed 1",
  "Bed 2",
  "Bed 3",
  "Bed 4",
];

const priorityOrder = {
  Critical: 1,
  High: 2,
  Medium: 3,
};

const AdminEmergencyDashboard = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority'); // or 'arrival'

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDoctor, setNewDoctor] = useState('');
  const [newNurse, setNewNurse] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newBed, setNewBed] = useState('');

  useEffect(() => {
    setEmergencies(dummyPatients);
  }, []);

  // Mark emergency treated
  const markTreated = (id) => {
    if (!window.confirm("Mark this emergency case as treated?")) return;

    setEmergencies(prev =>
      prev.map(p =>
        p.id === id ? { ...p, treated: true } : p
      )
    );
  };

  // Open modal for new patient admission
  const openModal = () => {
    setNewPatientName('');
    setNewPriority('Medium');
    setNewDoctor('');
    setNewNurse('');
    setNewWard('');
    setNewRoom('');
    setNewBed('');
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => setShowModal(false);

  // Submit new emergency patient admission
  const handleNewAdmission = (e) => {
    e.preventDefault();

    if (!newPatientName.trim()) {
      alert("Please enter patient name");
      return;
    }
    if (!newDoctor) {
      alert("Please assign a doctor");
      return;
    }
    if (!newNurse) {
      alert("Please assign a nurse");
      return;
    }
    if (!newWard) {
      alert("Please select ward");
      return;
    }
    if (!newRoom) {
      alert("Please select room");
      return;
    }
    if (!newBed) {
      alert("Please select bed");
      return;
    }

    const newPatient = {
      id: emergencies.length ? emergencies[emergencies.length - 1].id + 1 : 1,
      patientName: newPatientName.trim(),
      priority: newPriority,
      arrival: new Date().toISOString(),
      assignedDoctor: newDoctor,
      assignedNurse: newNurse,
      ward: newWard,
      room: newRoom,
      bed: newBed,
      treated: false,
    };

    setEmergencies(prev => [...prev, newPatient]);
    closeModal();
  };

  // Filter and sort emergencies before rendering
  const filteredEmergencies = emergencies
    .filter(e =>
      e.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.priority.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'priority') {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'arrival') {
        return new Date(a.arrival) - new Date(b.arrival);
      }
      return 0;
    });

  // Count by priority
  const countByPriority = (priority) =>
    emergencies.filter(e => e.priority === priority && !e.treated).length;

  return (
     <div className="feedback-page">
      <AdminNavbar />
      <div className="feedback-layout">
        <AdminSidebar />
    <div className="admin-emergency-page">
      <h2>⛑ Emergency Admission Dashboard</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by patient or priority..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="priority">Sort by Priority</option>
          <option value="arrival">Sort by Arrival Time</option>
        </select>
        <button className="new-admission-btn" onClick={openModal}>+ New Emergency Admission</button>
      </div>

      <div className="summary">
        <span className="badge critical">Critical: {countByPriority('Critical')}</span>
        <span className="badge high">High: {countByPriority('High')}</span>
        <span className="badge medium">Medium: {countByPriority('Medium')}</span>
      </div>

      {filteredEmergencies.length === 0 ? (
        <p>No emergencies found.</p>
      ) : (
        <div className="emergency-list">
          {filteredEmergencies.map(e => (
            <div
              key={e.id}
              className={`emergency-card priority-${e.priority.toLowerCase()} ${e.treated ? 'treated' : ''}`}
            >
              <div>
                <strong>{e.patientName}</strong><br />
                <small>Priority: <span className="badge">{e.priority}</span></small>
              </div>
              <div className="arrival-time">🕒 {new Date(e.arrival).toLocaleTimeString()}</div>
              <div className="assignments">
                <div>👨‍⚕️ Doctor: {e.assignedDoctor}</div>
                <div>👩‍⚕️ Nurse: {e.assignedNurse}</div>
                <div>🏥 Ward: {e.ward}</div>
                <div>🚪 Room: {e.room}</div>
                <div>🛏️ Bed: {e.bed}</div>
              </div>
              <div className="actions">
                {!e.treated && (
                  <button
                    className="treated-btn"
                    onClick={() => markTreated(e.id)}
                  >
                    Mark Treated
                  </button>
                )}
                {e.treated && <span className="treated-label">Treated ✓</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for New Emergency Admission */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>New Emergency Admission</h3>
            <form onSubmit={handleNewAdmission} className="admission-form">
              <label>
                Patient Name:
                <input
                  type="text"
                  value={newPatientName}
                  onChange={e => setNewPatientName(e.target.value)}
                  required
                  autoFocus
                />
              </label>
              <label>
                Priority:
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value)}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </label>
              <label>
                Assign Doctor:
                <select
                  value={newDoctor}
                  onChange={e => setNewDoctor(e.target.value)}
                  required
                >
                  <option value="">-- Select Doctor --</option>
                  {doctorList.map(doc => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </label>
              <label>
                Assign Nurse:
                <select
                  value={newNurse}
                  onChange={e => setNewNurse(e.target.value)}
                  required
                >
                  <option value="">-- Select Nurse --</option>
                  {nurseList.map(nurse => (
                    <option key={nurse} value={nurse}>{nurse}</option>
                  ))}
                </select>
              </label>
              <label>
                Ward:
                <select
                  value={newWard}
                  onChange={e => setNewWard(e.target.value)}
                  required
                >
                  <option value="">-- Select Ward --</option>
                  {wardList.map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
              </label>
              <label>
                Room:
                <select
                  value={newRoom}
                  onChange={e => setNewRoom(e.target.value)}
                  required
                >
                  <option value="">-- Select Room --</option>
                  {roomList.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </label>
              <label>
                Bed:
                <select
                  value={newBed}
                  onChange={e => setNewBed(e.target.value)}
                  required
                >
                  <option value="">-- Select Bed --</option>
                  {bedList.map(bed => (
                    <option key={bed} value={bed}>{bed}</option>
                  ))}
                </select>
              </label>

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">Admit Patient</button>
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default AdminEmergencyDashboard;
