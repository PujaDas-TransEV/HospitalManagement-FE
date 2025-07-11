
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaFileDownload, FaPrint, FaTimesCircle, FaCheckCircle, FaTimes,FaEye, FaLockOpen,FaLock } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import './Prescription.css';

const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState(null); // null = not loaded, [] = empty list
  const [loading, setLoading] = useState(true);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const token = localStorage.getItem('accessToken');
  const patientId = token ? jwtDecode(token).userid : null;

  useEffect(() => {
    if (!token || !patientId) {
      navigate('/login');
      return;
    }
    fetchPrescriptions();
  }, [token]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError('');
    setPrescriptions(null);
    try {
      const fd = new FormData();
      fd.append('patientid', patientId);

      const res = await fetch('http://192.168.0.106:5000/doctors/getprescribebypatientid', {
        method: 'POST',
        body: fd,
      });

      if (res.status === 404) {
       
        setPrescriptions([]);
        setError(''); 
        return;
      }

      if (!res.ok) {
        throw new Error('Network error');
      }

      const data = await res.json();
      setPrescriptions(data || []);

      
      data?.forEach(async (p) => await fetchDoctor(p));
    } catch (e) {
      setError('Failed to load prescriptions.');
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctor = async (prescription) => {
    const fd = new FormData();
    fd.append('doctorid', prescription.doctorid);
    try {
      const res = await fetch('http://192.168.0.106:5000/doctors/getbyid', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      prescription.doctor = data.data || null;
      setPrescriptions((prev) => [...prev]);
    } catch (e) {
      console.error('Doctor fetch error:', e);
    }
  };

  const toggleGuest = async (p) => {
    setLoadingDialog(true);
    try {
      const newAccess = p.guestaccess === 'yes' ? 'no' : 'yes';
      const fd = new FormData();
      fd.append('patientid', patientId);
      fd.append('prescribeid', p.prescription_id);
      fd.append('guestaccess', newAccess);

      const res = await fetch('http://192.168.0.106:5000/patientops/prescribeaccessupdate', {
        method: 'POST',
        body: fd,
      });

      if (res.ok) {
        p.guestaccess = newAccess;
        setPrescriptions((prev) => [...prev]);
      } else {
        setError('Unable to update guest access.');
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoadingDialog(false);
    }
  };

  const openModal = (p) => {
    setSelectedPrescription(p);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPrescription(null);
  };

  const downloadPDF = () => {
    if (!selectedPrescription) return;
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${selectedPrescription.file_data}`;
    link.download = `prescription_${selectedPrescription.prescription_id}.pdf`;
    link.click();
  };

  const printPDF = () => {
    if (!selectedPrescription) return;
    const win = window.open();
    win.document.write(
      `<iframe src="data:application/pdf;base64,${selectedPrescription.file_data}" frameborder="0" style="width:100%;height:100vh"></iframe>`
    );
    win.print();
  };

  return (
    <div className="presc-dashboard">
      <PatientNavbar />
      <div className="presc-content">
        <PatientSidebar />

        {loading && (
          <div className="loading-overlay">
            <div className="loading-popup">
              <FaSpinner className="spinner-icon" />
              Loading prescriptions...
            </div>
          </div>
        )}

        {loadingDialog && (
          <div className="loading-overlay">
            <div className="loading-popup">
              <FaSpinner className="spinner-icon" />
              Updating access...
            </div>
          </div>
        )}

        {error && (
          <div className="presc-error" role="alert">
            <FaTimesCircle /> {error}
          </div>
        )}

        {!loading && prescriptions && prescriptions.length === 0 && (
          <div className="no-prescriptions" style={{ textAlign: 'center', padding: '20px', color: '#666',backgroundColor:'#10b981',width:'100%' }}>
          
            <p>No prescriptions found.</p>
          </div>
        )}

     
 {!loading && prescriptions && prescriptions.length > 0 && (
          <div className="presc-main">
            <h2>Prescriptions</h2>

            {isMobile ? (
             
              <div className="mobile-presc-cards">
                {prescriptions.map((p) => (
                  <div className="presc-card" key={p.prescription_id}>
                    <h4>Prescription ID: {p.prescription_id}</h4>
                    <p><strong>Hospital:</strong> {p.hospitalname}</p>
                    <p><strong>Doctor:</strong> {p.doctor?.fullname || '...'}</p>
                    <p><strong>Specialty:</strong> {p.doctor?.specialization || '...'}</p>
                    <p><strong>Date/Time:</strong> {p.dateandtime}</p>
                    <p><strong>Guest Access:</strong> {p.guestaccess === 'yes' ? 'Yes' : 'No'}</p>

                    <div className="actions">
                      <button
                        onClick={() => toggleGuest(p)}
                        className={p.guestaccess === 'yes' ? 'btn-revoke' : 'btn-grant'}
                        aria-label={p.guestaccess === 'yes' ? 'Revoke Guest Access' : 'Grant Guest Access'}
                      >
                        {p.guestaccess === 'yes' ? <FaLock /> : <FaLockOpen />}
                      </button>
                      <button onClick={() => openModal(p)} className="btn-view" aria-label="View Prescription">
                        <FaEye />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
            
              <div className="table-responsive">
                <table className="presc-table" aria-label="Prescriptions table">
                  <thead>
                    <tr>
                      <th className="presc-th">ID</th>
                      <th className="presc-th">Hospital</th>
                      <th className="presc-th">Doctor</th>
                      <th className="presc-th">Specialty</th>
                      <th className="presc-th">Date/Time</th>
                      <th className="presc-th">Guest Access</th>
                      <th className="presc-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((p) => (
                      <tr key={p.prescription_id}>
                        <td>{p.prescription_id}</td>
                        <td>{p.hospitalname}</td>
                        <td>{p.doctor?.fullname || '...'}</td>
                        <td>{p.doctor?.specialization || '...'}</td>
                        <td>{p.dateandtime}</td>
                        <td>{p.guestaccess === 'yes' ? 'Yes' : 'No'}</td>
                        <td className="actions">
                          <button
                            onClick={() => toggleGuest(p)}
                            className={p.guestaccess === 'yes' ? 'btn-revoke' : 'btn-grant'}
                            aria-label={p.guestaccess === 'yes' ? 'Revoke Guest Access' : 'Grant Guest Access'}
                          >
                            {p.guestaccess === 'yes' ? <FaLock /> : <FaLockOpen />}
                          </button>
                          <button onClick={() => openModal(p)} className="btn-view" aria-label="View Prescription">
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
   
{showModal && (
  <div className="custom-modal-overlay" onClick={closeModal}>
    <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
      <div className="custom-modal-header">
        <h2>Prescription</h2>
        <button className="close-btn" onClick={closeModal}><FaTimes /></button>
      </div>

      {selectedPrescription?.file_data ? (
        <iframe
          className="custom-modal-iframe"
          src={`data:application/pdf;base64,${selectedPrescription.file_data}`}
          title="Prescription PDF"
        />
      ) : (
        <div className="no-file-message">No prescription file available.</div>
      )}

      <div className="custom-modal-footer">
        <button onClick={downloadPDF} className="btn-action download">
          <FaFileDownload /> Download
        </button>
        <button onClick={printPDF} className="btn-action print">
          <FaPrint /> Print
        </button>
        <button onClick={closeModal} className="btn-action close">
          <FaTimes /> Close
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default PrescriptionPage;
