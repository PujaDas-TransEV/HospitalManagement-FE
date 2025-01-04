// import React, { useState, useEffect } from 'react';
// import './ManagePatient.css';
// import AdminNavbar from '../Adminnavbar/AdminNavbar';
// import AdminSidebar from '../Adminsidebar/AdminSidebar';

// // Sample Data (will be replaced with data from the API)
// const departments = [
//   { name: 'Cardiology', icon: '❤️' },
//   { name: 'Neurology', icon: '🧠' },
//   { name: 'Orthopedics', icon: '🦴' },
//   { name: 'Dermatology', icon: '🌟' },
// ];

// const doctors = {
//   Cardiology: ['Dr. Smith', 'Dr. Johnson'],
//   Neurology: ['Dr. Adams', 'Dr. Lee'],
//   Orthopedics: ['Dr. Patel', 'Dr. Green'],
//   Dermatology: ['Dr. Brown', 'Dr. White'],
// };

// function PatientManagement() {
//   const [patients, setPatients] = useState([]);
//   const [newPatient, setNewPatient] = useState({
//     name: '',
//     gender: '',
//     dob: '',
//     phone: '',
//     email: '',
//     department: '',
//     doctor: '',
//     appointments: [],
//   });
//   const [editPatient, setEditPatient] = useState(null);
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [showAddPatientForm, setShowAddPatientForm] = useState(false); 

//   useEffect(() => {
//     // Fetch all patients on component mount
//     fetch('http://localhost:5000/patientops/getallpatient')
//       .then((response) => response.json())
//       .then((data) => {
//         setPatients(data); // assuming the response is an array of patient objects
//       })
//       .catch((error) => console.error('Error fetching patients:', error));
//   }, []);

//   // Handle input changes for new patient or edits
//   const handleInputChange = (e, field) => {
//     if (editPatient) {
//       setEditPatient((prev) => ({
//         ...prev,
//         [field]: e.target.value,
//       }));
//     } else {
//       setNewPatient((prev) => ({
//         ...prev,
//         [field]: e.target.value,
//       }));
//     }
//   };

//   // Handle department change and update doctors
//   const handleDepartmentChange = (e) => {
//     const selectedDepartment = e.target.value;
//     if (editPatient) {
//       setEditPatient((prev) => ({
//         ...prev,
//         department: selectedDepartment,
//         doctor: doctors[selectedDepartment][0], 
//       }));
//     } else {
//       setNewPatient((prev) => ({
//         ...prev,
//         department: selectedDepartment,
//         doctor: doctors[selectedDepartment][0],
//       }));
//     }
//   };

//   // Add new patient
//   const addPatient = () => {
//     fetch('http://localhost:5000/patientops/addpatient', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newPatient),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setPatients([...patients, data]); 
//         setNewPatient({
//           name: '',
//           gender: '',
//           dob: '',
//           phone: '',
//           email: '',
//           department: '',
//           doctor: '',
//           appointments: [],
//         });
//         setShowAddPatientForm(false); 
//       })
//       .catch((error) => console.error('Error adding patient:', error));
//   };

//   // Edit an existing patient
//   const editPatientDetails = (patient) => {
//     setEditPatient(patient);
//   };

//   // Save edited patient
//   const savePatient = () => {
//     fetch('http://localhost:5000/patientops/editpatient', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(editPatient),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setPatients(
//           patients.map((patient) =>
//             patient.id === editPatient.id ? data : patient
//           )
//         );
//         setEditPatient(null);
//       })
//       .catch((error) => console.error('Error saving patient:', error));
//   };

//   // Delete a patient
//   const deletePatient = (id) => {
//     fetch('http://localhost:5000/patientops/deleteprofileusing', {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ id }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setPatients(patients.filter((patient) => patient.id !== id));
//       })
//       .catch((error) => console.error('Error deleting patient:', error));
//   };

//   // Filter patients based on the selected department
//   const filteredPatients = selectedDepartment
//     ? patients.filter((patient) => patient.department === selectedDepartment)
//     : patients;

//   return (
//     <div className="manage-doctors-container">
//       <AdminNavbar />
//       <div className="manage-doctors-content">
//         <AdminSidebar />
//         <div className="patient-management">
//           <h2>Admin - Manage Patients</h2>

