import React, { useState } from 'react';
import './DoctorEmergency.css';
import DoctorSidebar from "../DoctorSidebar/Doctorsidebar";
import backgroundImage from "../../Assests/background.jpg";
import DoctorNavbar from "../DoctorNavbar/DoctorNAvbar";

// Dummy patient data
const dummyPatients = [
  {
    id: 1,
    name: 'Riya Sen',
    age: 28,
    caseType: 'Accident',
    triage: 'Red',
    arrival: '2 min ago',
    vitals: { bp: '80/60', spo2: '86%', hr: 120 },
    status: 'Critical',
  },
  {
    id: 2,
    name: 'Amir Khan',
    age: 65,
    caseType: 'Cardiac Arrest',
    triage: 'Red',
    arrival: '7 min ago',
    vitals: { bp: '90/60', spo2: '82%', hr: 110 },
    status: 'Critical',
  },
  {
    id: 3,
    name: 'Kavita Roy',
    age: 44,
    caseType: 'Seizure',
    triage: 'Yellow',
    arrival: '10 min ago',
    vitals: { bp: '110/70', spo2: '96%', hr: 80 },
    status: 'Urgent',
  },
  {
    id: 4,
    name: 'Rahul Das',
    age: 34,
    caseType: 'Burn Injury',
    triage: 'Red',
    arrival: '5 min ago',
    vitals: { bp: '95/65', spo2: '89%', hr: 115 },
    status: 'Critical',
  }
];

// Dummy specialist doctor list
const specialistDoctors = [
  { id: 101, name: 'Dr. Meera Singh (Cardiologist)' },
  { id: 102, name: 'Dr. Arjun Das (Neurosurgeon)' },
  { id: 103, name: 'Dr. Nisha Roy (Orthopedic)' },
];

const EmergencyDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showReferralPopup, setShowReferralPopup] = useState(false);
  const [referredDoctor, setReferredDoctor] = useState(null);

  const handleReferDoctor = (doctor) => {
    setReferredDoctor(doctor);
    alert(`✅ Referred ${selectedPatient.name} to ${doctor.name}`);
    setShowReferralPopup(false);
  };

  return (
    <div
      className="dashboard-container-emergency"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <DoctorNavbar />
      <div className="dashboard-content-emergency">
        <DoctorSidebar />
        <h2>🩺 Doctor Emergency Dashboard</h2>

        <table className="patients-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Age</th>
              <th>Case</th>
              <th>Triage</th>
              <th>Arrival</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyPatients.map((patient, index) => (
              <tr key={patient.id}>
                <td>{index + 1}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.caseType}</td>
                <td>
                  <span className={`triage ${patient.triage.toLowerCase()}`}>
                    {patient.triage}
                  </span>
                </td>
                <td>{patient.arrival}</td>
                <td>
                  <button onClick={() => setSelectedPatient(patient)}>🩺 Treat</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedPatient && (
          <div className="popup-overlay">
            <div className="popup">
              <h3>👁‍🗨 Treating {selectedPatient.name}</h3>
              <p><strong>Status:</strong> {selectedPatient.status}</p>
              <p><strong>Case:</strong> {selectedPatient.caseType}</p>
              <p><strong>Vitals:</strong> BP {selectedPatient.vitals.bp}, SpO2 {selectedPatient.vitals.spo2}, HR {selectedPatient.vitals.hr}</p>
              <div className="actions">
                <button>🧾 Prescribe Meds</button>
                <button>📥 Request CT</button>
                <button onClick={() => setShowReferralPopup(true)}>📡 Call Specialist</button>
                <button>🛏 ICU Transfer</button>
                <button onClick={() => setSelectedPatient(null)}>❌ Close</button>
              </div>

              {showReferralPopup && (
                <div className="referral-popup">
                  <h4>📡 Refer to Specialist</h4>
                  {specialistDoctors.map(doc => (
                    <button
                      key={doc.id}
                      className="refer-button"
                      onClick={() => handleReferDoctor(doc)}
                    >
                      {doc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyDashboard;
