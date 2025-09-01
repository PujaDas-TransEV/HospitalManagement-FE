import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './labreport.css';
import GuestNavbar from '../GuestNavbar';

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
          'https://backend.medapp.transev.site/guestlogin/allguestaccesslabdata',
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
    const margin = 15;
    let y = 20;

    const headerColor = '#1976d2';
    const sectionBgColor = '#f1f1f1';
    const textColor = '#000000';

    // Header
    doc.setFillColor(headerColor);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('XYZ Diagnostic Center', margin, 20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('123 Health Street, Metro City', margin, 26);
    doc.text('Phone: +1 555-123-4567 | Email: contact@Lifecarelab.com', 195, 26, { align: 'right' });

    y = 40;
    doc.setTextColor(textColor);

    // Report Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Lab Report — ${report.typeoftest}`, margin, y);
    y += 10;

    // Patient Info Box
    doc.setFillColor(sectionBgColor);
    doc.rect(margin - 5, y, 180, 40, 'F');
    y += 7;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Patient Name: ${report.patientname}`, margin, y);
    y += 6;
    doc.text(`Age: ${report.patientage}`, margin, y);
    y += 6;
    doc.text(`Symptoms: ${report.patientsymptoms}`, margin, y);
    y += 6;
    doc.text(`Referred By: Dr. ${report.doctorreferal}`, margin, y);
    y += 6;
    doc.text(`Report ID: ${report.hospitalgeneratedreportid}`, margin, y);
    y += 12;

    // Final Report Section
    doc.setFont('helvetica', 'bold');
    doc.text('Final Report:', margin, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    const finalReportLines = doc.splitTextToSize(report.finalreport, 180);
    doc.setFillColor('#ffffff');
    doc.rect(margin - 5, y - 5, 180, finalReportLines.length * 6 + 10, 'F');
    doc.text(finalReportLines, margin, y);
    y += finalReportLines.length * 6 + 10;

    // Date
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text(`Date Issued: ${new Date(report.created_at).toLocaleDateString()}`, margin, y);
    y += 10;

    // Footer Note
    doc.setFontSize(10);
    doc.setTextColor('#555');
    doc.text('This is a computer-generated report. No signature is required.', margin, y);

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
