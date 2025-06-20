import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button, Spinner, Alert } from 'react-bootstrap';
import LabReportPDF from './LabreportPdf';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';

const LabReportPage = () => {
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingAccessId, setTogglingAccessId] = useState(null);
  const [error, setError] = useState(null);

  const patientId = localStorage.getItem('patientId');
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // 'patient' or 'guest'
  const isGuest = userRole === 'guest';

  const fetchLabReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('patientid', patientId);

      const response = await axios.post(
        'http://192.168.0.106:5000/labreport/bypatientid',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      let reports = response.data.data || [];

      if (isGuest) {
        reports = reports.filter((report) => report.guestaccess === 'yes');
      }

      setLabReports(reports);
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      setError('Failed to fetch lab reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) fetchLabReports();
  }, [patientId]);

  const handleDelete = async (labreportid) => {
    if (!window.confirm('Are you sure you want to delete this lab report?')) return;

    try {
      const formData = new FormData();
      formData.append('labreportid', labreportid);

      await axios.post('http://192.168.0.106:5000/ops/deletelabs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchLabReports();
    } catch (error) {
      console.error('Error deleting lab report:', error);
      setError('Failed to delete lab report.');
    }
  };

  const toggleGuestAccess = async (report) => {
    const newAccess = report.guestaccess === 'yes' ? 'no' : 'yes';
    setTogglingAccessId(report.labreportid);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('patientid', patientId);
      formData.append('labid', report.labreportid);
      formData.append('guestaccess', newAccess);

      const response = await axios.post(
        'http://localhost:5000/patientops/labdataaccessupdate',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setLabReports((prev) =>
          prev.map((r) =>
            r.labreportid === report.labreportid ? { ...r, guestaccess: newAccess } : r
          )
        );
      } else {
        setError('Failed to update guest access.');
      }
    } catch (error) {
      console.error('Failed to update guest access:', error);
      setError('Error updating guest access.');
    } finally {
      setTogglingAccessId(null);
    }
  };

  return (
    <div className="dashboard-container" style={{ backgroundColor: '#f3f6f9', minHeight: '100vh' }}>
      <PatientNavbar />
      <div className="dashboard-content" style={{ display: 'flex' }}>
        <PatientSidebar />
        <div className="lab-report-page" style={{ padding: '30px', flex: 1 }}>
          <h2 style={{ color: '#0056b3', marginBottom: '20px' }}>Your Lab Reports</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <Spinner animation="border" variant="primary" />
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

                {!isGuest && (
                  <p><strong>Guest Access:</strong> {report.guestaccess === 'yes' ? 'Granted' : 'Denied'}</p>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
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

                  {!isGuest && (
                    <>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(report.labreportid)}
                      >
                        Delete Report
                      </Button>

                      <Button
                        variant={report.guestaccess === 'yes' ? 'danger' : 'success'}
                        onClick={() => toggleGuestAccess(report)}
                        disabled={togglingAccessId === report.labreportid}
                      >
                        {togglingAccessId === report.labreportid
                          ? 'Updating...'
                          : report.guestaccess === 'yes'
                          ? 'Revoke Access'
                          : 'Grant Access'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#888' }}>
              {isGuest
                ? 'No lab reports are currently accessible to guests.'
                : 'No lab reports found for this patient.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabReportPage;
