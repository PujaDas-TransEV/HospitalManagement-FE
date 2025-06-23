
import React, { useState, useEffect } from 'react';
import { Spinner, Button, Modal, Alert, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './Prescription.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({});
  const [doctorSpecialization, setDoctorSpecialization] = useState({});
  const [doctorName, setDoctorName] = useState({});
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');
  const patientId = accessToken ? jwtDecode(accessToken).userid : null;

  // Fetch prescriptions
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
      const response = await fetch('http://192.168.0.106:5000/doctors/getprescribebypatientid', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data && data.length > 0) {
        setPrescriptions(data);

        data.forEach((prescription) => {
          fetchDoctorDetails(prescription.doctorid, prescription);
        });
      }
    } catch (err) {
      setError('Error fetching prescriptions.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor details
  const fetchDoctorDetails = async (doctorId, prescription) => {
    try {
      const formData = new FormData();
      formData.append('doctorid', doctorId);

      const response = await fetch('http://192.168.0.106:5000/doctors/getbyid', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Doctor API Response:', data);

      if (data && data.data) {
        const doctorname = data.data.fullname;
        const doctorspecialization = data.data.specialization;

        // Attach doctor info to prescription
        prescription.doctor = {
          fullname: doctorname,
          specialization: doctorspecialization,
        };

        // Update prescriptions with new doctor info
        setPrescriptions((prev) =>
          prev.map((item) =>
            item.prescription_id === prescription.prescription_id ? prescription : item
          )
        );
      } else {
        prescription.doctor = null;
        setPrescriptions((prev) =>
          prev.map((item) =>
            item.prescription_id === prescription.prescription_id ? prescription : item
          )
        );
        setError('No doctor found for this prescription.');
      }
    } catch (err) {
      setError('Error fetching doctor details.');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    if (!accessToken || !patientId) {
      navigate('/login');
      return;
    }
    fetchPrescriptions();
  }, [accessToken, patientId, navigate]);

  // Toggle guest access API call
  const toggleGuestAccess = async (prescription) => {
    if (!patientId) {
      setError('No patient ID found.');
      return;
    }

    const newAccess = prescription.guestaccess === 'yes' ? 'no' : 'yes';

    const formData = new FormData();
    formData.append('patientid', patientId);
    formData.append('prescribeid', prescription.prescription_id);
    formData.append('guestaccess', newAccess);

    try {
      const response = await fetch('http://192.168.0.106:5000/patientops/prescribeaccessupdate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state for guest access toggle
        setPrescriptions((prev) =>
          prev.map((item) =>
            item.prescription_id === prescription.prescription_id
              ? { ...item, guestaccess: newAccess }
              : item
          )
        );
      } else {
        setError(data.message || 'Failed to update guest access.');
      }
    } catch (err) {
      setError('Failed to update guest access.');
      console.error(err);
    }
  };

  // Handle modal open
  const handlePrescriptionClick = (prescription) => {
    setSelectedPrescription(prescription);
    setDoctorDetails(prescription.doctor || {});
    setShowModal(true);
  };

  // Handle modal close
  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
    setDoctorDetails({});
  };

  // Show base64 PDF
  const getBase64PDF = (base64String) => {
    return `data:application/pdf;base64,${base64String}`;
  };

  return (
    <div className="home-page">
      <PatientNavbar />
      <div
        className="flex justify-center items-center min-h-screen bg-gray-100"
        style={{ backgroundImage: 'url(/Assests/background.jpg)' }}
      >
        <div className="home-content flex flex-row">
          <PatientSidebar />
          <div className="prescription-page">
            <h2 style={{ marginBottom: '10px' }}>Your Prescriptions</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
              <Spinner animation="border" variant="primary" />
            ) : prescriptions.length > 0 ? (
              <div className="prescription-table-wrapper">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Prescription ID</th>
                      <th>Hospital Name</th>
                      <th>Doctor Name</th>
                      <th>Doctor Specialization</th>
                      <th>Date & Time</th>
                      <th>Guest Access</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((prescription) => (
                      <tr key={prescription.prescription_id}>
                        <td>{prescription.prescription_id}</td>
                        <td>{prescription.hospitalname}</td>
                        <td>{prescription.doctor ? prescription.doctor.fullname : 'Loading...'}</td>
                        <td>
                          {prescription.doctor ? prescription.doctor.specialization : 'Loading...'}
                        </td>
                        <td>{prescription.dateandtime}</td>
                        <td>{prescription.guestaccess === 'yes' ? 'Yes' : 'No'}</td>
                        <td>
                          <Button
                            variant={prescription.guestaccess === 'yes' ? 'danger' : 'success'}
                            onClick={() => toggleGuestAccess(prescription)}
                            style={{ marginRight: '8px' }}
                          >
                            {prescription.guestaccess === 'yes' ? 'Revoke Access' : 'Grant Access'}
                          </Button>
                          <Button variant="info" onClick={() => handlePrescriptionClick(prescription)}>
                            View Prescription
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p>No prescriptions available for this patient.</p>
            )}

            <Modal show={showModal} onHide={closeModal} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Prescription Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedPrescription && (
                  <div>
                    <p>
                      <strong>Hospital Name:</strong> {selectedPrescription.hospitalname}
                    </p>
                    {selectedPrescription.doctor ? (
                      <>
                        <p>
                          <strong>Doctor Name:</strong> {selectedPrescription.doctor.fullname}
                        </p>
                        <p>
                          <strong>Doctor Specialization:</strong>{' '}
                          {selectedPrescription.doctor.specialization}
                        </p>
                      </>
                    ) : (
                      <p>No doctor found for this prescription.</p>
                    )}
                    <p>
                      <strong>Date & Time:</strong> {selectedPrescription.dateandtime}
                    </p>
                    {selectedPrescription.file_data ? (
                      <embed
                        src={getBase64PDF(selectedPrescription.file_data)}
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
