
// import React, { useState } from 'react';
// import { Button, Table, Modal, Form, Row, Col } from 'react-bootstrap';
// import AdminNavbar from '../Adminnavbar/AdminNavbar';
// import AdminSidebar from '../Adminsidebar/AdminSidebar';
// import { FaHeartbeat, FaBrain, FaStethoscope, FaSyringe, FaUserMd } from 'react-icons/fa'; // Updated icons for departments
// import './ManageDoctor.css';

// // Sample data for the doctors and patients
// const departments = [
//   {
//     name: 'Cardiology',
//     icon: <FaHeartbeat size={40} />,
//     doctors: [
//       {
//         id: 1,
//         name: 'Dr. John Doe',
//         specialization: 'Cardiologist',
//         department: 'Cardiology',
//         contact: '+1234567890',
//         availability: 'Mon-Fri, 9 AM - 5 PM',
//         profilePicture: 'https://via.placeholder.com/150',
//         performance: 'Good',
//         certifications: 'Cardiology Board Certified',
//         payment: '$3000',
//         leaveStatus: 'No Leave Pending',
//         patients: ['Patient 1', 'Patient 2', 'Patient 3']
//       }
//     ]
//   },
//   {
//     name: 'Neurology',
//     icon: <FaBrain size={40} />,
//     doctors: [
//       {
//         id: 2,
//         name: 'Dr. Jane Smith',
//         specialization: 'Neurologist',
//         department: 'Neurology',
//         contact: '+9876543210',
//         availability: 'Mon-Wed, 10 AM - 4 PM',
//         profilePicture: 'https://via.placeholder.com/150',
//         performance: 'Excellent',
//         certifications: 'Neurology Board Certified',
//         payment: '$2500',
//         leaveStatus: 'Pending Leave Approval',
//         patients: ['Patient A', 'Patient B']
//       }
//     ]
//   },
//   {
//     name: 'Pediatrics',
//     icon: <FaStethoscope size={40} />,
//     doctors: [
//       {
//         id: 3,
//         name: 'Dr. Lily Turner',
//         specialization: 'Pediatrician',
//         department: 'Pediatrics',
//         contact: '+1122334455',
//         availability: 'Tue-Thu, 9 AM - 3 PM',
//         profilePicture: 'https://via.placeholder.com/150',
//         performance: 'Excellent',
//         certifications: 'Pediatrics Board Certified',
//         payment: '$2200',
//         leaveStatus: 'No Leave Pending',
//         patients: ['Child 1', 'Child 2']
//       }
//     ]
//   },
//   {
//     name: 'Infectious Diseases',
//     icon: <FaSyringe size={40} />,
//     doctors: [
//       {
//         id: 4,
//         name: 'Dr. Sampson Will',
//         specialization: 'Infectious Disease Specialist',
//         department: 'Infectious Diseases',
//         contact: '+2233445566',
//         availability: 'Mon-Fri, 10 AM - 6 PM',
//         profilePicture: 'https://via.placeholder.com/150',
//         performance: 'Good',
//         certifications: 'Infectious Disease Board Certified',
//         payment: '$2900',
//         leaveStatus: 'Leave Approved',
//         patients: ['Patient X', 'Patient Y']
//       }
//     ]
//   },
//   // Added more departments
//   {
//     name: 'Orthopedics',
//     icon: <FaUserMd size={40} />,
//     doctors: []
//   }
// ];

// const ManageDoctors = () => {
//   const [selectedDepartment, setSelectedDepartment] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [newDoctor, setNewDoctor] = useState({
//     name: '',
//     specialization: '',
//     department: '',
//     contact: '',
//     availability: '',
//     profilePicture: '',
//     performance: '',
//     certifications: '',
//     payment: '',
//     leaveStatus: '',
//     patients: []
//   });

//   const handleShowModal = () => setShowModal(true);
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedDoctor(null);
//   };

//   const handleRegisterDoctor = (e) => {
//     e.preventDefault();
//     const doctorData = {
//       ...newDoctor,
//       id: selectedDepartment.doctors.length + 1
//     };

//     if (selectedDoctor) {
//       const updatedDoctors = selectedDepartment.doctors.map(doctor =>
//         doctor.id === selectedDoctor.id ? selectedDoctor : doctor
//       );
//       selectedDepartment.doctors = updatedDoctors;
//     } else {
//       selectedDepartment.doctors.push(doctorData);
//     }

