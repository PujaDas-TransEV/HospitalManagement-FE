import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './ManagePatient.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { Table, Button } from 'react-bootstrap';

// Sample Data (will be replaced with data from the API)
const departments = [
  { name: 'Cardiology', icon: '❤️' },
  { name: 'Neurology', icon: '🧠' },
  { name: 'Orthopedics', icon: '🦴' },
  { name: 'Dermatology', icon: '🌟' },
  { name: 'Pediatrics', icon: '🌟' },
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

  const navigate = useNavigate(); // Set up the navigate hook

  useEffect(() => {
    // Fetch all patients on component mount
    fetch('http://localhost:5000/patientops/getallpatient')
      .then((response) => response.json())
      .then((data) => {
        setPatients(data); // assuming the response is an array of patient objects
      })
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

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

  const editPatientDetails = (patient) => {
    setEditPatient(patient);
  };

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

    fetch('http://localhost:5000/patients/profile/update', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setPatients(
            patients.map((patient) =>
              patient.id === editPatient.id ? { ...patient, ...data } : patient
            )
          );
          setEditPatient(null);
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

  const deletePatient = (uid) => {
    if (!uid) {
      console.error('Patient UID is missing!');
      alert('Patient UID is missing!');
      return;
    }

    const formData = new FormData();
    formData.append('patientid', uid);

    fetch('http://localhost:5000/patientops/deleteprofile', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setPatients((prevPatients) =>
            prevPatients.filter((patient) => patient.uid !== uid)
          );
          alert('Patient profile deleted successfully');
        } else {
          alert('Error deleting patient profile');
        }
      })
      .catch((error) => {
        console.error('Error deleting patient:', error);
        alert('An error occurred while deleting the patient');
      });
  };

  const filteredPatients = selectedDepartment
    ? patients.filter((patient) => patient.department === selectedDepartment)
    : patients;

  // Department click handler for navigation
  const handleDepartmentClick = (department) => {
    navigate(`/patients/${department}`); // Navigate to doctors page for the clicked department
  };

  return (
    <div className="manage-patients-container">
      <AdminNavbar />
      <div className="manage-patients-content">
        <AdminSidebar />
        <div className="patient-management">
          <h2>Admin - Manage Patients</h2>

          <div className="departments">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="department-item"
                onClick={() => handleDepartmentClick(dept.name)} // Handle department click
              >
                <div className="icon">{dept.icon}</div>
                <div className="name">{dept.name}</div>
              </div>
            ))}
          </div>

          <h3 style={{marginLeft:'150px'}}>{selectedDepartment ? `${selectedDepartment} Patients` : 'Manage All Patients'}</h3>
          <div className="patient-list">
            <Table striped bordered hover>
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
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="8">No patients found.</td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.uid}>
                      <td>{patient.firstname}</td>
                      <td>{patient.lastname}</td>
                      <td>{patient.age}</td>
                      <td>{patient.bloodgroup}</td>
                      <td>{patient.address}</td>
                      <td>{patient.phonenumber}</td>
                      <td>{patient.email}</td>
                      <td>
                        <Button variant="warning" onClick={() => editPatientDetails(patient)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => deletePatient(patient.uid)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

        

        
        </div>
      </div>
    </div>
  );
}

export default PatientManagement;
