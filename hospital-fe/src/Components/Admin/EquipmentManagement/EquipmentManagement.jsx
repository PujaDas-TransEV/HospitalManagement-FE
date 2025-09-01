
import React, { useState, useEffect } from 'react';
import {
  Button, Form, Alert, Table, Spinner, Card,
} from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaSpinner,FaRedo } from 'react-icons/fa';
import './EquipmentManagement.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const EquipmentManagementPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState({});
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [searchID, setSearchID] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
 const [searchedEquipment, setSearchedEquipment] = useState(null); 
  useEffect(() => { fetchEquipments(); }, []);

  const fetchEquipments = () => {
    setLoading(true);
    fetch('https://backend.medapp.transev.site/ops/getallequipment')
      .then(res => res.json())
      .then(data => { if (data.data) setEquipments(data.data); })
      .catch(() => setError('Error fetching data.'))
      .finally(() => setLoading(false));
  };

  const searchEquipmentByID = e => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append('equipid', searchID);
    fetch('https://backend.medapp.transev.site/ops/getallequipmentbyid', {
      method: 'POST', body: fd
    })
      .then(res => res.json())
      .then(data => setEquipments(data.data ? [data.data] : []))
      .catch(() => setError('Search failed.'))
      .finally(() => setLoading(false));
  };

  const openForm = eq => {
    if (eq) {
      setEquipmentDetails(eq);
      setEditingEquipment(eq.uid);
    } else {
      setEquipmentDetails({});
      setEditingEquipment(null);
    }
    setShowForm(true);
  };

  const handleDelete = uid => {
    const fd = new FormData();
    fd.append('equipmentid', uid);
    fetch('https://backend.medapp.transev.site/ops/deleteequipment', {
      method: 'POST', body: fd
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) { setSuccess('Deleted successfully'); fetchEquipments(); }
      })
      .catch(() => setError('Delete failed.'));
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    const url = editingEquipment
      ? 'https://backend.medapp.transev.site/ops/updatedata'
      : 'https://backend.medapp.transev.site/ops/createequipment';
    const fd = new FormData();
    if (editingEquipment) fd.append('equipmentid', editingEquipment);
    Object.entries(equipmentDetails).forEach(([k, v]) => fd.append(k, v));
    fetch(url, { method: 'POST', body: fd })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setSuccess(editingEquipment ? 'Updated Successfully!' : 'Created Successfully!');
          fetchEquipments();
          setShowForm(false);
        } else {
          setError('Save failed.');
        }
      })
      .catch(() => setError('Save error.'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="equipment-page">
      <AdminNavbar />
      <div className="equipment-content" style={{ display: 'flex' }}>
        <AdminSidebar />
        <div className="equipment-main" style={{ flex: 1, padding: '20px' }}>
          <h2>Equipment Management</h2>

<Form 
  onSubmit={searchEquipmentByID} 
  style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}
>
  <div style={{ position: 'relative', display: 'inline-block', width: '250px' }}>
    <Form.Control
      type="text"
      placeholder="Search by Equipment ID"
      value={searchID}
      onChange={e => setSearchID(e.target.value)}
      style={{
        paddingRight: '30px',
        minWidth: '200px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
      }}
    />

    {/* Search Icon Button */}
    <button
      type="submit"
      style={{
        position: 'absolute',
        right: '5px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        color: '#6c757d',
      }}
    >
      <FaSearch />
    </button>
  </div>
   <Button 
    variant="secondary" 
    onClick={() => { setSearchID(''); fetchEquipments(); }} 
    style={{ padding: '6px 12px' }}
  >
    <FaRedo/>
  </Button>
</Form>

<Button 
  variant="success" 
  onClick={() => openForm(null)} 
  style={{ 
    marginBottom: '20px', 
    display: 'flex', 
    alignItems: 'center', 
    padding: '8px 15px', 
    width: '130px',   // adjust width as needed
    justifyContent: 'center'  // center content horizontally
  }}
>
  <FaPlus style={{ marginRight: '5px' }} /> Add Equipment
</Button>



          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {loading && (
            <div className="loading-overlay">
              <FaSpinner className="spin large" />
            </div>
          )}
  {/* Display the searched equipment */}
          {searchedEquipment && (
            <>
              <h3>Searched Equipment Details</h3>
              <Table striped bordered hover className="equipment-table">
                <thead>
                  <tr>
                    <th>Equipment Id</th>
                    <th>Equipment Name</th>
                    <th>Equipment Details</th>
                    <th>Vendor Name</th>
                    <th>Vendor Details</th>
                    <th>Vendor ID</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total GST</th>
                    <th>Total Tax</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={searchedEquipment.equipmentdbid}>
                    <td>{searchedEquipment.equipmentdbid}</td>
                    <td>{searchedEquipment.equipmentname}</td>
                    <td>{searchedEquipment.equipmentdetails}</td>
                    <td>{searchedEquipment.vendorname}</td>
                    <td>{searchedEquipment.vendordetails}</td>
                    <td>{searchedEquipment.equipmentvendorassociatedid}</td>
                    <td>{searchedEquipment.quantity}</td>
                    <td>{searchedEquipment.equipmentprice}</td>
                    <td>{searchedEquipment.totalgst}</td>
                    <td>{searchedEquipment.totaltax || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </>
          )}
          {/* Popup Overlay Inline Form */}
          {showForm && (
            <div
              className="form-overlay"
              onClick={() => setShowForm(false)}
            >
              <div
                className="form-popup"
                onClick={e => e.stopPropagation()}
              >
                <h5 style={{ marginBottom: '20px' }}>
                  {editingEquipment ? 'Edit Equipment' : 'Add Equipment'}
                </h5>
                <Form onSubmit={handleFormSubmit} style={{
          backgroundColor: "#e0f7fa",
         }}>
                  {['equipmentname', 'equipmentprice', 'quantity', 'totalgst', 'totaltax', 'purchasedat'].map(k => (
                    <Form.Group controlId={k} key={k} style={{ marginBottom: '15px' }}>
                      <Form.Label style={{ textTransform: 'capitalize' }}>{k}</Form.Label>
                      <Form.Control
                        type={
                          k === 'purchasedat' ? 'date' :
                            ['equipmentprice', 'quantity', 'totalgst', 'totaltax'].includes(k) ? 'number' :
                              'text'
                        }
                        name={k}
                        value={equipmentDetails[k] || ''}
                        onChange={(e) => setEquipmentDetails(prev => ({ ...prev, [k]: e.target.value }))}
                      />
                    </Form.Group>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button type="submit" variant="primary" disabled={submitting}>
                      {submitting ? <Spinner animation="border" size="sm" /> : (editingEquipment ? 'Update' : 'Create')}
                    </Button>
                    <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </Form>
              </div>
            </div>
          )}

          {/* Table View */}
          <Table striped bordered hover responsive className="equipment-table desktop">
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Price</th><th>Qty</th><th>GST</th><th>Tax</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map(eq => (
                <tr key={eq.uid}>
                  <td>{eq.uid}</td><td>{eq.equipmentname}</td><td>{eq.equipmentprice}</td>
                  <td>{eq.quantity}</td><td>{eq.totalgst}</td><td>{eq.totaltax}</td><td>{eq.purchasedat}</td>
                  <td>
                    <FaEdit className="action-icon edit" style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => openForm(eq)} />
                    <FaTrash className="action-icon delete" style={{ cursor: 'pointer' }} onClick={() => handleDelete(eq.uid)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Mobile View */}
          <div className="equipment-cards mobile">
            {equipments.map(eq => (
              <Card key={eq.uid} className="mb-3">
                <Card.Body>
                  <Card.Title>{eq.equipmentname}</Card.Title>
                  <Card.Text>ID: {eq.uid}</Card.Text>
                  <Card.Text>Price: ₹{eq.equipmentprice}</Card.Text>
                  <Card.Text>Qty: {eq.quantity}</Card.Text>
                  <div className="card-actions">
                    <FaEdit onClick={() => openForm(eq)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                    <FaTrash onClick={() => handleDelete(eq.uid)} style={{ cursor: 'pointer' }} />
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentManagementPage;