//     setNewDoctor({
//       name: '',
//       specialization: '',
//       department: '',
//       contact: '',
//       availability: '',
//       profilePicture: '',
//       performance: '',
//       certifications: '',
//       payment: '',
//       leaveStatus: '',
//       patients: []
//     });
//     setShowModal(false);
//     setSelectedDepartment({ ...selectedDepartment });
//   };

//   const handleEditDoctor = (doctor) => {
//     setSelectedDoctor(doctor);
//     setNewDoctor(doctor);
//     setShowModal(true);
//   };

//   const handleDepartmentClick = (department) => {
//     setSelectedDepartment(department);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (selectedDoctor) {
//       setSelectedDoctor({ ...selectedDoctor, [name]: value });
//     } else {
//       setNewDoctor({ ...newDoctor, [name]: value });
//     }
//   };

//   return (
//     <div className="manage-doctors-container">
//       <AdminNavbar />
//       <div className="manage-doctors-content">
//         <AdminSidebar />
//         <div className="manage-doctors-main-container">
//           <h2>Manage Doctors</h2>

//           {/* Department Icons Section */}
//           <div className="department-icons-section">
//             {departments.map((department) => (
//               <div
//                 key={department.name}
//                 className="department-icon-item"
//                 onClick={() => handleDepartmentClick(department)}
//               >
//                 <div 
//                   className="department-icon-wrapper" 
//                   style={{ 
//                     color: department.name === 'Cardiology' ? '#FF0000' : 
//                            department.name === 'Neurology' ? '#0000FF' : 
//                            department.name === 'Pediatrics' ? '#FF9900' : 
//                            department.name === 'Infectious Diseases' ? '#32CD32' : 
//                            department.name === 'Orthopedics' ? '#8A2BE2' : '#000000' 
//                   }}
//                 >
//                   {department.icon}
//                 </div>
//                 <h4>{department.name}</h4>
//               </div>
//             ))}
//           </div>

//           {selectedDepartment && (
//             <>
//               <h3 
//                 className="department-heading" 
//                 style={{ marginLeft: '40px', fontSize: '1.8rem', color: '#343a40', fontWeight: 'bold' }}
//               >
//                 {selectedDepartment.name} Doctors
//               </h3>

//               <Button 
//                 className="register-new-doctor-btn" 
//                 variant="primary" 
//                 onClick={handleShowModal} 
//                 style={{ 
//                   backgroundColor: '#007bff', 
//                   color: 'white', 
//                   padding: '12px 20px', 
//                   fontSize: '1.1rem', 
//                   fontWeight: 'bold', 
//                   borderRadius: '5px', 
//                   cursor: 'pointer', 
//                   border: 'none', 
//                   boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
//                   transition: 'all 0.3s ease-in-out' 
//                 }}
//               >
//                 Register New Doctor
//               </Button>

//               {/* Doctors Table */}
//               <Table striped bordered hover className="doctors-table mt-4">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Specialization</th>
//                     <th>Contact</th>
//                     <th>Availability</th>
//                     <th>Leave Status</th>
//                     <th>Patients</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {selectedDepartment.doctors.map((doctor) => (
//                     <tr key={doctor.id}>
//                       <td>{doctor.name}</td>
//                       <td>{doctor.specialization}</td>
//                       <td>{doctor.contact}</td>
//                       <td>{doctor.availability}</td>
//                       <td>{doctor.leaveStatus}</td>
//                       <td>{doctor.patients.join(', ')}</td>
//                       <td>
//                         <Button variant="info" onClick={() => handleEditDoctor(doctor)}>
//                           Edit
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </>
//           )}

//           {/* Modal for Registering or Editing Doctor */}
//           <Modal show={showModal} onHide={handleCloseModal}>
//             <Modal.Header closeButton>
//               <Modal.Title>{selectedDoctor ? 'Edit Doctor' : 'Register New Doctor'}</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <Form onSubmit={handleRegisterDoctor}>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group controlId="formName">
//                       <Form.Label>Name</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="name"
//                         value={selectedDoctor ? selectedDoctor.name : newDoctor.name}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId="formSpecialization">
//                       <Form.Label>Specialization</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="specialization"
//                         value={selectedDoctor ? selectedDoctor.specialization : newDoctor.specialization}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row>
//                   <Col md={6}>
//                     <Form.Group controlId="formContact">
//                       <Form.Label>Contact</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="contact"
//                         value={selectedDoctor ? selectedDoctor.contact : newDoctor.contact}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group controlId="formAvailability">
//                       <Form.Label>Availability</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="availability"
//                         value={selectedDoctor ? selectedDoctor.availability : newDoctor.availability}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Row>
//                   <Col md={6}>
//                     <Form.Group controlId="formPatients">
//                       <Form.Label>Patients</Form.Label>
//                       <Form.Control
//                         type="text"
//                         name="patients"
//                         value={selectedDoctor ? selectedDoctor.patients.join(', ') : newDoctor.patients.join(', ')}
//                         onChange={handleChange}
//                         required
//                       />
//                     </Form.Group>
//                   </Col>
//                 </Row>

