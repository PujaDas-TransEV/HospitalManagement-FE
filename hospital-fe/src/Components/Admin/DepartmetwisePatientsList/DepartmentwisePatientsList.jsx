import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaHeart, FaBrain, FaUserMd, FaSyringe, FaStethoscope } from 'react-icons/fa';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './DepartmentwisePatientList.css'


const PatientListPage = () => {
  const { specialization } = useParams(); // Get the specialization from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [patients, setPatients] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]); // Holds doctor details (name and appointment time)
  const [admissionDetails, setAdmissionDetails] = useState({}); // Holds admission details (admit status, room number, etc.)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define a mapping for specialization icons
  const specializationIcons = {
    cardiology: <FaHeart />,
    neurology: <FaBrain />,
    surgery: <FaUserMd />,
    dermatology: <FaSyringe />,
    general: <FaStethoscope />,
  };

  // Fetch patients based on the specialization
  const fetchPatients = () => {
    setLoading(true); // Start loading when the component mounts or specialization changes
    setError(null); // Clear previous errors

    if (!specialization) {
      setError('Specialization is required.');
      setLoading(false);
      return;
    }

    // Create FormData object to send doctorspecialization as multipart/form-data
    const formData = new FormData();
    formData.append('doctorspecialization', specialization);

    // Fetch the patients data for the specific specialization
    fetch('http://192.168.0.106:5000/patientview', {
      method: 'POST',
      body: formData, // Send FormData as the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error); // Show API error if returned
        } else if (Array.isArray(data.patients) && data.patients.length === 0) {
          setError('No patients available for this specialization.');
        } else {
          setPatients(data.patients); // Set the fetched patients data to the state
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('An error occurred while fetching patients. Please try again.');
        setLoading(false);
      });
  };

  // Fetch doctor details (fullname and appointment_time) based on doctor ID
  const fetchDoctorDetails = (doctorIds) => {
    if (doctorIds.length === 0) return;

    Promise.all(
      doctorIds.map((doctorId) => {
        const formData = new FormData();
        formData.append('doctorid', doctorId); // Send doctorid

        return fetch('http://192.168.0.106:5000/doctors/getbyid', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => ({
            fullname: data.data?.fullname || 'Unknown', // Doctor's full name
            appointment_time: data.data?.appointment_time || 'Not available', // Doctor's appointment time
          }));
      })
    )
      .then((doctorData) => setDoctorDetails(doctorData))
      .catch((error) => console.error('Error fetching doctor details:', error));
  };

  // Fetch admission details based on patient UID (used as patientid)
  const fetchAdmissionDetails = (patientUids) => {
    Promise.all(
      patientUids.map((patientUid) => {
        const formData = new FormData();
        formData.append('patientid', patientUid); // Send the UID (which is used as patientid)

        return fetch('http://192.168.0.106:5000/ops/patientadmitstatus', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => ({
            patientUid,
            admitstatus: data.data?.admitstatus || 'Not admitted',
            room_number: data.data?.room_number || 'Not available',
            room_type: data.data?.room_type || 'Not available',
            wardname: data.data?.wardname || 'Not available',
            wardemail: data.data?.wardemail || 'Not available',
          }))
          .catch((error) => {
            console.error('Error fetching admission details for patient UID:', patientUid);
            return { patientUid, error: 'Error fetching admission details' };
          });
      })
    )
      .then((admissionData) => {
        const admissionDetailsObj = admissionData.reduce((acc, detail) => {
          acc[detail.patientUid] = detail;
          return acc;
        }, {});
        setAdmissionDetails(admissionDetailsObj);
      })
      .catch((error) => {
        console.error('Error fetching admission details:', error);
      });
  };

  useEffect(() => {
    fetchPatients(); // Fetch patients when component mounts or specialization changes
  }, [specialization]);

  useEffect(() => {
    if (patients.length > 0) {
      const patientUids = patients.map((patient) => patient.uid); // Use 'uid' as the patient ID from patientview API
      fetchAdmissionDetails(patientUids); // Fetch admission details for each patient using 'uid'
    }
  }, [patients]);

  useEffect(() => {
    if (patients.length > 0) {
      const doctorIds = [...new Set(patients.map((patient) => patient.doctorid))];
      fetchDoctorDetails(doctorIds); // Fetch doctor details based on doctorIds
    }
  }, [patients]);

  return (
    <div className="manage-patients-container">
      <AdminNavbar />
      <div className="manage-patients-content">
        <AdminSidebar />
        <div className="patient-list-page-container">
          <h2>
            {specialization ? specialization.charAt(0).toUpperCase() + specialization.slice(1) : 'Patients'} List
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  <h3 style={{ marginLeft: '150px' }}>
                    {specializationIcons[specialization] || <FaStethoscope />} {specialization.charAt(0).toUpperCase() + specialization.slice(1)}
                  </h3>
                </Col>
              </Row>

              <Table striped bordered hover>
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
                  {patients.length > 0 ? (
                    patients.map((patient, index) => {
                      const admissionData = admissionDetails[patient.uid] || {}; // Use 'uid' as the patient ID
                      return (
                        <tr key={index}>
                          <td>{patient.firstname} {patient.lastname}</td>
                          <td>{patient.age}</td>
                          <td>{patient.gender}</td>
                          <td>{patient.bloodgroup}</td>
                          <td>{patient.phonenumber}</td>
                          <td>{patient.email}</td>
                          <td>{doctorDetails[index]?.fullname || 'Unknown'}</td>
                          <td>{patient.appointment_time}</td>
                          <td>{admissionData.admitstatus || 'Not available'}</td>
                          <td>{admissionData.room_number || 'Not available'}</td>
                          <td>{admissionData.room_type || 'Not available'}</td>
                          <td>{admissionData.wardname || 'Not available'}</td>
                          <td>{admissionData.wardemail || 'Not available'}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="13">No patients available for this specialization.</td>
                    </tr>
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
