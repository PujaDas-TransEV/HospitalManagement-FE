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
    if (!editPatient || !editPatient.uid) {
      console.error('Patient details or UID are missing!');
      alert('Patient details or UID are missing!');
      return;
    }

    const formData = new FormData();
    formData.append('patientid', editPatient.uid);
    formData.append('firstname', editPatient.firstname);
    formData.append('lastname', editPatient.lastname);
    formData.append('bloodgroup', editPatient.bloodgroup);
    formData.append('age', editPatient.age);
    formData.append('weight', editPatient.weight);
    formData.append('height', editPatient.height);
    formData.append('gender', editPatient.gender);
    formData.append('dob', editPatient.dob);
    formData.append('phonenumber', editPatient.phone);
    formData.append('address', editPatient.address);
    formData.append('email', editPatient.email);

    // Send the update request to the backend
    fetch('http://localhost:5000/patients/profile/update', {
      method: 'POST',
      body: formData, // Send the form data as the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // Successfully updated the patient, update the local state
          setPatients(
            patients.map((patient) =>
              patient.id === editPatient.id ? { ...patient, ...data } : patient
            )
          );
          setEditPatient(null); // Close the edit form
          alert('Patient profile updated successfully');
        } else {
          alert('Error updating patient profile');
        }
      })
      .catch((error) => {
        console.error('Error updating patient:', error);
        alert('An error occurred while updating the patient');
      });
  };

  // Delete patient function
  const deletePatient = (uid) => {
    if (!uid) {
      console.error('Patient UID is missing!');
      alert('Patient UID is missing!');
      return;
    }

    const formData = new FormData();
    formData.append('patientid', uid); // Append the patient UID to the form data

    // Send the delete request to the backend
    fetch('http://localhost:5000/patientops/deleteprofile', {
      method: 'POST',
      body: formData, // Send the form data as the request body
    })
      .then((response) => response.json()) // Parse the JSON response from the backend
      .then((data) => {
        if (data) {
          // Successfully deleted patient, update the local state
          setPatients((prevPatients) =>
            prevPatients.filter((patient) => patient.uid !== uid)
          );
          alert('Patient profile deleted successfully');
        } else {
          // If there was an issue with deletion on the backend, show an error message
          alert('Error deleting patient profile');
        }
      })
      .catch((error) => {
        // Catch any other errors, including network issues
        console.error('Error deleting patient:', error);
        alert('An error occurred while deleting the patient');
      });
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
                      <button onClick={() => deletePatient(patient.uid)}>Delete</button>
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

          {/* Edit Patient Form (for existing patients) */}
          {editPatient && (
            <div>
              <h3>Edit Patient</h3>
              <input
                type="text"
                placeholder="First Name"
                value={editPatient.firstname}
                onChange={(e) => handleInputChange(e, 'firstname')}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={editPatient.lastname}
                onChange={(e) => handleInputChange(e, 'lastname')}
              />
              <input
                type="text"
                placeholder="Gender"
                value={editPatient.gender}
                onChange={(e) => handleInputChange(e, 'gender')}
              />
              <input
                type="date"
                placeholder="Date of Birth"
                value={editPatient.dob}
                onChange={(e) => handleInputChange(e, 'dob')}
              />
              <input
                type="text"
                placeholder="Phone"
                value={editPatient.phone}
                onChange={(e) => handleInputChange(e, 'phone')}
              />
              <input
                type="email"
                placeholder="Email"
                value={editPatient.email}
                onChange={(e) => handleInputChange(e, 'email')}
              />
              <input
                type="text"
                placeholder="Address"
                value={editPatient.address}
                onChange={(e) => handleInputChange(e, 'address')}
              />
              <input
                type="number"
                placeholder="Age"
                value={editPatient.age}
                onChange={(e) => handleInputChange(e, 'age')}
              />
              <input
                type="text"
                placeholder="Blood Group"
                value={editPatient.bloodgroup}
                onChange={(e) => handleInputChange(e, 'bloodgroup')}
              />
              <input
                type="text"
                placeholder="Height"
                value={editPatient.height}
                onChange={(e) => handleInputChange(e, 'height')}
              />
              <input
                type="text"
                placeholder="Weight"
                value={editPatient.weight}
                onChange={(e) => handleInputChange(e, 'weight')}
              />
              <button onClick={savePatient}>Save Changes</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientManagement;