//                 <Button variant="primary" type="submit">
//                   {selectedDoctor ? 'Update Doctor' : 'Register Doctor'}
//                 </Button>
//               </Form>
//             </Modal.Body>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageDoctors;

import React, { useState } from 'react';
import { Button, Table, Modal, Form, Row, Col } from 'react-bootstrap';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { FaHeartbeat, FaBrain, FaStethoscope, FaSyringe, FaUserMd } from 'react-icons/fa'; // Updated icons for departments
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './ManageDoctor.css';

// Sample data for the doctors and patients
const departments = [
  {
    name: 'Cardiology',
    icon: <FaHeartbeat size={40} />,
    doctors: [
      {
        id: 1,
        name: 'Dr. John Doe',
        specialization: 'Cardiologist',
        department: 'Cardiology',
        contact: '+1234567890',
        availability: 'Mon-Fri, 9 AM - 5 PM',
        profilePicture: 'https://via.placeholder.com/150',
        performance: 'Good',
        certifications: 'Cardiology Board Certified',
        payment: '$3000',
        leaveStatus: 'No Leave Pending',
        patients: ['Patient 1', 'Patient 2', 'Patient 3']
      }
    ]
  },
  {
    name: 'Neurology',
    icon: <FaBrain size={40} />,
    doctors: [
      {
        id: 2,
        name: 'Dr. Jane Smith',
        specialization: 'Neurologist',
        department: 'Neurology',
        contact: '+9876543210',
        availability: 'Mon-Wed, 10 AM - 4 PM',
        profilePicture: 'https://via.placeholder.com/150',
        performance: 'Excellent',
        certifications: 'Neurology Board Certified',
        payment: '$2500',
        leaveStatus: 'Pending Leave Approval',
        patients: ['Patient A', 'Patient B']
      }
    ]
  },
  {
    name: 'Pediatrics',
    icon: <FaStethoscope size={40} />,
    doctors: [
      {
        id: 3,
        name: 'Dr. Lily Turner',
        specialization: 'Pediatrician',
        department: 'Pediatrics',
        contact: '+1122334455',
        availability: 'Tue-Thu, 9 AM - 3 PM',
        profilePicture: 'https://via.placeholder.com/150',
        performance: 'Excellent',
        certifications: 'Pediatrics Board Certified',
        payment: '$2200',
        leaveStatus: 'No Leave Pending',
        patients: ['Child 1', 'Child 2']
      }
    ]
  },
  {
    name: 'Infectious Diseases',
    icon: <FaSyringe size={40} />,
    doctors: [
      {
        id: 4,
        name: 'Dr. Sampson Will',
        specialization: 'Infectious Disease Specialist',
        department: 'Infectious Diseases',
        contact: '+2233445566',
        availability: 'Mon-Fri, 10 AM - 6 PM',
        profilePicture: 'https://via.placeholder.com/150',
        performance: 'Good',
        certifications: 'Infectious Disease Board Certified',
        payment: '$2900',
        leaveStatus: 'Leave Approved',
        patients: ['Patient X', 'Patient Y']
      }
    ]
  },
  // Added more departments
  {
    name: 'Orthopedics',
    icon: <FaUserMd size={40} />,
    doctors: []
  }
];

