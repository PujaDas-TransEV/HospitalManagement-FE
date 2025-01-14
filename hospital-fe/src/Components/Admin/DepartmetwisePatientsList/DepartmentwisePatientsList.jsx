
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { FaHeart, FaBrain, FaUserMd, FaSyringe, FaStethoscope } from 'react-icons/fa'; // Example icons
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const PatientListPage = () => {
  const { specialization } = useParams(); // Get the specialization from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [patients, setPatients] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]); // Holds doctor details (name and appointment time)
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
    fetch('http://localhost:5000/patientview', {
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

        return fetch('http://localhost:5000/doctors/getbyid', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => ({
            fullname: data.data?.fullname || 'Unknown', // Doctor's full name
            appointment_time: data.data?.appointment_time || 'Not available', // Doctor's appointment time (assuming this key exists in the response)
          }));
      })
    )
      .then((doctorData) => setDoctorDetails(doctorData))
      .catch((error) => console.error('Error fetching doctor details:', error));
  };

  useEffect(() => {
    fetchPatients(); // Fetch patients when component mounts or specialization changes
  }, [specialization]);

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
                    <th> Patient Full Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Doctor Name</th>
                    <th>Appointment Time</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? (
                    patients.map((patient, index) => (
                      <tr key={index}>
                        <td>{patient.firstname} {patient.lastname}</td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.bloodgroup}</td>
                        <td>{patient.phonenumber}</td>
                        <td>{patient.email}</td>
                       
                        <td>{doctorDetails[index]?.fullname || 'Unknown'}</td>
                        <td>{patient.appointment_time}</td>
                       
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No patients available for this specialization.</td>
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


