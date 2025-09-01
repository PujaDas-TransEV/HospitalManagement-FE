
import React, { useState, useEffect } from 'react';
import {
  Table, Alert,
  Button, Form, Card, ListGroup, Row, Col
} from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode';
import { FaStethoscope, FaPrescription, FaEye, FaSpinner,FaPlus } from 'react-icons/fa';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar';
import './PatientList.css';

const DoctorPatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
 const [medicine, setMedicine] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [hospitalName, setHospitalName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [dateTime, setDateTime] = useState('');

  // New loading state for prescriptions
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);

  // Decode token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        setDoctorId(jwtDecode(token).doctorid);
      } catch {
        setError('Invalid token');
      }
    } else {
      setError('Please login');
    }
  }, []);

  // Load patients
  useEffect(() => {
    if (!doctorId) return;
    (async () => {
      setLoading(true);
      try {
        const fm = new FormData();
        fm.append('doctorid', doctorId);
        const resp = await fetch('https://backend.medapp.transev.site/patientview', { method: 'POST', body: fm });
        const json = await resp.json();
        setPatients(json.patients || []);
      } catch {
        setError('Failed loading patients');
      }
      setLoading(false);
    })();
  }, [doctorId]);

  // Create Prescription
  const openCreate = (pt) => {
    setSelectedPatient(pt);
    setDateTime(new Date(pt.appointment_time).toISOString().slice(0, 16));
    setShowCreateModal(true);
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    try {
      const fm = new FormData();
      fm.append('hospitalname', hospitalName);
      fm.append('doctorid', doctorId);
      fm.append('patientid', selectedPatient.uid);
      fm.append('dateandtime', dateTime);
      fm.append('diagonistics', diagnosis);
         fm.append('medicine', medicine);

      const resp = await fetch('https://backend.medapp.transev.site/createprescription', { method: 'POST', body: fm });
      const j = await resp.json();
      alert(j.message ? 'Prescription created!' : `Error: ${j.message}`);
      setShowCreateModal(false);
      setHospitalName('');
      setDiagnosis('');
    } catch {
      alert('Submission failed');
    }
  };

  // View Prescription
  const openView = async (pt) => {
    setSelectedPatient(pt);
    setPrescriptionLoading(true);
    try {
      const fm = new FormData();
      fm.append('patientid', pt.uid);
      const resp = await fetch('https://backend.medapp.transev.site/doctors/getprescribebypatientid', { method: 'POST', body: fm });
      const json = await resp.json();
      if (json?.length) {
        setPrescriptions(json);
        setSelectedPrescription(json[0]);
        setShowViewModal(true);
      } else alert('No prescriptions found');
    } catch {
      alert('Error loading prescriptions');
    }
    setPrescriptionLoading(false);
  };

  const decodeBase64 = (b64) => {
    const bin = window.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([arr], { type: 'application/pdf' }));
  };

  return (
    <div className="patientlist-bg">
      <DoctorNavbar />
      <div className="dashboard-content-patientlist">
        <Doctorsidebar />
        <div className="patientlist-container">
          <h2 className="patientlist-title">  <FaStethoscope style={{ color: '#354394ff' }} /> Patient List </h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="patient-list-spinner">
              <FaSpinner className="loading-icon" />
              <div className="spinner-text">Loading patients...</div>
            </div>
          ) : patients.length === 0 ? (
            <div className="no-patients-found"><h4>No Patients Found</h4></div>
          ) : (
            <>
              {/* Table - desktop only */}
              <div className="patientlist-table d-none d-md-block">
                <Table bordered hover responsive>
                 <thead>
  <tr>
    <th className="patient-th">Name</th>
    <th className="patient-th">Age</th>
    <th className="patient-th">Gender</th>
    <th className="patient-th">Blood</th>
    <th className="patient-th">Phone</th>
    <th className="patient-th">Email</th>
    <th className="patient-th">Appt Time</th>
    <th className="patient-th">Specialty</th>
    <th className="patient-th">Actions</th>
  </tr>
</thead>

                  <tbody>
                    {patients.map(pt => (
                      <tr key={pt.uid}>
                        <td>{pt.firstname} {pt.lastname}</td>
                        <td>{pt.age}</td><td>{pt.gender}</td><td>{pt.bloodgroup}</td>
                        <td>{pt.phonenumber}</td>
                        <td>{Array.isArray(pt.email) ? pt.email.join(', ') : pt.email}</td>
                        <td>{new Date(pt.appointment_time).toLocaleString()}</td>
                        <td>{pt.doctorspecialization}</td>
                       <td>
  <Button
    size="sm"
    onClick={() => openCreate(pt)}
    style={{
      color: '#007bff',          // text color
      borderColor: '#007bff',    // border color
      backgroundColor: 'transparent',
      marginRight: '8px',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = '#007bff';
      e.currentTarget.style.color = 'white';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '#007bff';
    }}
  >
    <FaPlus /> Create
  </Button>{' '}
  <Button
    size="sm"
    onClick={() => openView(pt)}
    style={{
      color: '#6c757d',         // gray text color
      borderColor: '#6c757d',   // gray border color
      backgroundColor: 'transparent',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = '#6c757d';
      e.currentTarget.style.color = 'white';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '#6c757d';
    }}
  >
    <FaEye /> View
  </Button>
</td>

                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Cards - mobile only */}
             <div className="patientlist-cards d-block d-md-none" >

                {patients.map(pt => (
                  <Card key={pt.uid} className="mb-3">
                    <Card.Body>
                      <Card.Title>{pt.firstname} {pt.lastname}</Card.Title>
                     <Card.Text style={{ lineHeight: '1.5', fontSize: '14px', color: '#444', marginBottom: '0' }}>
  <div style={{ marginBottom: '6px' }}><strong>Age:</strong> {pt.age} | <strong>Gender:</strong> {pt.gender}</div>
  <div style={{ marginBottom: '6px' }}><strong>Blood Group:</strong> {pt.bloodgroup}</div>
  <div style={{ marginBottom: '6px' }}><strong>Phone:</strong> {pt.phonenumber}</div>
  <div style={{ marginBottom: '6px' }}><strong>Email:</strong> {Array.isArray(pt.email) ? pt.email.join(', ') : pt.email}</div>
  <div style={{ marginBottom: '6px' }}><strong>Appointment:</strong> {new Date(pt.appointment_time).toLocaleString()}</div>
  <div><strong>Specialty:</strong> {pt.doctorspecialization}</div>
</Card.Text>

                      <div className="text-end">
                        <td>
  <Button
    size="sm"
    onClick={() => openCreate(pt)}
    style={{
      color: '#007bff',          // text color
      borderColor: '#007bff',    // border color
      backgroundColor: 'transparent',
      marginRight: '8px',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = '#007bff';
      e.currentTarget.style.color = 'white';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '#007bff';
    }}
  >
    <FaPlus /> 
  </Button>{' '}
  <Button
    size="sm"
    onClick={() => openView(pt)}
    style={{
      color: '#6c757d',         // gray text color
      borderColor: '#6c757d',   // gray border color
      backgroundColor: 'transparent',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.backgroundColor = '#6c757d';
      e.currentTarget.style.color = 'white';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = '#6c757d';
    }}
  >
    <FaEye />
  </Button>
</td>

                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Prescription Modal */}
      {showCreateModal && (
        <div className="custom-popup-overlay">
          <div className="custom-popup">
            <div className="custom-popup-header">
              <h5>Create Prescription for {selectedPatient?.firstname}</h5>
              <button className="popup-close-btn" onClick={() => setShowCreateModal(false)}>&times;</button>
            </div>
            <Form onSubmit={submitPrescription} style={{    backgroundColor: '#e0f7fa'}}>
              <Form.Group className="mb-3">
                <Form.Label>Hospital Name</Form.Label>
                <Form.Control
                  required
                  value={hospitalName}
                  onChange={e => setHospitalName(e.target.value)}
                />
              </Form.Group>
            
              <Form.Group className="mb-3">
                 <Form.Label>Clinical Notes</Form.Label>
                 <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Describe diagnosis, symptoms, findings etc."
                />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Prescribed Medicines</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  value={medicine}
                  onChange={(e) => setMedicine(e.target.value)}
                  placeholder="List medicines with dosage and frequency"
                />
                </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Date & Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={e => setDateTime(e.target.value)}
                />
              </Form.Group>
          <Button
  type="submit"
  style={{
    width: '40%',
    backgroundColor: '#144272ff',
    color: 'white',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    display: 'block',       // Makes it a block-level element
    margin: '0 auto'        // Auto left & right margin centers it
  }}
>
  Submit
</Button>


            </Form>
          </div>
        </div>
      )}

      {/* View Prescription Modal */}
      {showViewModal && (
        <div className="custom-popup-overlay">
          <div className="custom-popup large">
            <div className="custom-popup-header">
              <h5>Prescriptions: {selectedPatient?.firstname} {selectedPatient?.lastname}</h5>
              <button className="popup-close-btn" onClick={() => setShowViewModal(false)}>&times;</button>
            </div>

            {prescriptionLoading ? (
              <div className="patient-list-spinner">
                <FaSpinner className="loading-icon" />
                Loading prescriptions...
              </div>
            ) : (
              <Row>
                <Col md={4}>
                  <ListGroup variant="flush">
                    {prescriptions.map(pr => (
                   
                      <ListGroup.Item
  key={pr.uid}
  active={selectedPrescription?.uid === pr.uid}
  action
  onClick={() => setSelectedPrescription(pr)}
  style={{
    cursor: 'pointer',
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '6px',
    border: selectedPrescription?.uid === pr.uid ? '2px solid #007bff' : '1px solid #ddd',
    backgroundColor: selectedPrescription?.uid === pr.uid ? '#e9f5ff' : '#fff',
    fontWeight: selectedPrescription?.uid === pr.uid ? '600' : '400',
    color: selectedPrescription?.uid === pr.uid ? '#0056b3' : '#333',
    transition: 'all 0.3s ease',
  }}
  onMouseEnter={e => {
    if (selectedPrescription?.uid !== pr.uid) {
      e.currentTarget.style.backgroundColor = '#f7f9fc';
    }
  }}
  onMouseLeave={e => {
    if (selectedPrescription?.uid !== pr.uid) {
      e.currentTarget.style.backgroundColor = '#fff';
    }
  }}
>
  {new Date(pr.dateandtime).toLocaleDateString()}
</ListGroup.Item>

                    ))}
                  </ListGroup>
                </Col>
                <Col md={8}>
                  {selectedPrescription?.file_data ? (
                    <embed
                      src={decodeBase64(selectedPrescription.file_data)}
                      width="100%"
                      height="400px"
                      type="application/pdf"
                    />
                  ) : <Alert>No prescription file available.</Alert>}
                </Col>
              </Row>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPatientListPage;

