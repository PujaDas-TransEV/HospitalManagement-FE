
import React, { useState, useEffect } from 'react';
import { Spinner, Button, Modal, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({}); // Store doctor details
  const navigate = useNavigate();

  // Admin can view all prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/getallprescribe', {
          method: 'GET',
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
          setError('No prescriptions found.');
        }
      } catch (err) {
        setError('Error fetching prescriptions.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions(); // Fetch prescriptions when the page loads
  }, []);

  // Fetch doctor details using doctor ID for each prescription
  const fetchDoctorDetails = async (doctorId, prescription) => {
    try {
      const formData = new FormData();
      formData.append('doctorid', doctorId);

      const response = await fetch('http://localhost:5000/doctors/getbyid', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Doctor API Response:', data);

      if (data) {
        const doctorName = data.data.fullname;
        const doctorSpecialization = data.data.specialization;

        // Add doctor details to the prescription object
        prescription.doctor = { doctorName, doctorSpecialization };
        
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

  // Function to handle prescription click
  const handlePrescriptionClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  // Function to handle the modal close
  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

  // Function to display base64 image or file (for PDF files)
  const getBase64PDF = (base64String) => {
    return `data:application/pdf;base64,${base64String}`;
  };

  return (
    <div className="home-page">
      <AdminNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100" style={{ backgroundImage: 'url(/Assests/background.jpg)' }}>
        <div className="home-content flex flex-row">
          <AdminSidebar />
          <div className="prescription-page">
            <h2>All Prescriptions</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              <div>
                {prescriptions.length > 0 ? (
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Prescription ID</th>
                        <th>Hospital Name</th>
                        <th>Doctor Name</th>
                        <th>Doctor Specialization</th>
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
                          <td>{prescription.doctor ? prescription.doctor.doctorName : 'Loading...'}</td>
                          <td>{prescription.doctor ? prescription.doctor.doctorSpecialization : 'Loading...'}</td>
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
                  <p>No prescriptions available.</p>
                )}
              </div>
            )}

            {/* Modal for viewing prescription details */}
            <Modal show={showModal} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Prescription Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedPrescription && (
                  <div>
                    <p><strong>Hospital Name:</strong> {selectedPrescription.hospitalname}</p>
                    <p><strong>Date & Time:</strong> {selectedPrescription.dateandtime}</p>

                    {/* Display doctor details fetched from the API */}
                    {selectedPrescription.doctor ? (
                      <>
                        <p><strong>Doctor Name:</strong> {selectedPrescription.doctor.doctorName}</p>
                        <p><strong>Doctor Specialization:</strong> {selectedPrescription.doctor.doctorSpecialization}</p>
                      </>
                    ) : (
                      <p>No doctor found for this prescription.</p>
                    )}

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
