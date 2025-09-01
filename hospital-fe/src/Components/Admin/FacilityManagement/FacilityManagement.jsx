
import React, { useEffect, useState } from 'react';
import { Button, Spinner, Table, Form } from 'react-bootstrap';
import { FaEdit, FaEye, FaTrashAlt, FaPlus, FaSpinner, FaSave, FaTimes,FaPlusCircle, FaTimesCircle} from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './FacilityManagement.css';

const FacilityManagementPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [viewingFacility, setViewingFacility] = useState(null);

  const [formData, setFormData] = useState({
    department_name: '',
    department_details: '',
    department_hos_id: '',
    department_head_name: '',
    department_officialemail: '',
    department_official_phoneno: '',
    department_status: '',
    department_opentime: '',
    department_closetime: '',
  });

  const fetchFacilities = () => {
    setLoading(true);
    setError(null);
    fetch('https://backend.medapp.transev.site/facilityops/getallfacility')
      .then((res) => res.json())
      .then((data) => {
        setFacilities(data.data || []);
      })
      .catch(() => setError('Error fetching facilities'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFacility = (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      const apiKey = key === 'department_status' ? 'departmentstatus' : key;
      fd.append(apiKey, val);
    });

    fetch('https://backend.medapp.transev.site/facilityopscreate', {
      method: 'POST',
      body: fd,
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json().then(() => {
            alert('Facility Created Successfully!');
            setShowAddForm(false);
            setFormData({
              department_name: '',
              department_details: '',
              department_hos_id: '',
              department_head_name: '',
              department_officialemail: '',
              department_official_phoneno: '',
              department_status: '',
              department_opentime: '',
              department_closetime: '',
            });
            fetchFacilities();
          });
        } else {
          throw new Error('Failed to create facility');
        }
      })
      .catch(() => setError('Error creating facility'))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    const fd = new FormData();
    fd.append('facilityid', id);
    setLoading(true);

    fetch('https://backend.medapp.transev.site/facilityops/deletefacility', {
      method: 'POST',
      body: fd,
    })
      .then((res) => res.json())
      .then(() => {
        alert('Deleted Successfully');
        fetchFacilities();
      })
      .catch(() => setError('Error deleting facility'))
      .finally(() => setLoading(false));
  };

  const handleEdit = (facility) => {
    setEditingFacility(facility);
    setFormData({
      department_name: facility.department_name,
      department_details: facility.department_details,
      department_hos_id: facility.department_hos_id,
      department_head_name: facility.department_head_name,
      department_officialemail: facility.department_officialemail,
      department_official_phoneno: facility.department_official_phoneno,
      department_status: facility.departmentstatus || '',
      department_opentime: facility.department_opentime,
      department_closetime: facility.department_closetime,
    });
  };

  const handleUpdateFacility = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      const apiKey = key === 'department_status' ? 'departmentstatus' : key;
      fd.append(apiKey, val);
    });
    fd.append('facilityid', editingFacility.uid);

    setLoading(true);
    fetch('https://backend.medapp.transev.site/facilityops/updatefacilitydata', {
      method: 'POST',
      body: fd,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message?.includes('successfully')) {
          alert('Facility Updated Successfully!');
          setEditingFacility(null);
          setFormData({
            department_name: '',
            department_details: '',
            department_hos_id: '',
            department_head_name: '',
            department_officialemail: '',
            department_official_phoneno: '',
            department_status: '',
            department_opentime: '',
            department_closetime: '',
          });
          fetchFacilities();
        } else {
          alert('Update failed. Please check input values.');
        }
      })
      .catch(() => setError('Error updating facility'))
      .finally(() => setLoading(false));
  };

  const handleViewDetails = (id) => {
    const fd = new FormData();
    fd.append('facilityid', id);
    setLoading(true);

    fetch('https://backend.medapp.transev.site/facilityops/getfacilitydetailsbyid', {
      method: 'POST',
      body: fd,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.payload && data.payload.length > 0) {
          const raw = data.payload[0];
          const normalized = {
            department_name: raw.Department_Name,
            department_details: raw.Department_details,
            department_hos_id: raw.hospital_assignedid,
            department_head_name: raw.Department_head_name,
            department_officialemail: raw.Department_email,
            department_official_phoneno: raw.Department_phoneno,
            department_status: raw["Department status"],
            department_opentime: raw["Department Opentime"],
            department_closetime: raw["Department Closetime"],
            facilityid: raw.departmentid,
          };
          setViewingFacility(normalized);
        } else {
          alert('No details found.');
        }
      })
      .catch(() => setError('Error viewing details'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="facility-management-page">
      <AdminNavbar />
      <div className="facility-management-content">
        <AdminSidebar />
        <div className="container-facility">
          <h2>Facility Management</h2>

          {loading && <div className="loading-overlay"><FaSpinner className="spin large" /></div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <Button
            onClick={() => {
              if (!showAddForm) {
                setFormData({
                  department_name: '',
                  department_details: '',
                  department_hos_id: '',
                  department_head_name: '',
                  department_officialemail: '',
                  department_official_phoneno: '',
                  department_status: '',
                  department_opentime: '',
                  department_closetime: '',
                });
              }
              setShowAddForm(!showAddForm);
            }}
            style={{
              backgroundColor: '#28a745',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontWeight: '600',
              width: '120px',
              justifyContent: 'center',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              border: 'none',
              marginBottom: '15px'
            }}
          >
            <FaPlus style={{ marginRight: '6px' }} />
            {showAddForm ? 'Hide Form' : 'Add Facility'}
          </Button>

          {showAddForm && (
            <Form onSubmit={handleAddFacility} className="popup-form" style={{ backgroundColor: "#e0f7fa", padding: "20px", borderRadius: "8px" }}>
              {Object.entries(formData).map(([key, val]) => (
                <Form.Group key={key} controlId={key}>
                  <Form.Label>{key.replace(/_/g, ' ')}</Form.Label>
                  <Form.Control
                    type="text"
                    name={key}
                    value={val}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              ))}
              {/* <Button type="submit">Create</Button>{' '}
              <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>
                Close
              </Button> */}
              <Button
  type="submit"
  style={{
    backgroundColor: '#007bff',       // blue
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    marginRight: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100px',                   // narrower width
    justifyContent: 'center',         // center icon+text
    fontSize: '14px',
  }}
>
  <FaPlusCircle />
  Create
</Button>

<Button
  type="button"
  onClick={() => setShowAddForm(false)}
  style={{
    backgroundColor: '#dc3545',       // red
    color: '#fff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100px',                   // same width
    justifyContent: 'center',
    fontSize: '14px',
  }}
>
  <FaTimesCircle />
  Close
</Button>

            </Form>
          )}

          {editingFacility && (
            <div className="popup-card">
              <h4>Edit Facility</h4>
              <Form onSubmit={handleUpdateFacility} style={{ backgroundColor: "#e0f7fa", padding: "20px", borderRadius: "8px" }}>
                {Object.entries(formData).map(([key, val]) => (
                  <Form.Group key={key} controlId={key}>
                    <Form.Label>{key.replace(/_/g, ' ')}</Form.Label>
                    <Form.Control
                      type="text"
                      name={key}
                      value={val}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                ))}
                <div style={{ marginTop: '10px' }}>
                  <Button type="submit" variant="primary">
                    <FaSave /> Save
                  </Button>{' '}
                  <Button variant="secondary" onClick={() => setEditingFacility(null)}>
                    <FaTimes /> Cancel
                  </Button>
                </div>
              </Form>
            </div>
          )}

          {viewingFacility && (
            <div className="popup-card view-card" style={{ backgroundColor: "#e0f7fa", padding: "20px", borderRadius: "8px" }}>
              <h4>Facility Details</h4>
              {Object.entries(viewingFacility).map(([key, val]) => (
                <p key={key}>
                  <strong>{key.replace(/_/g, ' ')}:</strong> {String(val)}
                </p>
              ))}
              <Button variant="secondary" onClick={() => setViewingFacility(null)}>
                <FaTimes />
              </Button>
            </div>
          )}

          <Table striped bordered hover responsive className="mt-4">
            <thead>
              <tr>
                <th>Name</th>
                <th>Open Time</th>
                <th>Close Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((fac) => (
                <tr key={fac.uid}>
                  <td>{fac.department_name}</td>
                  <td>{fac.department_opentime}</td>
                  <td>{fac.department_closetime}</td>
                  <td>{fac.departmentstatus}</td>
                  <td>
                    <Button size="sm" className="btn-editt" onClick={() => handleEdit(fac)}><FaEdit /></Button>{' '}
                    <Button size="sm" className="btn-vieww" onClick={() => handleViewDetails(fac.uid)}><FaEye /></Button>{' '}
                    <Button size="sm" className="btn-deletee" onClick={() => handleDelete(fac.uid)}><FaTrashAlt /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Mobile Card View */}
          <div className="facility-cards d-md-none">
            {facilities.map((fac) => (
              <div key={fac.uid} className="facility-card">
                <h5>{fac.department_name}</h5>
                <p><strong>Open Time:</strong> {fac.department_opentime}</p>
                <p><strong>Close Time:</strong> {fac.department_closetime}</p>
                <p><strong>Status:</strong> {fac.departmentstatus}</p>
                <div className="card-actions">
                  <Button size="sm" className="btn-editt" onClick={() => handleEdit(fac)}><FaEdit /></Button>{' '}
                  <Button size="sm" className="btn-vieww" onClick={() => handleViewDetails(fac.uid)}><FaEye /></Button>{' '}
                  <Button size="sm" className="btn-deletee" onClick={() => handleDelete(fac.uid)}><FaTrashAlt /></Button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FacilityManagementPage;
