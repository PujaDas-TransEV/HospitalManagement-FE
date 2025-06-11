
import React, { useState, useEffect } from 'react';
import { Spinner, Button, Modal, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './PrescriptionAdmin.css'; // 👈 Add your CSS here

const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://192.168.0.105:5000/getallprescribe', {
          method: 'GET',
        });

        const data = await response.json();
        if (data && data.length > 0) {
          setPrescriptions(data);
          data.forEach((prescription) => {
            fetchDoctorDetails(prescription.doctorid, prescription);
          });
        } else {
          setError('No prescriptions found.');
        }
      } catch (err) {
        setError('Error fetching prescriptions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const fetchDoctorDetails = async (doctorId, prescription) => {
    try {
      const formData = new FormData();
      formData.append('doctorid', doctorId);

      const response = await fetch('http://192.168.0.105:5000/doctors/getbyid', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data) {
        prescription.doctor = {
          doctorName: data.data.fullname,
          doctorSpecialization: data.data.specialization,
        };

        setPrescriptions((prev) =>
          prev.map((item) =>
            item.prescription_id === prescription.prescription_id ? prescription : item
          )
        );
      }
    } catch (err) {
      console.error('Error fetching doctor details:', err);
    }
  };

  const handlePrescriptionClick = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

  const getBase64PDF = (base64String) => {
    return `data:application/pdf;base64,${base64String}`;
  };

  return (
    <div className="prescription-wrapper">
      <AdminNavbar />
      <div className="main-content">
        <AdminSidebar />
        <div className="prescription-page">
          <h2>All Prescriptions</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <div className="table-responsive">
              {prescriptions.length > 0 ? (
                <Table striped bordered hover>
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
                        <td>{prescription.doctor ? prescription.doctor.doctorName : 'Loading...'}</td>
                        <td>{prescription.doctor ? prescription.doctor.doctorSpecialization : 'Loading...'}</td>
                        <td>{prescription.dateandtime}</td>
                        <td>
                          <Button variant="info" onClick={() => handlePrescriptionClick(prescription)}>
                            View
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

          <Modal show={showModal} onHide={closeModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Prescription Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedPrescription && (
                <div>
                  <p><strong>Hospital Name:</strong> {selectedPrescription.hospitalname}</p>
                  <p><strong>Date & Time:</strong> {selectedPrescription.dateandtime}</p>
                  {selectedPrescription.doctor ? (
                    <>
                      <p><strong>Doctor Name:</strong> {selectedPrescription.doctor.doctorName}</p>
                      <p><strong>Doctor Specialization:</strong> {selectedPrescription.doctor.doctorSpecialization}</p>
                    </>
                  ) : (
                    <p>No doctor found for this prescription.</p>
                  )}
                  {selectedPrescription.file_data ? (
                    <embed
                      src={getBase64PDF(selectedPrescription.file_data)}
                      width="100%"
                      height="600px"
                      type="application/pdf"
                    />
                  ) : (
                    <p>No file available.</p>
                  )}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
