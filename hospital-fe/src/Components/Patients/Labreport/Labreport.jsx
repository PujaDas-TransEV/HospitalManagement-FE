
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LabReportPDF from './LabreportPdf';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const LabReportPage = () => {
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const patientId = localStorage.getItem('patientId');

  const fetchLabReports = async () => {
    try {
      const formData = new FormData();
      formData.append('patientid', patientId);

      const response = await axios.post(
        'http://192.168.0.105:5000/labreport/bypatientid',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setLabReports(response.data.data || []);
    } catch (error) {
      console.error('Error fetching lab reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchLabReports();
  }, [patientId]);

  // DELETE handler
  const handleDelete = async (labreportid) => {
    if (!window.confirm('Are you sure you want to delete this lab report?')) return;

    try {
      const formData = new FormData();
      formData.append('labreportid', labreportid);

      await axios.post('http://192.168.0.105:5000/ops/deletelabs', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh list after delete
      fetchLabReports();
    } catch (error) {
      console.error('Error deleting lab report:', error);
    }
  };

  return (
    <div className="dashboard-container" style={{ backgroundColor: '#f3f6f9', minHeight: '100vh' }}>
      <PatientNavbar />
      <div className="dashboard-content" style={{ display: 'flex' }}>
        <PatientSidebar />
        <div className="lab-report-page" style={{ padding: '30px', flex: 1 }}>
          <h2 style={{ color: '#0056b3', marginBottom: '20px' }}>Your Lab Reports</h2>

          {loading ? (
            <p style={{ color: '#333' }}>Loading your lab reports, please wait...</p>
          ) : labReports.length > 0 ? (
            labReports.map((report) => (
              <div
                key={report.labreportid}
                className="lab-report-card"
                style={{
                  marginBottom: '25px',
                  padding: '25px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  borderLeft: '6px solid #007bff',
                }}
              >
                <h4 style={{ color: '#007bff', marginBottom: '15px' }}>
                  Report for {report.patientname}
                </h4>
                <p><strong>Age:</strong> {report.patientage}</p>
                <p><strong>Symptoms:</strong> {report.patientsymptoms}</p>
                <p><strong>Type of Tests:</strong> {report.typeoftest}</p>
                <p><strong>Doctor Referral:</strong> {report.doctorreferal}</p>
                <p><strong>Final Report:</strong> {report.finalreport}</p>
                <p><strong>Report ID:</strong> {report.labreportid}</p>
                <p><strong>Created At:</strong> {new Date(report.createdat).toLocaleString()}</p>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <PDFDownloadLink
                    document={<LabReportPDF report={report} />}
                    fileName={`Lab_Report_${report.labreportid}.pdf`}
                    style={{
                      backgroundColor: '#007bff',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontWeight: '400',
                      fontSize: '14px',
                    }}
                  >
                    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
                  </PDFDownloadLink>

                  <button
                    onClick={() => handleDelete(report.labreportid)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete Report
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>No lab reports found for this patient.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabReportPage;