//           {/* Display Departments with Icons */}
//           <div className="departments">
//             {departments.map((dept) => (
//               <div 
//                 key={dept.name} 
//                 className="department-item" 
//                 onClick={() => setSelectedDepartment(dept.name)}
//               >
//                 <div className="icon">{dept.icon}</div>
//                 <div className="name">{dept.name}</div>
//               </div>
//             ))}
//           </div>

//           {/* Manage Patients by Department */}
//           <h3>{selectedDepartment ? `${selectedDepartment} Patients` : 'Manage All Patients'}</h3>
//           <div className="patient-list">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Department</th>
//                   <th>Doctor</th>
//                   <th>Phone</th>
//                   <th>Email</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredPatients.map((patient) => (
//                   <tr key={patient.id}>
//                     <td>{patient.name}</td>
//                     <td>{patient.department}</td>
//                     <td>{patient.doctor}</td>
//                     <td>{patient.phone}</td>
//                     <td>{patient.email}</td>
//                     <td>
//                       <button onClick={() => editPatientDetails(patient)}>Edit</button>
//                       <button onClick={() => deletePatient(patient.id)}>Delete</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Add New Patient Button */}
//           <button onClick={() => setShowAddPatientForm(!showAddPatientForm)}>
//             {showAddPatientForm ? 'Cancel' : 'Add New Patient'}
//           </button>

