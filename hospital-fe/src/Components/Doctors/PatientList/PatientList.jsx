import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Row, Col, Button, Modal, Form, ListGroup } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode'; // fixed import
import { FaStethoscope } from 'react-icons/fa';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar'; // fixed typo in import
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

  // NEW: To hold multiple prescriptions fetched for a patient
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null); // to view a single prescription details

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

  useEffect(() => {
    if (doctorid) {
      const formData = new FormData();
      formData.append('doctorid', doctorid);

      fetch('http://192.168.0.106:5000/patientview', {
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

  const handleCreatePrescriptionClick = (patient) => {
    setSelectedPatient(patient);
    setShowPrescriptionModal(true);
    // Convert appointment_time string to local datetime-local input format
    const dt = new Date(patient.appointment_time);
    setDateandTime(dt.toISOString().slice(0, 16));
  };

  // UPDATED: fetch all prescriptions by patient uid and show modal with list
  const handleViewPrescriptionClick = async (patient) => {
    setSelectedPatient(patient);
    setLoading(true);
    setError(null);
    setPrescriptions([]);
    setSelectedPrescription(null);

    const formData = new FormData();
    formData.append('patientid', patient.uid);

    try {
      const response = await fetch('http://192.168.0.106:5000/doctors/getprescribebypatientid', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Prescriptions API response:', data);

      if (data && data.length > 0) {
        setPrescriptions(data);
        setSelectedPrescription(data[0]); // Show first prescription by default
        setShowViewPrescriptionModal(true);
      } else {
        alert('No prescriptions found for this patient.');
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      alert('Error occurred while fetching prescriptions.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('hospitalname', hospitalname);
    formData.append('doctorid', doctorid);
    formData.append('patientid', selectedPatient.uid);
    formData.append('dateandtime', dateandtime);
    formData.append('diagonistics', diagonistics);

    try {
      const response = await fetch('http://192.168.0.106:5000/createprescription', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.message) {
        alert('Prescription created successfully!');
        setShowPrescriptionModal(false);
      } else {
        alert('Error creating prescription: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('Error occurred while creating prescription.');
    }
  };

  const decodeBase64 = (base64String) => {
    const binaryString = window.atob(base64String);
    const binaryData = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([binaryData], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  };

  // Helper to render multiple emails (unchanged)
  const renderEmails = (email) => {
    if (!email) return 'N/A';
    if (Array.isArray(email)) {
      return (
        <ul className="email-list" style={{ paddingLeft: '15px', marginBottom: 0 }}>
          {email.map((mail, idx) => (
            <li key={idx} style={{ listStyleType: 'disc' }}>
              {mail}
            </li>
          ))}
        </ul>
      );
    }
    return email; // string email
  };

  return (
    <div className="dashboard-container">
      <DoctorNavbar />
      <div className="dashboard-content">
        <Doctorsidebar />
        <div className="doctor-patient-list-page-container" style={{ padding: '1rem' }}>
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

              <div className="table-responsive">
                <Table striped bordered hover style={{ minWidth: '700px' }}>
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
                          <td>{renderEmails(patient.email)}</td>
                          <td>{new Date(patient.appointment_time).toLocaleString()}</td>
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
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal for creating prescription (unchanged) */}
      <Modal
        show={showPrescriptionModal}
        onHide={() => setShowPrescriptionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePrescriptionSubmit}>
            <Form.Group controlId="hospitalName" className="mb-3">
              <Form.Label>Hospital Name</Form.Label>
              <Form.Control
                type="text"
                value={hospitalname}
                onChange={(e) => setHospitalName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="diagonistics" className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                type="text"
                value={diagonistics}
                onChange={(e) => setDiagonistics(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="dateandtime" className="mb-3">
              <Form.Label>Date And Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={dateandtime}
                onChange={(e) => setDateandTime(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Create Prescription
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for viewing multiple prescriptions */}
      <Modal
        show={showViewPrescriptionModal}
        onHide={() => setShowViewPrescriptionModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>View Prescriptions for {selectedPatient ? `${selectedPatient.firstname} ${selectedPatient.lastname}` : ''}</Modal.Title>
        </Modal.Header>
  <Modal.Body>
  {loading && <Spinner animation="border" />}
  {error && <Alert variant="danger">{error}</Alert>}

  {!loading && prescriptions.length > 0 && (
    <Row>
      <Col md={4}>
        {/* List of prescriptions to select */}
      
      </Col>
      <Col md={8}>
        {/* Show selected prescription details */}
        {selectedPrescription ? (
          <div>
           

            {selectedPrescription.file_data ? (
              <embed
                src={decodeBase64(selectedPrescription.file_data)}
                width="100%"
                height="600px"
                type="application/pdf"
              />
            ) : (
              <Alert variant="warning">No prescription file available.</Alert>
            )}
          </div>
        ) : (
          <p>Select a prescription from the list to view details.</p>
        )}
      </Col>
    </Row>
  )}

  {!loading && prescriptions.length === 0 && (
    <p>No prescriptions found for this patient.</p>
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
