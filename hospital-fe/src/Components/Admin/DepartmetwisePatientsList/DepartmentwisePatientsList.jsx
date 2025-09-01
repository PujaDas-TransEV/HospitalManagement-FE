
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Alert, Row, Col } from 'react-bootstrap';
import { FaHeart, FaBrain, FaUserMd, FaSyringe, FaStethoscope, FaHospitalUser, FaSpinner } from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './DepartmentwisePatientList.css';

const PatientListPage = () => {
  const { specialization } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [admissionDetails, setAdmissionDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const specializationIcons = {
    cardiology: <FaHeart />,
    neurology: <FaBrain />,
    surgery: <FaUserMd />,
    dermatology: <FaSyringe />,
    general: <FaStethoscope />,
  };

  // Fetch patients
  const fetchPatients = () => {
    setLoading(true);
    setError(null);
    if (!specialization) {
      setError('Specialization is required.');
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('doctorspecialization', specialization);
    fetch('https://backend.medapp.transev.site/patientview', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setPatients([]);
        } else if (Array.isArray(data.patients) && data.patients.length === 0) {
          setError('No patients available for this specialization.');
          setPatients([]);
        } else {
          setPatients(data.patients);
          setError(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('An error occurred while fetching patients. Please try again.');
        setLoading(false);
      });
  };

  // Fetch doctor details
  const fetchDoctorDetails = (doctorIds) => {
    if (doctorIds.length === 0) return;
    Promise.all(
      doctorIds.map((doctorId) => {
        const formData = new FormData();
        formData.append('doctorid', doctorId);
        return fetch('https://backend.medapp.transev.site/doctors/getbyid', {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => ({
            fullname: data.data?.fullname || 'Unknown',
            appointment_time: data.data?.appointment_time || 'Not available',
          }));
      })
    )
      .then(setDoctorDetails)
      .catch((err) => console.error('Error fetching doctor details:', err));
  };

  // Fetch admission details
  const fetchAdmissionDetails = (patientUids) => {
    Promise.all(
      patientUids.map((uid) => {
        const formData = new FormData();
        formData.append('patientid', uid);
        return fetch('https://backend.medapp.transev.site/ops/patientadmitstatus', {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => ({
            patientUid: uid,
            admitstatus: data.data?.admitstatus || 'Not admitted',
            room_number: data.data?.room_number || 'Not available',
            room_type: data.data?.room_type || 'Not available',
            wardname: data.data?.wardname || 'Not available',
            wardemail: data.data?.wardemail || 'Not available',
          }))
          .catch(() => ({ patientUid: uid, error: 'Error fetching admission details' }));
      })
    )
      .then((details) => {
        const obj = {};
        details.forEach((detail) => {
          obj[detail.patientUid] = detail;
        });
        setAdmissionDetails(obj);
      })
      .catch((err) => console.error('Error fetching admission details:', err));
  };

  useEffect(() => {
    fetchPatients();
  }, [specialization]);

  useEffect(() => {
    if (patients.length > 0) {
      const patientUids = patients.map((p) => p.uid);
      fetchAdmissionDetails(patientUids);
      const doctorIds = [...new Set(patients.map((p) => p.doctorid))];
      fetchDoctorDetails(doctorIds);
    } else {
      setDoctorDetails([]);
      setAdmissionDetails({});
    }
  }, [patients]);

  return (
    <div className="manage-patients-container">
      <AdminNavbar />
      <div className="manage-patients-content">
        <AdminSidebar />

        {/* Patient Admission Button */}
        <button
          className="patient-admission-btn"
          onClick={() => navigate('/patient-admission')}
          aria-label="Go to Patient Admission Page"
          type="button"
        >
          <FaHospitalUser size={20} />
          Patient Admission
        </button>

        <div className="patient-list-page-container">
          <h2>
            {specialization
              ? specialization.charAt(0).toUpperCase() + specialization.slice(1)
              : 'Patients'}{' '}
            List
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="modal-overlay-doctor">
              <div className="modal-content-doctor">
                <FaSpinner className="spin large" />
              </div>
            </div>
          ) : isMobile ? (
            // Mobile card view
            <div className="patient-cards-container">
              {patients.length === 0 ? (
                <p>No patients available for this specialization.</p>
              ) : (
                patients.map((patient, i) => {
                  const admissionData = admissionDetails[patient.uid] || {};
                  return (
                    <div className="patient-card" key={i}>
                      <h4>
                        {patient.firstname} {patient.lastname}
                      </h4>
                      <p>
                        <strong>Age:</strong> {patient.age}
                      </p>
                      <p>
                        <strong>Gender:</strong> {patient.gender}
                      </p>
                      <p>
                        <strong>Blood Group:</strong> {patient.bloodgroup}
                      </p>
                      <p>
                        <strong>Phone:</strong> {patient.phonenumber}
                      </p>
                      <p>
                        <strong>Email:</strong> {patient.email}
                      </p>
                      <p>
                        <strong>Doctor Name:</strong>{' '}
                        {doctorDetails[i]?.fullname || 'Unknown'}
                      </p>
                      <p>
                        <strong>Appointment Time:</strong> {patient.appointment_time}
                      </p>
                      <p>
                        <strong>Admission Status:</strong>{' '}
                        {admissionData.admitstatus || 'Not available'}
                      </p>
                      <p>
                        <strong>Room Number:</strong> {admissionData.room_number || 'N/A'}
                      </p>
                      <p>
                        <strong>Room Type:</strong> {admissionData.room_type || 'N/A'}
                      </p>
                      <p>
                        <strong>Ward Name:</strong> {admissionData.wardname || 'N/A'}
                      </p>
                      <p>
                        <strong>Ward Email:</strong> {admissionData.wardemail || 'N/A'}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            // Desktop/table view
            <>
              <Row className="mb-3">
                <Col>
                  <h3 style={{ marginLeft: '150px' }}>
                    {specializationIcons[specialization] || <FaStethoscope />}{' '}
                    {specialization.charAt(0).toUpperCase() + specialization.slice(1)}
                  </h3>
                </Col>
              </Row>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Patient Full Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Doctor Name</th>
                    <th>Appointment Time</th>
                    <th>Admission Status</th>
                    <th>Room Number</th>
                    <th>Room Type</th>
                    <th>Ward Name</th>
                    <th>Ward Email</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan="13">No patients available for this specialization.</td>
                    </tr>
                  ) : (
                    patients.map((patient, i) => {
                      const admissionData = admissionDetails[patient.uid] || {};
                      return (
                        <tr key={i}>
                          <td>
                            {patient.firstname} {patient.lastname}
                          </td>
                          <td>{patient.age}</td>
                          <td>{patient.gender}</td>
                          <td>{patient.bloodgroup}</td>
                          <td>{patient.phonenumber}</td>
                          <td>{patient.email}</td>
                          <td>{doctorDetails[i]?.fullname || 'Unknown'}</td>
                          <td>{patient.appointment_time}</td>
                          <td>{admissionData.admitstatus || 'Not available'}</td>
                          <td>{admissionData.room_number || 'Not available'}</td>
                          <td>{admissionData.room_type || 'Not available'}</td>
                          <td>{admissionData.wardname || 'Not available'}</td>
                          <td>{admissionData.wardemail || 'Not available'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientListPage;
