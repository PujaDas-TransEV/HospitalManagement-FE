import React, { useState, useEffect } from 'react';
import { Spinner, Button, Modal, Alert, Table } from 'react-bootstrap';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './PrescriptionAdmin.css';
import { FaEye, FaDownload, FaTimes, FaSpinner } from 'react-icons/fa';
const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://192.168.0.106:5000/getallprescribe', {
          method: 'GET',
        });

        const data = await response.json();
        if (data && data.length > 0) {
          setPrescriptions(data);
          // Fetch doctor details for each prescription
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

      const response = await fetch('http://192.168.0.106:5000/doctors/getbyid', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data && data.data) {
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

  const getBase64PDF = (base64String) => `data:application/pdf;base64,${base64String}`;

  return (
    <div className="prescription-wrapper">
      <AdminNavbar />
      <div className="main-content">
        <AdminSidebar />
       <div
  className="prescription-page"
  style={{
    maxWidth: '1200px',
    margin: '0 auto',
    maxHeight: '200px',      // Adjust height as needed
    overflowY: 'auto',       // Scroll vertically if content is tall
  }}
>
          <h2>All Prescriptions</h2>

          {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
  <div
    className="spinner-center"
    style={{ fontSize: '2rem', color: '#007bff', textAlign: 'center', padding: '2rem' }}
  >
    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
  </div>
) : prescriptions.length > 0 ? (
  <div className="table-responsive">
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
            <td>{prescription.doctor ? prescription.doctor.doctorName : 'Loading...'}</td>
            <td>{prescription.doctor ? prescription.doctor.doctorSpecialization : 'Loading...'}</td>
            <td>{prescription.dateandtime}</td>
            <td>
              <Button
                variant="info"
                size="sm"
                onClick={() => handlePrescriptionClick(prescription)}
                aria-label={`View prescription ${prescription.prescription_id}`}
              >
                <FaEye/>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </div>
) : (
  <p>No prescriptions available.</p>
)}

{showModal && selectedPrescription && (
  <div
    className="popup-overlay"
    onClick={closeModal}
    role="dialog"
    aria-modal="true"
    aria-labelledby="popup-title"
  >
    <div
      className="popup-content"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside popup
      tabIndex={-1}
    >
      <h3 id="popup-title">Prescription Details</h3>
      <p>
        <strong>Hospital Name:</strong> {selectedPrescription.hospitalname}
      </p>
      <p>
        <strong>Date & Time:</strong> {selectedPrescription.dateandtime}
      </p>
      {selectedPrescription.doctor ? (
        <>
          <p>
            <strong>Doctor Name:</strong> {selectedPrescription.doctor.doctorName}
          </p>
          <p>
            <strong>Doctor Specialization:</strong> {selectedPrescription.doctor.doctorSpecialization}
          </p>
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
          title="Prescription PDF"
        />
      ) : (
        <p>No file available.</p>
      )}
      <button className="popup-close-btn" onClick={closeModal} aria-label="Close popup">
        Close
      </button>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;
