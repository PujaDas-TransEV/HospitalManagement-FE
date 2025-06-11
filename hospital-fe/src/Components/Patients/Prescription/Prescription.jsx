import React, { useState, useEffect } from 'react';
import { Spinner, Button, Modal, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Prescription.css'; // Make sure to create and link this CSS file
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({}); // Store doctor details
  const [doctorSpecialization, setDoctorSpecialization] = useState({}); // Store doctor specialization
  const [doctorName, setDoctorName] = useState({}); // Store doctor name
  const navigate = useNavigate();

  // Get the JWT token from localStorage
  const accessToken = localStorage.getItem('accessToken');
  const patientId = accessToken ? jwtDecode(accessToken).userid : null;

  // Fetch prescriptions based on patient ID
  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);

    if (!patientId) {
      setError('No patient ID found.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('patientid', patientId);

    try {
      const response = await fetch('http://192.168.0.105:5000/doctors/getprescribebypatientid', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      console.log('API Response:', data);

      if (data && data.length > 0) {
        setPrescriptions(data); // Set the fetched prescriptions
        // Fetch doctor details for each prescription
        data.forEach((prescription) => {
          fetchDoctorDetails(prescription.doctorid, prescription); // Fetch doctor details for each prescription
        });
      } else {
        // setError('No prescriptions found for this patient.');
      }
    } catch (err) {
      setError('Error fetching prescriptions.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor details using doctor ID
  const fetchDoctorDetails = async (doctorId, prescription) => {
    try {
      const formData = new FormData();
      formData.append('doctorid', doctorId);

      const response = await fetch('http://192.168.0.105:5000/doctors/getbyid', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      console.log('Doctor API Response:', data);

      if (data) {
        const doctorname = data.data.fullname;
        console.log('doctorname:', doctorname);
        setDoctorName(doctorname);
        const doctorspecialization  = data.data.specialization;
        setDoctorSpecialization(doctorspecialization);
        console.log(
            'doctor special',doctorSpecialization)
        prescription.doctor = doctorDetails; // Attach doctor details to prescription
        setPrescriptions((prevPrescriptions) => {
          return prevPrescriptions.map((item) =>
            item.prescription_id === prescription.prescription_id ? prescription : item
          );
        });
      } else {
        prescription.doctor = null; // If no doctor is found, set null
        setPrescriptions((prevPrescriptions) => {
          return prevPrescriptions.map((item) =>
            item.prescription_id === prescription.prescription_id ? prescription : item
          );
        });
        setError('No doctor found for this prescription.');
      }
    } catch (err) {
      setError('Error fetching doctor details.');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (!accessToken || !patientId) {
      navigate('/login'); // If no accessToken or patientId, redirect to login page
      return;
    }

    fetchPrescriptions(); // Fetch prescriptions when the page loads
  }, [accessToken, patientId, navigate]);

  // Function to handle prescription click
  const handlePrescriptionClick = (prescription) => {
    setSelectedPrescription(prescription);
    setDoctorDetails(prescription.doctor || {});
    setShowModal(true);
  };

  // Function to handle the modal close
  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
    setDoctorDetails({});
  };

  // Function to display base64 image or file (for PDF files)
  const getBase64PDF = (base64String) => {
    return `data:application/pdf;base64,${base64String}`;
  };

  return (
    <div className="home-page">
    <PatientNavbar />
    <div className="flex justify-center items-center min-h-screen bg-gray-100" style={{ backgroundImage: 'url(/Assests/background.jpg)' }}>
      <div className="home-content flex flex-row">
        <PatientSidebar />
    <div className="prescription-page">
      {/* <h2>Your Prescriptions</h2> */}
 <h2 style={{ marginBottom: '10px' }}>Your Prescriptions</h2> 
      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <div className="prescription-table-wrapper">
          {prescriptions.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Prescription ID</th>
                  <th>Hospital Name</th>
                 
                  <th>Doctor Name</th> {/* Doctor name column */}
                  <th>Doctor Specialization</th> {/* Doctor specialization column */}
                  <th>Date & Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((prescription) => (
                  <tr key={prescription.prescription_id}>
                    <td>{prescription.prescription_id}</td>
                    <td>{prescription.hospitalname}</td>
                  
                    {/* Display doctor details */}
                    <td>{prescription.doctor ? doctorName : 'Loading...'}</td> {/* Doctor name */}
                    <td>{prescription.doctor ? doctorSpecialization : 'Loading...'}</td> {/* Doctor specialization */}
                    <td>{prescription.dateandtime}</td>
                    <td>
                      <Button variant="info" onClick={() => handlePrescriptionClick(prescription)}>
                        View Prescription
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No prescriptions available for this patient.</p>
          )}
        </div>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPrescription && (
            <div>
              <p><strong>Hospital Name:</strong> {selectedPrescription.hospitalname}</p>
            

              {/* Display doctor details fetched from the API */}
              {selectedPrescription.doctor ? (
                <>
                  <p><strong>Doctor Name:</strong> {selectedPrescription.doctor.fullname}</p>
                  <p><strong>Doctor Specialization:</strong> {selectedPrescription.doctor.specialization}</p>
                </>
              ) : (
                <p>No doctor found for this prescription.</p>
              )}

              <p><strong>Date & Time:</strong> {selectedPrescription.dateandtime}</p>

              {/* Check if the prescription has file_data (base64) */}
              {selectedPrescription.file_data ? (
                <embed
                  src={getBase64PDF(selectedPrescription.file_data)} // Display PDF from base64
                  width="100%"
                  height="600px"
                  type="application/pdf"
                />
              ) : (
                <p>No file available for this prescription.</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
    </div>
    </div>
  );
};

export default PrescriptionPage;
