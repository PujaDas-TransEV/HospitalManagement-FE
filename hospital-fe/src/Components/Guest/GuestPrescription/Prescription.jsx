import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Prescription.css';
import GuestNavbar from '../GuestNavbar'; 
const GuestPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pdfUrls, setPdfUrls] = useState({});

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const token = localStorage.getItem('guestToken');
      const patientId = localStorage.getItem('guestPatientId');

      if (!token || !patientId) {
        setMessage('Unauthorized. Please login first.');
        setLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append('patientid', patientId);

        const { data: res } = await axios.post(
          'http://192.168.0.106:5000/guestlogin/allguestaccessprescribedata',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const accessiblePrescriptions = Array.isArray(res.data) ? res.data : [];

        if (accessiblePrescriptions.length === 0) {
          setMessage('You have no access to view prescriptions.');
        } else {
          setPrescriptions(accessiblePrescriptions);

          // Convert each prescription's base64 file_data to Blob URL for iframe & download
          const urls = {};
          accessiblePrescriptions.forEach((prescription, idx) => {
            if (prescription.file_data) {
              const byteCharacters = atob(prescription.file_data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: 'application/pdf' });
              urls[idx] = URL.createObjectURL(blob);
            }
          });
          setPdfUrls(urls);
        }
      } catch (err) {
        console.error(err);
        setMessage('Failed to fetch Prescriptions.');
      }

      setLoading(false);
    };

    fetchPrescriptions();

    // Cleanup blob URLs when component unmounts
    return () => {
      Object.values(pdfUrls).forEach(URL.revokeObjectURL);
    };
  }, []);

  if (loading) return <p className="loading-text">Loading Prescriptions...</p>;
  if (message) return <p className="message-text">{message}</p>;

  return (
     <div className="guest-dashboard-container">
      <GuestNavbar />
    <div className="prescription-page">
      <h2>Your Prescriptions</h2>
      {prescriptions.length === 0 ? (
        <p className="message-text">No Prescriptions found.</p>
      ) : (
        prescriptions.map((prescription, idx) => (
          <div key={idx} className="prescription-card">
            <h3>Prescription — {new Date(prescription.created_at).toLocaleDateString()}</h3>
            <p><strong>Hospital:</strong> {prescription.hospitalname}</p>
            <p><strong>Patient:</strong> {prescription.patientfullname}</p>
            <p><strong>Date & Time:</strong> {prescription.dateandtime}</p>
            <p><strong>Diagnostics:</strong> {prescription.diagonistics}</p>

            {pdfUrls[idx] ? (
              <>
                {/* <iframe
                  src={pdfUrls[idx]}
                  title={`prescription-pdf-${idx}`}
                  className="report-pdf"
                  width="100%"
                  height="600px"
                /> */}
                <a
                  href={pdfUrls[idx]}
                  download={`Prescription-${prescription.prescription_id}.pdf`}
                  className="downloadd-btn"
                >
                  Download PDF
                </a>
              </>
            ) : (
              <p>No PDF available.</p>
            )}
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default GuestPrescriptions;
