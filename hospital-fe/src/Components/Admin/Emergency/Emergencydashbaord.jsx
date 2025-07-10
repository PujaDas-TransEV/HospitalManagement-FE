
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import {
  FaPlusCircle, FaTimesCircle, FaEdit, FaTrashAlt, FaSpinner
} from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './Emergencydashboard.css';

const EmergencyDashboard = () => {
  const [cases, setCases] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientname: '',
    patientemail: '',
    patientphone: '',
    patientgurdianphone: '',
    priority: 'Medium',
    assigned_doctor: '',
    patientstatus: 'admit',
    admissiontime: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, dRes] = await Promise.all([
        axios.get('http://localhost:5000/ops/getallservices'),
        axios.get('http://localhost:5000/doctorops/getalldoctor')
      ]);
      setCases(cRes.data.data);
      setDoctors(dRes.data.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openNew = () => {
    setEditing(null);
    setForm({
      patientname: '',
      patientemail: '',
      patientphone: '',
      patientgurdianphone: '',
      priority: 'Medium',
      assigned_doctor: '',
      patientstatus: 'admit',
      admissiontime: ''
    });
    setShowForm(true);
  };

  const openEdit = c => {
    setEditing(c.uid);
    setForm({
      patientname: c.patientname,
      patientemail: c.patientemail,
      patientphone: c.patientphone,
      patientgurdianphone: c.patientgurdianphone,
      priority: c.priority,
      assigned_doctor: c.assigned_doctor,
      patientstatus: c.patientstatus,
      admissiontime: c.admissiontime || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    Object.keys(form).forEach(key => fd.append(key, form[key]));
    if (editing) fd.append('emserviceid', editing);
    const url = editing ? '/emserviceupdate' : '/emservice';

    try {
      await axios.post(`http://localhost:5000${url}`, fd);
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async uid => {
    if (!window.confirm('Delete this emergency case?')) return;
    const fd = new FormData();
    fd.append('emserviceid', uid);
    try {
      await axios.post('http://localhost:5000/ops/emservicebyid', fd);
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return {
          cardBg: '#ffe2e2',
          labelBg: '#dc3545',
          labelText: 'Critical',
          labelColor: 'white',
          borderColor: '#f5c2c7'
        };
      case 'high':
        return {
          cardBg: '#fff3cd',
          labelBg: '#ffc107',
          labelText: 'High',
          labelColor: '#212529',
          borderColor: '#ffeeba'
        };
      case 'medium':
      default:
        return {
          cardBg: '#d1ecf1',
          labelBg: '#0dcaf0',
          labelText: 'Medium',
          labelColor: 'white',
          borderColor: '#bee5eb'
        };
    }
  };

  return (
    <div className="emergency-page">
      <AdminNavbar />
      <div className="emergency-layout">
        <AdminSidebar />
        <div className="emergency-content">
          <div className="header">
            <h2>🚨 Emergency Cases</h2>
            <Button className="btn-add" onClick={openNew}>
              <FaPlusCircle /> New Admission
            </Button>
          </div>

          {loading ? (
             <div className="loading-overlay">
                         <FaSpinner className="spin large" />
                       </div>
          ) : (
            <div className="cards-wrapper">
              {cases.length === 0 && <p>No emergency cases available.</p>}
              {cases.map(c => {
                const { cardBg, labelBg, labelText, labelColor, borderColor } = getPriorityStyles(c.priority);
                return (
                  <div
                    key={c.uid}
                    className="case-card-priority"
                    style={{ backgroundColor: cardBg, border: `3px solid ${borderColor}` }}
                  >
                    <div
                      className="priority-label"
                      style={{ backgroundColor: labelBg, color: labelColor }}
                    >
                      {labelText}
                    </div>
                    <div className="case-info">
                      <h5>{c.patientname}</h5>
                      <p><strong>Status:</strong> {c.patientstatus}</p>
                      <p><strong>Doctor:</strong> {c.assigned_doctor}</p>
                      <p><strong>Admission:</strong> {c.admissiontime || '-'}</p>
                    </div>
                    <div className="card-actions-alt">
                      <FaEdit onClick={() => openEdit(c)} title="Edit" />
                   
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {showForm && (
            <div className="form-overlay">
              <div className="form-popup">
                <h3>{editing ? 'Edit Admission' : 'New Admission'}</h3>
                <Form onSubmit={handleSubmit} style={{ backgroundColor: "#e0f7fa", padding: "20px", borderRadius: "8px" }}>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="patientname" value={form.patientname} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="patientemail" type="email" value={form.patientemail} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control name="patientphone" value={form.patientphone} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Guardian Phone</Form.Label>
                    <Form.Control name="patientgurdianphone" value={form.patientgurdianphone} onChange={handleChange} required />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Control as="select" name="priority" value={form.priority} onChange={handleChange}>
                      {['Critical', 'High', 'Medium'].map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Doctor</Form.Label>
                    <Form.Control as="select" name="assigned_doctor" value={form.assigned_doctor} onChange={handleChange} required>
                      <option value="">-- Select Doctor --</option>
                      {doctors.map(d => (
                        <option key={d.uid} value={d.fullname}>{d.fullname}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" name="patientstatus" value={form.patientstatus} onChange={handleChange}>
                      {['admit', 'in-progress', 'discharged', 'treated'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Admission Time</Form.Label>
                    <Form.Control type="datetime-local" name="admissiontime" value={form.admissiontime} onChange={handleChange} />
                  </Form.Group>

                  <div className="form-buttons">
                    <Button type="submit" className="btn-save" disabled={submitting}>
                      {submitting ? (
                        <>
                          <FaSpinner className="spinner-icon spinning" /> {editing ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>
                          <FaPlusCircle /> {editing ? 'Update' : 'Create'}
                        </>
                      )}
                    </Button>
                    <Button className="btn-cancel" onClick={() => setShowForm(false)}>
                      <FaTimesCircle /> Cancel
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
