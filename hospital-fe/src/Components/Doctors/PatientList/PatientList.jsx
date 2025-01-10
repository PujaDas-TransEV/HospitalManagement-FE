import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Row, Col } from 'react-bootstrap';
import {jwtDecode} from 'jwt-decode'; // Ensure jwt-decode is installed
import { FaStethoscope } from 'react-icons/fa';
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar'; // Assuming this is your navbar component
import Doctorsidebar from '../DoctorSidebar/Doctorsidebar'; // Assuming this is your sidebar component
import { useNavigate } from 'react-router-dom';
import './PatientList.css';

const DoctorPatientListPage = () => {
  const navigate = useNavigate(); // Use the navigate hook
  const [patients, setPatients] = useState([]); // State to store patients
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorId, setDoctorId] = useState(null); // State to store doctorId

  // Fetch doctorId from the access token and decode it
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const accessToken = localStorage.getItem('accessToken'); // Get the token from localStorage

      if (!accessToken) {
        navigate('/login'); // Redirect if no token is found in localStorage
        return;
      }

      try {
        // Decode the access token to get doctorId (assuming 'doctorid' is the key in your token)
        const decodedToken = jwtDecode(accessToken);
        const doctorId = decodedToken.doctorid; // Adjust the key name based on your token structure

        setDoctorId(doctorId); // Set doctorId from the decoded token
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login'); // Redirect to login if token decoding fails
      }
    };

    fetchDoctorProfile();
  }, [navigate]); // Ensure that `navigate` is included in the dependency array

  // Fetch patients when doctorId is available
  useEffect(() => {
    if (doctorId) {
      // Fetch all patients for the doctor
      const formData = new FormData();
      formData.append('doctorid', doctorId); // Append doctorId to form data

      fetch('http://localhost:5000/patientview', {
        method: 'POST',
        body: formData, // Send the form data with doctorId
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.patients) {
            setPatients(data.patients); // Set the patients data
            setLoading(false);
          } else {
            setError('No patients found for this doctor.');
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching patients:', error);
          setError('An error occurred while fetching patients.');
          setLoading(false);
        });
    }
  }, [doctorId]); // Re-fetch patients whenever doctorId changes

  return (
    <div className="dashboard-container">
      <DoctorNavbar />
      <div className="dashboard-content">
        <Doctorsidebar />
        <div className="doctor-patient-list-page-container">
          <h2>
            <FaStethoscope /> Patients List
          </h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <>
              <Row className="mb-3">
                <Col>
                  <h3>Patients List</h3>
                </Col>
              </Row>

              <Table striped bordered hover style={{ width: '80%', margin: 'auto' }}>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Blood Group</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Appointment Time</th>
                    <th>Specialization</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length > 0 ? (
                    patients.map((patient) => (
                      <tr key={patient.uid}>
                        <td>{patient.firstname} {patient.lastname}</td>
                        <td>{patient.age}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.bloodgroup}</td>
                        <td>{patient.phonenumber}</td>
                        <td>{patient.email}</td>
                        <td>{new Date(parseInt(patient.appointment_time)).toLocaleString()}</td>
                        <td>{patient.doctorspecialization}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No patients available for this doctor.</td>
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

export default DoctorPatientListPage;