const ManageDoctors = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    department: '',
    contact: '',
    availability: '',
    profilePicture: '',
    performance: '',
    certifications: '',
    payment: '',
    leaveStatus: '',
    patients: []
  });

  const navigate = useNavigate(); // Initialize the navigate hook

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  const handleRegisterDoctor = (e) => {
    e.preventDefault();
    const doctorData = {
      ...newDoctor,
      id: selectedDepartment.doctors.length + 1
    };

    if (selectedDoctor) {
      const updatedDoctors = selectedDepartment.doctors.map(doctor =>
        doctor.id === selectedDoctor.id ? selectedDoctor : doctor
      );
      selectedDepartment.doctors = updatedDoctors;
    } else {
      selectedDepartment.doctors.push(doctorData);
    }

    setNewDoctor({
      name: '',
      specialization: '',
      department: '',
      contact: '',
      availability: '',
      profilePicture: '',
      performance: '',
      certifications: '',
      payment: '',
      leaveStatus: '',
      patients: []
    });
    setShowModal(false);
    setSelectedDepartment({ ...selectedDepartment });
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setNewDoctor(doctor);
    setShowModal(true);
  };

  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (selectedDoctor) {
      setSelectedDoctor({ ...selectedDoctor, [name]: value });
    } else {
      setNewDoctor({ ...newDoctor, [name]: value });
    }
  };

  const handleRegisterNewDoctorRedirect = () => {
    // Redirect to the new doctor signup page
    navigate('/doctor-signup');  // Change '/doctor-signup' to the path of your doctor registration page
  };

  return (
    <div className="manage-doctors-container">
      <AdminNavbar />
      <div className="manage-doctors-content">
        <AdminSidebar />
        <div className="manage-doctors-main-container">
          <h2>Manage Doctors</h2>

          {/* Department Icons Section */}
          <div className="department-icons-section">
            {departments.map((department) => (
              <div
                key={department.name}
                className="department-icon-item"
                onClick={() => handleDepartmentClick(department)}
              >
                <div 
                  className="department-icon-wrapper" 
                  style={{ 
                    color: department.name === 'Cardiology' ? '#FF0000' : 
                           department.name === 'Neurology' ? '#0000FF' : 
                           department.name === 'Pediatrics' ? '#FF9900' : 
                           department.name === 'Infectious Diseases' ? '#32CD32' : 
                           department.name === 'Orthopedics' ? '#8A2BE2' : '#000000' 
                  }}
                >
                  {department.icon}
                </div>
                <h4>{department.name}</h4>
              </div>
            ))}
          </div>

          {selectedDepartment && (
            <>
              <h3 
                className="department-heading" 
                style={{ marginLeft: '40px', fontSize: '1.8rem', color: '#343a40', fontWeight: 'bold' }}
              >
                {selectedDepartment.name} Doctors
              </h3>

              <Button 
                className="register-new-doctor-btn" 
                variant="primary" 
                onClick={handleRegisterNewDoctorRedirect} 
                style={{ 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  padding: '12px 20px', 
                  fontSize: '1.1rem', 
                  fontWeight: 'bold', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  border: 'none', 
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', 
                  transition: 'all 0.3s ease-in-out' 
                }}
              >
                Register New Doctor
              </Button>

              {/* Doctors Table */}
              <Table striped bordered hover className="doctors-table mt-4">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Contact</th>
                    <th>Availability</th>
                    <th>Leave Status</th>
                    <th>Patients</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDepartment.doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialization}</td>
                      <td>{doctor.contact}</td>
                      <td>{doctor.availability}</td>
                      <td>{doctor.leaveStatus}</td>
                      <td>{doctor.patients.join(', ')}</td>
                      <td>
                        <Button variant="info" onClick={() => handleEditDoctor(doctor)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}

          {/* Modal for Registering or Editing Doctor */}
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedDoctor ? 'Edit Doctor' : 'Register New Doctor'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleRegisterDoctor}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={selectedDoctor ? selectedDoctor.name : newDoctor.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formSpecialization">
                      <Form.Label>Specialization</Form.Label>
                      <Form.Control
                        type="text"
                        name="specialization"
                        value={selectedDoctor ? selectedDoctor.specialization : newDoctor.specialization}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formContact">
                      <Form.Label>Contact</Form.Label>
                      <Form.Control
                        type="text"
                        name="contact"
                        value={selectedDoctor ? selectedDoctor.contact : newDoctor.contact}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formAvailability">
                      <Form.Label>Availability</Form.Label>
                      <Form.Control
                        type="text"
                        name="availability"
                        value={selectedDoctor ? selectedDoctor.availability : newDoctor.availability}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formPatients">
                      <Form.Label>Patients</Form.Label>
                      <Form.Control
                        type="text"
                        name="patients"
                        value={selectedDoctor ? selectedDoctor.patients.join(', ') : newDoctor.patients.join(', ')}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="primary" type="submit">
                  {selectedDoctor ? 'Update Doctor' : 'Register Doctor'}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
