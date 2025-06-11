import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Table } from 'react-bootstrap';
import './StaffManagement.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const StaffManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [staffDetails, setStaffDetails] = useState({
    staffname: '',
    staffdetails: '',
    hos_gen_staffid: '',
    staffage: '',
    staffgender: '',
    staffdob: '',
    stafftype: '',
    staffcategory: '',
    staffworkingstatus: '',
    staffsalarytdate: '',
    staffpaymentstatus: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [searchID, setSearchID] = useState('');
  const [searchedStaff, setSearchedStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = () => {
    fetch('http://192.168.0.105:5000/ops/listofstaff')
      .then((response) => response.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setStaffList(data.data);
        } else {
          setError('Error fetching staff list');
        }
      })
      .catch((error) => {
        setError('An error occurred while fetching staff list');
      });
  };

  const searchStaffByID = () => {
    const formData = new FormData();
    formData.append('staffid', searchID);

    fetch('http://192.168.0.105:5000/ops/getstaffdetailsbyid', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data) {
          setSearchedStaff(data.data); // Use data.data to get the staff details
        } else {
          setError('No staff found with this ID');
          setSearchedStaff(null);
        }
      })
      .catch((error) => {
        setError('An error occurred while fetching staff by ID');
        setSearchedStaff(null);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails({ ...staffDetails, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!Object.values(staffDetails).every((val) => val !== '')) {
      setError('All fields are required!');
      return;
    }

    const formData = new FormData();
    Object.keys(staffDetails).forEach((key) => {
      formData.append(key, staffDetails[key]);
    });

    fetch('http://192.168.0.105:5000/ops/createstaff', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccess('Staff created successfully!');
          setStaffDetails({
            staffname: '',
            staffdetails: '',
            hos_gen_staffid: '',
            staffage: '',
            staffgender: '',
            staffdob: '',
            stafftype: '',
            staffcategory: '',
            staffworkingstatus: '',
            staffsalarytdate: '',
            staffpaymentstatus: '',
          });
          fetchStaffList();
        } else {
          setError(data.error || 'Staff creation failed');
        }
      })
      .catch((error) => {
        setError('An error occurred while creating staff');
      });
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

    fetch('http://192.168.0.105:5000/staffops/updatestaff', {
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

  const handleDeleteStaff = (staffID) => {
    const formData = new FormData();
    formData.append('staffid', staffID); // Pass the staff ID (uid) to delete

    fetch('http://192.168.0.105:5000/ops/staffdelete', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setSuccess('Staff deleted successfully!');
          fetchStaffList();
        } else {
          setError(data.error || 'Error deleting staff');
        }
      })
      .catch((error) => {
        setError('An error occurred while deleting staff');
      });
  };

  return (
    <div className="staff-management-page">
      <AdminNavbar />
      <div className="staff-management-content">
        <AdminSidebar />
        <div className="staff-management-container">
          <h2>Staff Management</h2>

          {/* Search functionality */}
          <div className="search-section">
            <Form inline onSubmit={(e) => { e.preventDefault(); searchStaffByID(); }}>
              <Form.Control
                type="text"
                placeholder="Search by Staff ID"
                value={searchID}
                onChange={(e) => setSearchID(e.target.value)}
                style={{ width: '250px', marginRight: '-380px' }}
              />
              <Button type="submit" variant="primary" style={{width:'100px',marginBottom:'30px',marginLeft:'300px'}}>
                Search
              </Button>
            </Form>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {/* Display the searched staff */}
          {searchedStaff && (
            <>
              <h3>Searched Staff Details</h3>
              <Table striped bordered hover className="staff-table">
                <thead>
                  <tr>
                    <th>Staff ID</th>
                    <th>Staff Name</th>
                    <th>Staff Details</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th> Staff Hospital Id</th>
                   
                  </tr>
                </thead>
                <tbody>
                  <tr key={searchedStaff.uid}>
                    <td>{searchedStaff.uid}</td>
                    <td>{searchedStaff.staffname}</td>
                    <td>{searchedStaff.staffdetails}</td>
                    <td>{searchedStaff.staffage}</td>
                    <td>{searchedStaff.staffgender}</td>
                    <td>{searchedStaff.hos_gen_staffid}</td>
                   
                  </tr>
                </tbody>
              </Table>
            </>
          )}

          <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
              className="toggle-form-btn"
           
          >
            {showForm ? 'Cancel' : 'Create Staff'}
          </Button>

          {/* Display the list of all staff */}
          <Table striped bordered hover className="staff-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Staff Name</th>
                <th>Staff Details</th>
                <th>Staff Age</th>
                <th>Staff Gender</th>
                <th>Staff Type</th>
                <th>Staff Category</th>
                <th>Staff Salary Date</th>
                <th>Staff Payment Status</th>
                <th>Staff Working Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.uid}>
                  <td>{staff.uid}</td>
                  <td>{staff.staffname}</td>
                  <td>{staff.staffdetails}</td>
                  <td>{staff.staffage}</td>
                  <td>{staff.staffgender}</td>
                  <td>{staff.stafftype}</td>
                  <td>{staff.staffcategory}</td>
                  <td>{staff.staffsalarytdate}</td>
                  <td>{staff.staffpaymentstatus}</td>
                  <td>{staff.staffworkingstatus}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleEditStaff(staff)}
                    >
                      Edit
                    </Button>{' '}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteStaff(staff.uid)} // Pass staff's uid for delete
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Conditional rendering of the form for creating/updating staff */}
          {showForm && (
            <Form onSubmit={editingStaff ? handleUpdateStaff : handleFormSubmit}>
              <Form.Group controlId="staffname">
                <Form.Label>Staff Name</Form.Label>
                <Form.Control
                  type="text"
                  name="staffname"
                  value={staffDetails.staffname}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="staffdetails">
                <Form.Label>Staff Details</Form.Label>
                <Form.Control
                  type="text"
                  name="staffdetails"
                  value={staffDetails.staffdetails}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="hos_gen_staffid">
                <Form.Label>Hospital Staff ID</Form.Label>
                <Form.Control
                  type="text"
                  name="hos_gen_staffid"
                  value={staffDetails.hos_gen_staffid}
                  onChange={handleInputChange}
                   // Prevent editing of staff ID
                />
              </Form.Group>

              <Form.Group controlId="staffage">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="staffage"
                  value={staffDetails.staffage}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="staffgender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  type="text"
                  name="staffgender"
                  value={staffDetails.staffgender}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="staffdob">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="staffdob"
                  value={staffDetails.staffdob}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="stafftype">
                <Form.Label>Staff Type</Form.Label>
                <Form.Control
                  type="text"
                  name="stafftype"
                  value={staffDetails.stafftype}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="staffcategory">
                <Form.Label>Staff Category</Form.Label>
                <Form.Control
                  type="text"
                  name="staffcategory"
                  value={staffDetails.staffcategory}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="staffworkingstatus">
                <Form.Label>Working Status</Form.Label>
                <Form.Control
                  type="text"
                  name="staffworkingstatus"
                  value={staffDetails.staffworkingstatus}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="staffsalarytdate">
                <Form.Label>Salary Date</Form.Label>
                <Form.Control
                  type="text"
                  name="staffsalarytdate"
                  value={staffDetails.staffsalarytdate}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="staffpaymentstatus">
                <Form.Label>Payment Status</Form.Label>
                <Form.Control
                  type="text"
                  name="staffpaymentstatus"
                  value={staffDetails.staffpaymentstatus}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button type="submit" variant="success" style={{ width: '100%' }}>
                {editingStaff ? 'Update Staff' : 'Create Staff'}
              </Button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
