import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './labreport.css';
import GuestNavbar from  '../GuestNavbar'; 
const GuestLabReports = () => {
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [pdfUrls, setPdfUrls] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
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
          'http://localhost:5000/guestlogin/allguestaccesslabdata',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allReports = res.data || [];
        const accessibleReports = allReports.filter(r => r.guestaccess === 'yes');

        if (accessibleReports.length === 0) {
          setMessage('You have no access to view lab report.');
        } else {
          setLabReports(accessibleReports);
        }

      } catch (err) {
        console.error(err);
        setMessage('Failed to fetch lab reports.');
      }

      setLoading(false);
    };

    fetchReports();
  }, []);

  const generatePdf = (report, index) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Lab Report — ${report.typeoftest}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient Name: ${report.patientname}`, 20, 40);
    doc.text(`Age: ${report.patientage}`, 20, 50);
    doc.text(`Symptoms: ${report.patientsymptoms}`, 20, 60);
    doc.text(`Doctor: ${report.doctorreferal}`, 20, 70);
    doc.text(`Report ID: ${report.hospitalgeneratedreportid}`, 20, 80);
    doc.text(`Final Report: ${report.finalreport}`, 20, 90);
    doc.text(`Date: ${new Date(report.created_at).toLocaleDateString()}`, 20, 100);

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    setPdfUrls(prev => ({
      ...prev,
      [index]: pdfUrl,
    }));
  };

  if (loading) return <p className="loading-text">Loading lab reports...</p>;
  if (message) return <p className="message-text">{message}</p>;
  if (!labReports.length) return <p className="message-text">No lab reports found.</p>;

  return (
     <div className="guest-dashboard-container">
      <GuestNavbar />
    <div className="lab-reports-page">
      <h2>Your Lab Reports</h2>
      {labReports.map((report, idx) => (
        <div key={idx} className="report-card">
          <h3>{report.typeoftest} — {new Date(report.created_at).toLocaleDateString()}</h3>
          <p><strong>Doctor:</strong> {report.doctorreferal}</p>
          <p><strong>Final Report:</strong> {report.finalreport}</p>

          <button
            className="generate-btn"
            onClick={() => generatePdf(report, idx)}
          >
            Generate & View PDF
          </button>

          {pdfUrls[idx] && (
            <>
              <iframe
                src={pdfUrls[idx]}
                title={`lab-report-${idx}`}
                className="report-pdf"
              />
              <a
                href={pdfUrls[idx]}
                download={`LabReport-${report.typeoftest}.pdf`}
                className="download-btn"
              >
                Download PDF
              </a>
            </>
          )}
        </div>
      ))}
    </div>
    </div>
  );
};

export default GuestLabReports;
