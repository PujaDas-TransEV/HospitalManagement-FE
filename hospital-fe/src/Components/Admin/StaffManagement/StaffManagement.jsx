import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Table } from 'react-bootstrap';
import {
  FaEdit, FaTrash, FaPlus, FaTimes, FaSpinner,FaSearch
} from 'react-icons/fa';
import './StaffManagement.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const StaffManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [staffDetails, setStaffDetails] = useState({
    staffname: '', staffdetails: '', hos_gen_staffid: '',
    staffage: '', staffgender: '', staffdob: '',
    stafftype: '', staffcategory: '',
    staffworkingstatus: '', staffsalarytdate: '',
    staffpaymentstatus: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [searchID, setSearchID] = useState('');
  const [searchedStaff, setSearchedStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails(prev => ({ ...prev, [name]: value }));
  };

  const fetchStaffList = () => {
    setLoading(true);
    fetch('http://192.168.0.106:5000/ops/listofstaff')
      .then(res => res.json())
      .then(data => {
        if (data.data && Array.isArray(data.data)) {
          setStaffList(data.data);
          setError('');
        } else {
          setError('Error fetching staff list');
          setStaffList([]);
        }
      })
      .catch(() => {
        setError('Error fetching staff list');
        setStaffList([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchStaffList, []);

  const searchStaffByID = (e) => {
    e?.preventDefault();
    if (!searchID.trim()) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('staffid', searchID);
    fetch('http://192.168.0.106:5000/ops/getstaffdetailsbyid', {
      method: 'POST', body: fd
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setSearchedStaff(data.data);
          setError('');
        } else {
          setError('No staff found');
          setSearchedStaff(null);
        }
      })
      .catch(() => {
        setError('Error searching staff');
        setSearchedStaff(null);
      })
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setStaffDetails({
      staffname: '', staffdetails: '', hos_gen_staffid: '',
      staffage: '', staffgender: '', staffdob: '',
      stafftype: '', staffcategory: '',
      staffworkingstatus: '', staffsalarytdate: '',
      staffpaymentstatus: ''
    });
    setError('');
    setSuccess('');
  };

 const handleFormSubmit = (e) => {
    e.preventDefault();
    if (Object.values(staffDetails).some((v) => !v)) {
      setError('All fields are required!');
      return;
    }

    setLoading(true);
    const fd = new FormData();
    Object.entries(staffDetails).forEach(([k, v]) => fd.append(k, v));
    const url = editingStaff
      ? 'http://192.168.0.106:5000/staffops/updatestaff'
      : 'http://192.168.0.106:5000/ops/createstaff';

    if (editingStaff) fd.append('staffid', editingStaff);

    fetch(url, { method: 'POST', body: fd })
      .then((res) => res.json())
      .then((data) => {
        if (data.success || data.message) {
          setSuccess(editingStaff ? 'Updated!' : 'Created!');
          fetchStaffList();
          setShowForm(false);
          setEditingStaff(null);
          resetForm();
        } else setError(data.error || 'Failed');
      })
      .catch(() => setError('Error processing'))
      .finally(() => setLoading(false));
  };

 const handleEditStaff = (staff) => {
    setStaffDetails(staff);
    setEditingStaff(staff.uid); // Use the UID to track which staff we are editing
    setShowForm(true);
  };

  const handleUpdateStaff = (e) => {
    e.preventDefault();
    if (!editingStaff) return;

    const formData = new FormData();
    formData.append('staffid', editingStaff); // Pass the staff ID (uid)
    Object.keys(staffDetails).forEach((key) => {
      formData.append(key, staffDetails[key]);
    });

    fetch('http://192.168.0.106:5000/staffops/updatestaff', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setSuccess('Staff updated successfully!');
          fetchStaffList();
          setEditingStaff(null);
          setShowForm(false);
        } else {
          setError(data.error || 'Error updating staff');
        }
      })
      .catch((error) => {
        setError('An error occurred while updating staff');
      });
  };

  const deleteStaff = (uid) => {
    if (!window.confirm('Delete this staff?')) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('staffid', uid);
    fetch('http://192.168.0.106:5000/ops/staffdelete', {
      method: 'POST', body: fd
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setSuccess('Deleted Staff Successfully!');
          fetchStaffList();
        } else setError(data.error || 'Deletion failed');
      })
      .catch(() => setError('Deletion error'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="staff-management-page">
      <AdminNavbar />
      <div className="staff-management-content">
        <AdminSidebar />
        <div className="staff-management-container">
          <h2>Staff Management</h2>

         
          <Form
  className="search-wrapper"
  onSubmit={(e) => {
    e.preventDefault();
    searchStaffByID(); // <-- Call the staff search function
  }}
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    marginLeft: 'auto',
    maxWidth: '400px'
  }}
>
  <input
    type="text"
    placeholder="Search by Staff ID"
    value={searchID}
    onChange={(e) => setSearchID(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && searchStaffByID()}
    style={{
      flex: 1,
      padding: '8px 12px',
      backgroundColor: '#e0f7fa',
      borderRadius: '4px',
      border: '1px solid #ccc',
    }}
  />

  <button
    type="submit"
    className="btn search-btn"
    style={{
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }}
  >
    <FaSearch />
  </button>
</Form>


          {loading && <div className="spinner-wrapper"><FaSpinner className="loading-spinner" /></div>}

          {!loading && (
            <>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              {searchedStaff && (
                <div style={{ position: 'relative' }}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setSearchedStaff(null)}
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
                  ><FaTimes /></Button>
                  <h3>Searched Staff</h3>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>ID</th><th>Name</th><th>Details</th><th>Age</th><th>Gender</th><th>Hospital ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{searchedStaff.uid}</td>
                        <td>{searchedStaff.staffname}</td>
                        <td>{searchedStaff.staffdetails}</td>
                        <td>{searchedStaff.staffage}</td>
                        <td>{searchedStaff.staffgender}</td>
                        <td>{searchedStaff.hos_gen_staffid}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              )}

              <Button
                variant="primary"
                onClick={() => { setShowForm(!showForm); setEditingStaff(null); resetForm(); }}
              >
                {showForm ? (<><FaTimes /> Cancel</>) : (<><FaPlus /> Create Staff</>)}
              </Button>

              <Table striped bordered hover className="staff-table" style={{ marginTop: '20px' }}>
                <thead>
                  <tr>
                    <th>ID</th><th>Name</th><th>Details</th><th>Age</th><th>Gender</th><th>Type</th>
                    <th>Category</th><th>SalaryDate</th><th>PaymentStatus</th><th>WorkingStatus</th><th>Actions</th>
                  </tr>
                </thead>
                {/* <tbody>
                  {staffList.map(s => (
                    <tr key={s.uid}>
                      <td>{s.uid}</td><td>{s.staffname}</td><td>{s.staffdetails}</td>
                      <td>{s.staffage}</td><td>{s.staffgender}</td><td>{s.stafftype}</td>
                      <td>{s.staffcategory}</td><td>{s.staffsalarytdate}</td><td>{s.staffpaymentstatus}</td>
                      <td>{s.staffworkingstatus}</td>
                      <td>
                        <Button variant="warning" onClick={() => { handleEditStaff(s); setShowForm(true); }}>
                          <FaEdit />
                        </Button>{' '}
                        <Button variant="danger" onClick={() => deleteStaff(s.uid)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody> */}
                <tbody>
  {staffList.map(s => (
    <tr key={s.uid}>
      <td data-label="ID">{s.uid}</td>
      <td data-label="Name">{s.staffname}</td>
      <td data-label="Details">{s.staffdetails}</td>
      <td data-label="Age">{s.staffage}</td>
      <td data-label="Gender">{s.staffgender}</td>
      <td data-label="Type">{s.stafftype}</td>
      <td data-label="Category">{s.staffcategory}</td>
      <td data-label="SalaryDate">{s.staffsalarytdate}</td>
      <td data-label="PaymentStatus">{s.staffpaymentstatus}</td>
      <td data-label="WorkingStatus">{s.staffworkingstatus}</td>
      <td data-label="Actions">
        <Button variant="warning" onClick={() => { handleEditStaff(s); setShowForm(true); }}>
          <FaEdit />
        </Button>{' '}
        <Button variant="danger" onClick={() => deleteStaff(s.uid)}>
          <FaTrash />
        </Button>
      </td>
    </tr>
  ))}
</tbody>

              </Table>

                {showForm && (
                <div className="form-popup">
                  <button className="close-btn" onClick={() => { setShowForm(false); setEditingStaff(null); resetForm(); }}>
                    <FaTimes />
                  </button>
                  <Form onSubmit={handleFormSubmit} className="staff-form"style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px"}}>
                    <div className="form-row">
                      <div className="form-col"><Form.Group><Form.Label>Name</Form.Label><Form.Control name="staffname" value={staffDetails.staffname} onChange={handleInputChange} /></Form.Group></div>
                      <div className="form-col"><Form.Group><Form.Label>Details</Form.Label><Form.Control name="staffdetails" value={staffDetails.staffdetails} onChange={handleInputChange} /></Form.Group></div>
                    </div>

                    <div className="form-row">
                      <div className="form-col"><Form.Group><Form.Label>Hospital Staff ID</Form.Label><Form.Control name="hos_gen_staffid" value={staffDetails.hos_gen_staffid} onChange={handleInputChange} /></Form.Group></div>
                      <div className="form-col"><Form.Group><Form.Label>Age</Form.Label><Form.Control name="staffage" value={staffDetails.staffage} onChange={handleInputChange} /></Form.Group></div>
                    </div>

                    <div className="form-row">
                      <div className="form-col"><Form.Group><Form.Label>Gender</Form.Label><Form.Control as="select" name="staffgender" value={staffDetails.staffgender} onChange={handleInputChange}><option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option></Form.Control></Form.Group></div>
                      <div className="form-col"><Form.Group><Form.Label>DOB</Form.Label><Form.Control type="date" name="staffdob" value={staffDetails.staffdob} onChange={handleInputChange} /></Form.Group></div>
                    </div>

                    <div className="form-row">
                      <div className="form-col"><Form.Group><Form.Label>Staff Type</Form.Label><Form.Control as="select" name="stafftype" value={staffDetails.stafftype} onChange={handleInputChange}><option value="">Select Type</option><option>Doctor</option><option>Nurse</option><option>Admin</option><option>Support</option></Form.Control></Form.Group></div>
                      <div className="form-col"><Form.Group><Form.Label>Category</Form.Label><Form.Control as="select" name="staffcategory" value={staffDetails.staffcategory} onChange={handleInputChange}><option value="">Select Category</option><option>Permanent</option><option>Contract</option><option>Temporary</option></Form.Control></Form.Group></div>
                    </div>

                    <div className="form-row">
                      <div className="form-col"><Form.Group><Form.Label>Working Status</Form.Label><Form.Control as="select" name="staffworkingstatus" value={staffDetails.staffworkingstatus} onChange={handleInputChange}><option value="">Select Status</option><option>Active</option><option>Inactive</option></Form.Control></Form.Group></div>
                      <div className="form-col"><Form.Group><Form.Label>Salary Date</Form.Label><Form.Control type="date" name="staffsalarytdate" value={staffDetails.staffsalarytdate} onChange={handleInputChange} /></Form.Group></div>
                    </div>

                    <div className="form-row">
                      <div className="form-col"><Form.Group><Form.Label>Payment Status</Form.Label><Form.Control as="select" name="staffpaymentstatus" value={staffDetails.staffpaymentstatus} onChange={handleInputChange}><option value="">Select Payment</option><option>Paid</option><option>Pending</option></Form.Control></Form.Group></div>
                      <div className="form-col"></div>
                    </div>

                    <Button type="submit" variant="success" className="btn submit-btnn" disabled={loading}>
                      {loading ? <FaSpinner className="fa-spin" /> : (editingStaff ? 'Update Staff' : 'Create Staff')}
                    </Button>
                  </Form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