//           {/* Add New Patient Form */}
//           {showAddPatientForm && (
//             <div>
//               <h3>Add New Patient</h3>
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={newPatient.firstname}
//                 onChange={(e) => handleInputChange(e, 'firstname')}
//               />
//               <input
//                 type="text"
//                 placeholder="Gender"
//                 value={newPatient.gender}
//                 onChange={(e) => handleInputChange(e, 'gender')}
//               />
//               <input
//                 type="date"
//                 placeholder="Date of Birth"
//                 value={newPatient.dob}
//                 onChange={(e) => handleInputChange(e, 'dob')}
//               />
//               <input
//                 type="text"
//                 placeholder="Phone"
//                 value={newPatient.phone}
//                 onChange={(e) => handleInputChange(e, 'phone')}
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={newPatient.email}
//                 onChange={(e) => handleInputChange(e, 'email')}
//               />
//               <select value={newPatient.department} onChange={handleDepartmentChange}>
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => (
//                   <option key={dept.name} value={dept.name}>
//                     {dept.icon} {dept.name}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={newPatient.doctor}
//                 onChange={(e) => handleInputChange(e, 'doctor')}
//               >
//                 {newPatient.department &&
//                   doctors[newPatient.department].map((doctor) => (
//                     <option key={doctor} value={doctor}>
//                       {doctor}
//                     </option>
//                   ))}
//               </select>
//               <button onClick={addPatient}>Add Patient</button>
//             </div>
//           )}

//           {/* Edit Patient */}
//           {editPatient && (
//             <div>
//               <h3>Edit Patient</h3>
//               <input
//                 type="text"
//                 value={editPatient.name}
//                 onChange={(e) => handleInputChange(e, 'name')}
//               />
//               <input
//                 type="text"
//                 value={editPatient.gender}
//                 onChange={(e) => handleInputChange(e, 'gender')}
//               />
//               <input
//                 type="date"
//                 value={editPatient.dob}
//                 onChange={(e) => handleInputChange(e, 'dob')}
//               />
//               <input
//                 type="text"
//                 value={editPatient.phone}
//                 onChange={(e) => handleInputChange(e, 'phone')}
//               />
//               <input
//                 type="email"
//                 value={editPatient.email}
//                 onChange={(e) => handleInputChange(e, 'email')}
//               />
//               <select value={editPatient.department} onChange={handleDepartmentChange}>
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => (
//                   <option key={dept.name} value={dept.name}>
//                     {dept.icon} {dept.name}
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={editPatient.doctor}
//                 onChange={(e) => handleInputChange(e, 'doctor')}
//               >
//                 {editPatient.department &&
//                   doctors[editPatient.department].map((doctor) => (
//                     <option key={doctor} value={doctor}>
//                       {doctor}
//                     </option>
//                   ))}
//               </select>
//               <button onClick={savePatient}>Save Changes</button>
//               <button onClick={() => setEditPatient(null)}>Cancel</button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PatientManagement;
import React, { useState, useEffect } from 'react';
import './ManagePatient.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

// Sample Data (will be replaced with data from the API)
const departments = [
  { name: 'Cardiology', icon: '❤️' },
  { name: 'Neurology', icon: '🧠' },
  { name: 'Orthopedics', icon: '🦴' },
  { name: 'Dermatology', icon: '🌟' },
];

const doctors = {
  Cardiology: ['Dr. Smith', 'Dr. Johnson'],
  Neurology: ['Dr. Adams', 'Dr. Lee'],
  Orthopedics: ['Dr. Patel', 'Dr. Green'],
  Dermatology: ['Dr. Brown', 'Dr. White'],
};

function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    department: '',
    doctor: '',
    address: '',
    age: '',
    bloodgroup: '',
    height: '',
    weight: '',
    appointments: [],
  });
  const [editPatient, setEditPatient] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);

  useEffect(() => {
    // Fetch all patients on component mount
    fetch('http://localhost:5000/patientops/getallpatient')
      .then((response) => response.json())
      .then((data) => {
        setPatients(data); // assuming the response is an array of patient objects
      })
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

  // Handle input changes for new patient or edits
  const handleInputChange = (e, field) => {
    if (editPatient) {
      setEditPatient((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    } else {
      setNewPatient((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    }
  };

  // Handle department change and update doctors
  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    if (editPatient) {
      setEditPatient((prev) => ({
        ...prev,
        department: selectedDepartment,
        doctor: doctors[selectedDepartment][0],
      }));
    } else {
      setNewPatient((prev) => ({
        ...prev,
        department: selectedDepartment,
        doctor: doctors[selectedDepartment][0],
      }));
    }
  };

  // Add new patient
  const addPatient = () => {
    fetch('http://localhost:5000/patientops/addpatient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPatient),
    })
      .then((response) => response.json())
      .then((data) => {
        setPatients([...patients, data]);
        setNewPatient({
          firstname: '',
          lastname: '',
          gender: '',
          dob: '',
          phone: '',
          email: '',
          department: '',
          doctor: '',
          address: '',
          age: '',
          bloodgroup: '',
          height: '',
          weight: '',
          appointments: [],
        });
        setShowAddPatientForm(false);
      })
      .catch((error) => console.error('Error adding patient:', error));
  };

  // Edit an existing patient
  const editPatientDetails = (patient) => {
    setEditPatient(patient);
  };

  // Save edited patient
  const savePatient = () => {
    fetch('http://localhost:5000/patientops/editpatient', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editPatient),
    })
      .then((response) => response.json())
      .then((data) => {
        setPatients(
          patients.map((patient) =>
            patient.id === editPatient.id ? data : patient
          )
        );
        setEditPatient(null);
      })
      .catch((error) => console.error('Error saving patient:', error));
  };

  // Delete a patient
  const deletePatient = (id) => {
    fetch('http://localhost:5000/patientops/deleteprofileusing', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setPatients(patients.filter((patient) => patient.id !== id));
      })
      .catch((error) => console.error('Error deleting patient:', error));
  };

  // Filter patients based on the selected department
  const filteredPatients = selectedDepartment
    ? patients.filter((patient) => patient.department === selectedDepartment)
    : patients;

  return (
    <div className="manage-doctors-container">
      <AdminNavbar />
      <div className="manage-doctors-content">
        <AdminSidebar />
        <div className="patient-management">
          <h2>Admin - Manage Patients</h2>

          {/* Display Departments with Icons */}
          <div className="departments">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="department-item"
                onClick={() => setSelectedDepartment(dept.name)}
              >
                <div className="icon">{dept.icon}</div>
                <div className="name">{dept.name}</div>
              </div>
            ))}
          </div>

          {/* Manage Patients by Department */}
          <h3>{selectedDepartment ? `${selectedDepartment} Patients` : 'Manage All Patients'}</h3>
          <div className="patient-list">
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Age</th>
                  <th>Blood Group</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.firstname}</td>
                    <td>{patient.lastname}</td>
                    <td>{patient.age}</td>
                    <td>{patient.bloodgroup}</td>
                    <td>{patient.address}</td>
                    <td>{patient.phonenumber}</td>
                    <td>{patient.email}</td>
                    <td>
                      <button onClick={() => editPatientDetails(patient)}>Edit</button>
                      <button onClick={() => deletePatient(patient.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add New Patient Button */}
          <button onClick={() => setShowAddPatientForm(!showAddPatientForm)}>
            {showAddPatientForm ? 'Cancel' : 'Add New Patient'}
          </button>

          {/* Add New Patient Form */}
          {showAddPatientForm && (
            <div>
              <h3>Add New Patient</h3>
              <input
                type="text"
                placeholder="First Name"
                value={newPatient.firstname}
                onChange={(e) => handleInputChange(e, 'firstname')}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newPatient.lastname}
                onChange={(e) => handleInputChange(e, 'lastname')}
              />
              <input
                type="text"
                placeholder="Gender"
                value={newPatient.gender}
                onChange={(e) => handleInputChange(e, 'gender')}
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={newPatient.dob}
                onChange={(e) => handleInputChange(e, 'dob')}
              />
              <input
                type="text"
                placeholder="Phone"
                value={newPatient.phone}
                onChange={(e) => handleInputChange(e, 'phone')}
              />
              <input
                type="email"
                placeholder="Email"
                value={newPatient.email}
                onChange={(e) => handleInputChange(e, 'email')}
              />
              <input
                type="text"
                placeholder="Address"
                value={newPatient.address}
                onChange={(e) => handleInputChange(e, 'address')}
              />
              <input
                type="number"
                placeholder="Age"
                value={newPatient.age}
                onChange={(e) => handleInputChange(e, 'age')}
              />
              <input
                type="text"
                placeholder="Blood Group"
                value={newPatient.bloodgroup}
                onChange={(e) => handleInputChange(e, 'bloodgroup')}
              />
              <input
                type="text"
                placeholder="Height"
                value={newPatient.height}
                onChange={(e) => handleInputChange(e, 'height')}
              />
              <input
                type="text"
                placeholder="Weight"
                value={newPatient.weight}
                onChange={(e) => handleInputChange(e, 'weight')}
              />
              <select value={newPatient.department} onChange={handleDepartmentChange}>
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.name} value={dept.name}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
              <select
                value={newPatient.doctor}
                onChange={(e) => handleInputChange(e, 'doctor')}
              >
                {newPatient.department &&
                  doctors[newPatient.department].map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
              </select>
              <button onClick={addPatient}>Add Patient</button>
            </div>
          )}

          {/* Edit Patient */}
          {editPatient && (
            <div>
              <h3>Edit Patient</h3>
              <input
                type="text"
                value={editPatient.firstname}
                onChange={(e) => handleInputChange(e, 'firstname')}
              />
              <input
                type="text"
                value={editPatient.lastname}
                onChange={(e) => handleInputChange(e, 'lastname')}
              />
              <input
                type="text"
                value={editPatient.gender}
                onChange={(e) => handleInputChange(e, 'gender')}
              />
              <input
                type="date"
                value={editPatient.dob}
                onChange={(e) => handleInputChange(e, 'dob')}
              />
              <input
                type="text"
                value={editPatient.phone}
                onChange={(e) => handleInputChange(e, 'phone')}
              />
              <input
                type="email"
                value={editPatient.email}
                onChange={(e) => handleInputChange(e, 'email')}
              />
              <input
                type="text"
                value={editPatient.address}
                onChange={(e) => handleInputChange(e, 'address')}
              />
              <input
                type="number"
                value={editPatient.age}
                onChange={(e) => handleInputChange(e, 'age')}
              />
              <input
                type="text"
                value={editPatient.bloodgroup}
                onChange={(e) => handleInputChange(e, 'bloodgroup')}
              />
              <input
                type="text"
                value={editPatient.height}
                onChange={(e) => handleInputChange(e, 'height')}
              />
              <input
                type="text"
                value={editPatient.weight}
                onChange={(e) => handleInputChange(e, 'weight')}
              />
              <select value={editPatient.department} onChange={handleDepartmentChange}>
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.name} value={dept.name}>
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
              <select
                value={editPatient.doctor}
                onChange={(e) => handleInputChange(e, 'doctor')}
              >
                {editPatient.department &&
                  doctors[editPatient.department].map((doctor) => (
                    <option key={doctor} value={doctor}>
                      {doctor}
                    </option>
                  ))}
              </select>
              <button onClick={savePatient}>Save Changes</button>
              <button onClick={() => setEditPatient(null)}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientManagement;
