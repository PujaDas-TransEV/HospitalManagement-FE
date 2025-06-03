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

  // const handleDepartmentChange = (e) => {
  //   const selectedDepartment = e.target.value;
  //   if (editPatient) {
  //     setEditPatient((prev) => ({
  //       ...prev,
  //       department: selectedDepartment,
  //       doctor: doctors[selectedDepartment][0],
  //     }));
  //   } else {
  //     setNewPatient((prev) => ({
  //       ...prev,
  //       department: selectedDepartment,
  //       doctor: doctors[selectedDepartment][0],
  //     }));
  //   }
  // };

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
const [departments, setDepartments] = useState([]);

useEffect(() => {
  fetch('http://localhost:5000/facilityops/getallfacility')
    .then((res) => res.json())
    .then((data) => {
      if (data && data.data) {
        const departmentsWithIcons = data.data.map((dept, index) => ({
          ...dept,
          id: dept.department_name.toLowerCase(),     // lowercase id
          name: dept.department_name,                 // display name
          icon: assignDepartmentIcon(dept.department_name, index), // icon
        }));
        setDepartments(departmentsWithIcons);
      }
    })
    .catch((err) => {
      console.error('Error fetching departments:', err);
    });
}, []);

const assignDepartmentIcon = (name, index) => {
  const iconMap = {
    Cardiology: '❤️',
    Neurology: '🧠',
    Orthopedics: '💪',
    Dermatology: '🧴',
    Pediatrics: '👶',
    Surgery: '🔪',
  };
  // Fallback icons if not in map
  const fallbackIcons = ['🏥', '🩺', '🔬', '💊', '📋', '🧬'];
  return iconMap[name] || fallbackIcons[index % fallbackIcons.length];
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

       <h3 className="responsive-heading">{selectedDepartment ? `${selectedDepartment} Patients` : 'Manage All Patients'}</h3> 
          <div className="patient-list">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Age</th>
                    <th>Gender</th>
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
                         <td>{patient.gender}</td>
                      <td>{patient.bloodgroup}</td>
                      <td>{patient.address}</td>
                      <td>{patient.phonenumber}</td>
                      <td>{patient.email}</td>
                      <td>
                        <Button variant="warning" onClick={() => editPatientDetails(patient)}>
                          Edit
                        </Button>
                        {editPatient && (
  <div className="edit-patient-modal">
    <h4>Edit Patient Details</h4>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        savePatient();
      }}
    >
      <label>
        First Name:
        <input
          type="text"
          value={editPatient.firstname}
          onChange={(e) => handleInputChange(e, 'firstname')}
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          value={editPatient.lastname}
          onChange={(e) => handleInputChange(e, 'lastname')}
          required
        />
      </label>
      <label>
        Gender:
        <select
          value={editPatient.gender}
          onChange={(e) => handleInputChange(e, 'gender')}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label>
        DOB:
        <input
          type="date"
          value={editPatient.dob}
          onChange={(e) => handleInputChange(e, 'dob')}
          required
        />
      </label>
      <label>
        Phone:
        <input
          type="tel"
          value={editPatient.phonenumber}
          onChange={(e) => handleInputChange(e, 'phone')}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={editPatient.email}
          onChange={(e) => handleInputChange(e, 'email')}
          required
        />
      </label>
      {/* <label>
        Department:
        <select
          value={editPatient.department}
          onChange={handleDepartmentChange}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.name} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </label>
       <label>
        Doctor:
        <select
          value={editPatient.doctor}
          onChange={(e) => handleInputChange(e, 'doctor')}
          required
        >
          {editPatient.department &&
            doctors[editPatient.department].map((doc) => (
              <option key={doc} value={doc}>
                {doc}
              </option>
            ))}
        </select>
      </label>  */}
      <label>
        Address:
        <input
          type="text"
          value={editPatient.address}
          onChange={(e) => handleInputChange(e, 'address')}
          required
        />
      </label>
      <label>
        Age:
        <input
          type="number"
          value={editPatient.age}
          onChange={(e) => handleInputChange(e, 'age')}
          required
        />
      </label>
      <label>
        Blood Group:
        <input
          type="text"
          value={editPatient.bloodgroup}
          onChange={(e) => handleInputChange(e, 'bloodgroup')}
          required
        />
      </label>
      <label>
        Height:
        <input
          type="number"
          value={editPatient.height}
          onChange={(e) => handleInputChange(e, 'height')}
          required
        />
      </label>
      <label>
        Weight:
        <input
          type="number"
          value={editPatient.weight}
          onChange={(e) => handleInputChange(e, 'weight')}
          required
        />
      </label>

      <div className="edit-form-buttons">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setEditPatient(null)}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

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
