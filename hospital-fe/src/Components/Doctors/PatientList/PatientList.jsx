import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { FaStethoscope } from 'react-icons/fa';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';
import { useNavigate } from 'react-router-dom';
import './PatientList.css';

const DoctorPatientListPage = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorid, setDoctorId] = useState(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showViewPrescriptionModal, setShowViewPrescriptionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [hospitalname, setHospitalName] = useState('');
  const [diagonistics, setDiagonistics] = useState('');
  const [dateandtime, setDateandTime] = useState('');
  const [prescription, setPrescription] = useState(null);

  // Fetch doctorId from access token
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid;
        setDoctorId(doctorId);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');
      }
    };

    fetchDoctorProfile();
  }, [navigate]);

  // Fetch patients when doctorId is available
  useEffect(() => {
    if (doctorid) {
      const formData = new FormData();
      formData.append('doctorid', doctorid);

      fetch('http://localhost:5000/patientview', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.patients) {
            setPatients(data.patients);
            setLoading(false);
          } else {
            setError('No patients found for this doctor.');
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching patients:', error);
          setError('An error occurred while fetching patients.');
          setLoading(false);
        });
    }
  }, [doctorid]);

  // Open the create prescription modal
  const handleCreatePrescriptionClick = (patient) => {
    setSelectedPatient(patient);
    setShowPrescriptionModal(true);
    setDateandTime(new Date(parseInt(patient.appointment_time)).toISOString().slice(0, 16)); // Set initial appointment time
  };

  // Open the view prescription modal
  const handleViewPrescriptionClick = async (patient) => {
    const formData = new FormData();
    formData.append('doctorid', doctorid);
    formData.append('patientid', patient.uid);

    try {
      const response = await fetch('http://localhost:5000/doctors/getprescribebypatientid', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.prescription) {
        setPrescription(result.prescription); // Store prescription details (base64 or file path)
        setShowViewPrescriptionModal(true); // Show prescription modal
      } else {
        alert(' prescription found for this patient.');
      }
    } catch (error) {
      console.error('Error fetching prescription:', error);
      alert('Error occurred while fetching prescription.');
    }
  };

  // Handle prescription form submission
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    const decodedToken = jwtDecode(accessToken);
    const doctorId = decodedToken.doctorid;

    const formData = new FormData();
    formData.append('hospitalname', hospitalname);
    formData.append('doctorid', doctorid);
    formData.append('patientid', selectedPatient.uid); // Patient ID from the selected patient
    formData.append('dateandtime', dateandtime); // Send as string
    formData.append('diagonistics', diagonistics);

    try {
      const response = await fetch('http://localhost:5000/createprescription', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert('Prescription created successfully!');
        setShowPrescriptionModal(false);
        // Optionally, you can refetch patient data here
      } else {
        alert(' creating prescription: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('Error occurred while creating prescription.');
    }
  };

  // Decode base64 string to display as image or PDF
  const decodeBase64 = (base64String) => {
    const binaryString = window.atob(base64String);
    const binaryData = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([binaryData], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  };

  return (
    <div className="dashboard-container">
      <DoctorNavbar />
      <div className="dashboard-content">
        <Doctorsidebar />
        <div className="doctor-patient-list-page-container">
          <h2>
            <FaStethoscope /> Patients List
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  <h3>Patients List</h3>
                </Col>
              </Row>

              <Table striped bordered hover style={{ width: '80%', margin: 'auto' }}>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Appointment Time</th>
                    <th>Specialization</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <tr key={patient.uid}>
                        <td>{patient.firstname} {patient.lastname}</td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.bloodgroup}</td>
                        <td>{patient.phonenumber}</td>
                        <td>{patient.email}</td>
                        <td>{new Date(parseInt(patient.appointment_time)).toLocaleString()}</td>
                        <td>{patient.doctorspecialization}</td>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => handleCreatePrescriptionClick(patient)}
                          >
                            Create Prescription
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleViewPrescriptionClick(patient)}
                            style={{ marginLeft: '10px' }}
                          >
                            View Prescription
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9">No patients available for this doctor.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </div>

      {/* Modal for creating prescription */}
      <Modal
        show={showPrescriptionModal}
        onHide={() => setShowPrescriptionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePrescriptionSubmit}>
            <Form.Group controlId="hospitalName">
              <Form.Label>Hospital Name</Form.Label>
              <Form.Control
                type="text"
                value={hospitalname}
                onChange={(e) => setHospitalName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="diagonistics">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                type="text"
                value={diagonistics}
                onChange={(e) => setDiagonistics(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="dateandtime">
              <Form.Label>Date And Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dateandtime}
                onChange={(e) => setDateandTime(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create Prescription
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for viewing prescription */}
      <Modal
        show={showViewPrescriptionModal}
        onHide={() => setShowViewPrescriptionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>View Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prescription ? (
            <div>
              <p><strong>Hospital:</strong> {prescription.hospitalname}</p>
              <p><strong>Diagnosis:</strong> {prescription.diagonistics}</p>
              <p><strong>Date & Time:</strong> {prescription.dateandtime}</p>

              {/* Display the base64 decoded PDF as an embedded file */}
              {prescription.file_data ? (
                <embed
                  src={decodeBase64(prescription.file_data)}
                  width="100%"
                  height="600px"
                  type="application/pdf"
                />
              ) : (
                <Alert variant="warning">Loading prescription...</Alert>
              )}

              {/* If it's an image */}
              {prescription.file_data && !prescription.file_path && (
                <img
                  src={decodeBase64(prescription.file_data)}
                  alt="Prescription"
                  width="100%"
                />
              )}
            </div>
          ) : (
            <p>No prescription found for this patient.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewPrescriptionModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DoctorPatientListPage;

