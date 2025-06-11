
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import Adminsidebar from '../Adminsidebar/AdminSidebar';
import { FaSearch } from 'react-icons/fa';

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
      console.error('Error fetching all lab reports:', error);
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
      console.error('Error searching lab report:', error);
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
      formData.append('labid', editData.labid); // backend expects labid
      formData.append('patientid', editData.patientid || '');
      formData.append('labphyreportid', editData.hospitalgeneratedreportid || '');
      formData.append('patientsymptoms', editData.patientsymptoms || '');
      formData.append('doctorreferal', editData.doctorreferal || '');
      formData.append('typeoftest', editData.typeoftest || '');
      formData.append('finalreport', editData.finalreport || '');

      await axios.post('http://192.168.0.106:5000/ops/labupdate', formData);
      alert('Lab report updated successfully');
      setEditModalOpen(false);
      fetchAllReports();
    } catch (error) {
      console.error('Error updating lab report:', error);
      alert('Failed to update lab report');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="dashboard-container">
      <AdminNavbar />
      <div className="dashboard-content" style={{ display: 'flex' }}>
        <Adminsidebar />
        <div style={{ padding: 20 }}>
          <h1 style={{ marginBottom: 20 }}>Admin Lab Test Management</h1>

          <button
            onClick={() => (window.location.href = '/admin/labreport')}
            style={{ marginBottom: 20, padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
          >
            Create New Lab Test Report
          </button>

          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Search by Lab Report ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ padding: '8px 12px', width: 250, marginRight: 10, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button onClick={handleSearch} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              <FaSearch />
            </button>
            <button
              onClick={() => {
                setSearchId('');
                fetchAllReports();
              }}
              style={{ marginLeft: 10, padding: '8px 16px', cursor: 'pointer' }}
            >
              Reset
            </button>
          </div>

          {loading && <p>Loading lab reports...</p>}
          {!loading && labReports.length === 0 && <p>No lab reports found.</p>}

          {!loading && labReports.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Report ID</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Patient Name</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Lab Phy Report ID</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Symptoms</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Doctor Referral</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Type of Test</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Final Report</th>
                  <th style={{ padding: 10, border: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {labReports.map((report) => (
                  <tr key={report.labreportid || report.id}>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{report.uid || report.labreportid}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{report.patientname || '-'}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{report.hospitalgeneratedreportid || report.labphyreportid || '-'}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{report.patientsymptoms}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{report.doctorreferal}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{report.typeoftest}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>{report.finalreport}</td>
                    <td style={{ padding: 10, border: '1px solid #ddd' }}>
                      <button
                        onClick={() => openEditModal(report)}
                        style={{
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 4,
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {editModalOpen && editData && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
              onClick={() => setEditModalOpen(false)}
            >
              <form
                onSubmit={handleUpdate}
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: 'white',
                  padding: 30,
                  borderRadius: 8,
                  width: 500,
                  maxWidth: '90%',
                  boxShadow: '0 0 20px rgba(0,0,0,0.2)',
                }}
              >
                <h2>Edit Lab Report</h2>

                <label>
                  Lab Report ID:
                  <input
                    type="text"
                    value={editData.labid}
                    readOnly
                    style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </label>

                <label>
                  Patient Name:
                  <input
                    type="text"
                    name="patientname"
                    value={editData.patientname}
                    readOnly
                    style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </label>

                <label>
                  Lab Phy Report ID:
                  <input
                    type="text"
                    name="hospitalgeneratedreportid"
                    value={editData.hospitalgeneratedreportid}
                    onChange={handleEditChange}
                    style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </label>

                <label>
                  Symptoms:
                  <textarea
                    name="patientsymptoms"
                    value={editData.patientsymptoms || ''}
                    onChange={handleEditChange}
                    style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                    rows={3}
                  />
                </label>

                <label>
                  Doctor Referral:
                  <input
                    type="text"
                    name="doctorreferal"
                    value={editData.doctorreferal || ''}
                    onChange={handleEditChange}
                    style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </label>

                <label>
                  Type of Test:
                  <input
                    type="text"
                    name="typeoftest"
                    value={editData.typeoftest || ''}
                    onChange={handleEditChange}
                    style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                </label>

                <label>
                  Final Report:
                  <textarea
                    name="finalreport"
                    value={editData.finalreport || ''}
                    onChange={handleEditChange}
                    style={{ width: '100%', marginBottom: 20, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                    rows={3}
                  />
                </label>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button type="button" onClick={() => setEditModalOpen(false)} style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: updating ? '#ccc' : '#007bff',
                      color: 'white',
                      border: 'none',
                      cursor: updating ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {updating ? 'Updating...' : 'Update'}
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
