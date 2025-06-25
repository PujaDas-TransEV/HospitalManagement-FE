import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  FaSpinner, FaDownload, FaTrash, FaLockOpen, FaLock,
} from 'react-icons/fa';
import LabReportPDF from './LabreportPdf';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import './Labreport.css';

const LabReportPage = () => {
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState(null);

  const patientId = localStorage.getItem('patientId');
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const isGuest = userRole === 'guest';

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const fd = new FormData();
        fd.append('patientid', patientId);
        const res = await axios.post('http://192.168.0.106:5000/labreport/bypatientid', fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        let reports = res.data.data || [];
        if (isGuest) reports = reports.filter(r => r.guestaccess === 'yes');
        setLabReports(reports);
      } catch (err) {
        setError('Failed to load lab reports.');
      } finally {
        setLoading(false);
      }
    };
    if (patientId) fetchReports();
  }, [patientId]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this lab report?')) return;
    try {
      const fd = new FormData();
      fd.append('labreportid', id);
      await axios.post('http://192.168.0.106:5000/ops/deletelabs', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setLabReports(prev => prev.filter(r => r.labreportid !== id));
    } catch {
      setError('Failed to delete report.');
    }
  };

  const toggleGuestAccess = async (report) => {
    const newAccess = report.guestaccess === 'yes' ? 'no' : 'yes';
    setTogglingId(report.labreportid);
    try {
      const fd = new FormData();
      fd.append('patientid', patientId);
      fd.append('labid', report.labreportid);
      fd.append('guestaccess', newAccess);
      await axios.post('http://localhost:5000/patientops/labdataaccessupdate', fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setLabReports(prev =>
        prev.map(r => r.labreportid === report.labreportid
          ? { ...r, guestaccess: newAccess } : r)
      );
    } catch {
      setError('Failed to update access.');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="lab-page">
      <PatientNavbar />
      <div className="lab-main-layout">
        <PatientSidebar />
        <div className="lab-content">
          <h2>Patient Lab Reports</h2>
          {error && <div className="lab-error">{error}</div>}
          {!loading && labReports.length === 0 && (
            <p className="lab-empty">No lab reports found.</p>
          )}

          <div className="lab-cards-container">
            {labReports.map(report => (
              <div className="lab-card" key={report.labreportid}>
                <div className="lab-card-info">
                  <p><strong>Report ID:</strong> {report.labreportid}</p>
                  <p><strong>Age:</strong> {report.patientage}</p>
                  <p><strong>Test:</strong> {report.typeoftest}</p>
                  {!isGuest && (
                    <p>
                      <strong>Guest Access:</strong> {report.guestaccess === 'yes' ? 'Granted' : 'Denied'}
                    </p>
                  )}
                </div>
                 <div className="lab-card-actions">
                  <PDFDownloadLink
                    document={<LabReportPDF report={report} />}
                    fileName={`Lab_Report_${report.labreportid}.pdf`}
                    className="lab-icon-btn download"   style={{ transform: 'translateY(12px)' }} 
                  >
                    {({ loading }) =>
                      loading ? <FaSpinner className="icon-spin" /> : <FaDownload title="Download PDF" />
                    }
                  </PDFDownloadLink>

                  {!isGuest && (
                    <>
                      <button className="lab-icon-btn delete" onClick={() => handleDelete(report.labreportid)}>
                        <FaTrash title="Delete Report" />
                      </button>
                      <button
                        className="lab-icon-btn access"
                        onClick={() => toggleGuestAccess(report)}
                        disabled={togglingId === report.labreportid}
                      >
                        {togglingId === report.labreportid
                          ? <FaSpinner className="icon-spin" />
                          : report.guestaccess === 'yes'
                            ? <FaLock title="Revoke Access" />
                            : <FaLockOpen title="Grant Access" />}
                      </button>
                    </>
                  )}
                </div> 
              

              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <FaSpinner className="spinner-large" />
        </div>
      )}
    </div>
  );
};

export default LabReportPage;
