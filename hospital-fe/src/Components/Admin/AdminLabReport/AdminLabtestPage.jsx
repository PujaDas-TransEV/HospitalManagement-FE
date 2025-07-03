
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import Adminsidebar from '../Adminsidebar/AdminSidebar';
import { FaSearch, FaFlask, FaSpinner, FaRedo,FaEdit,FaSave,FaTimes } from 'react-icons/fa';
import './AdminLabtest.css'; // import the new CSS

const AdminLabTestPage = () => {
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://192.168.0.106:5000/ops/labreportall');
      const reports = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setLabReports(reports);
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      setLabReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return alert('Please enter a Lab Report ID to search');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('labreportid', searchId.trim());
      const res = await axios.post('http://192.168.0.106:5000/labreport/labbyid', formData);
      const result = res.data?.data || res.data;
      const reports = Array.isArray(result) ? result : [result];
      setLabReports(reports);
    } catch (error) {
      console.error('Search error:', error);
      setLabReports([]);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (report) => {
    setEditData({
      ...report,
      labid: report.labreportid || report.uid || '',
      patientname: report.patientname || '',
      patientid: report.patientid || '',
      hospitalgeneratedreportid: report.hospitalgeneratedreportid || report.labphyreportid || '',
    });
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editData) return;
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('labid', editData.labid);
      formData.append('patientid', editData.patientid);
      formData.append('labphyreportid', editData.hospitalgeneratedreportid);
      formData.append('patientsymptoms', editData.patientsymptoms || '');
      formData.append('doctorreferal', editData.doctorreferal || '');
      formData.append('typeoftest', editData.typeoftest || '');
      formData.append('finalreport', editData.finalreport || '');

      await axios.post('http://192.168.0.106:5000/ops/labupdate', formData);
      alert('Lab report updated successfully');
      setEditModalOpen(false);
      fetchAllReports();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update lab report');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dashboard-container-lab">
      <AdminNavbar />
      <div className="dashboard-content-lab">
        <Adminsidebar />
        <div className="labtest-main">
          <h1>Admin Lab Test Management</h1>

          <button className="create-new-btnn" onClick={() => (window.location.href = '/admin/labreport')}>
            <FaFlask /> Create New Lab Test Report
          </button>

          <div className="search-controls">
            <input
              type="text"
              placeholder="Search by Lab Report ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button onClick={handleSearch}><FaSearch /></button>
            <button onClick={() => { setSearchId(''); fetchAllReports(); }}>  <FaRedo style={{ marginRight: '6px' }} /></button>
          </div>

          {loading && <div className="loading-overlay"><FaSpinner className="spin large" /></div>}
          {!loading && labReports.length === 0 && <p>No lab reports found.</p>}

          {!loading && labReports.length > 0 && (
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Patient Name</th>
                  <th>Lab Phy Report ID</th>
                  <th>Symptoms</th>
                  <th>Doctor Referral</th>
                  <th>Type of Test</th>
                  <th>Final Report</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {labReports.map((report) => (
                  <tr key={report.labreportid || report.uid}>
                    <td data-label="Report ID">{report.uid || report.labreportid}</td>
                    <td data-label="Patient Name">{report.patientname || '-'}</td>
                    <td data-label="Lab Phy Report ID">{report.hospitalgeneratedreportid || report.labphyreportid || '-'}</td>
                    <td data-label="Symptoms">{report.patientsymptoms}</td>
                    <td data-label="Doctor Referral">{report.doctorreferal}</td>
                    <td data-label="Type of Test">{report.typeoftest}</td>
                    <td data-label="Final Report">{report.finalreport}</td>
                    <td data-label="Actions">
                      <button className="editt-btn" onClick={() => openEditModal(report)}> <FaEdit style={{ marginRight: '6px' }} /> </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {editModalOpen && editData && (
            <div className="edit-modal" onClick={() => setEditModalOpen(false)}>
              <form className="edit-form" onSubmit={handleUpdate} onClick={(e) => e.stopPropagation()}>
                <h2>Edit Lab Report</h2>

                <label>Lab Report ID:<input type="text" value={editData.labid} readOnly /></label>
                <label>Patient Name:<input type="text" value={editData.patientname} readOnly /></label>
                <label>Lab Phy Report ID:<input name="hospitalgeneratedreportid" value={editData.hospitalgeneratedreportid} onChange={handleEditChange} /></label>
                <label>Symptoms:<textarea name="patientsymptoms" value={editData.patientsymptoms || ''} onChange={handleEditChange} rows={3} /></label>
                <label>Doctor Referral:<input name="doctorreferal" value={editData.doctorreferal || ''} onChange={handleEditChange} /></label>
                <label>Type of Test:<input name="typeoftest" value={editData.typeoftest || ''} onChange={handleEditChange} /></label>
                <label>Final Report:<textarea name="finalreport" value={editData.finalreport || ''} onChange={handleEditChange} rows={3} /></label>

                <div className="edit-actions">
                  {/* <button type="button" onClick={() => setEditModalOpen(false)}><FaTimes/></button>
               <button type="submit" disabled={updating}>
  {updating ? <FaSave /> : <> <FaSave style={{ marginLeft: '6px' }} /></>}
</button> */}
<button
  type="button"
  onClick={() => setEditModalOpen(false)}
  style={{
    backgroundColor: '#dc3545', // Bootstrap red for cancel
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }}
  aria-label="Close edit modal"
>
  <FaTimes />
</button>

<button
  type="submit"
  disabled={updating}
  style={{
    backgroundColor: updating ? '#6c757d' : '#28a745', // Gray if updating, green otherwise
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: updating ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }}
>
  {updating ? <FaSave /> : <>Update <FaSave /></>}
</button>


                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLabTestPage;
