import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode for decoding the token
import './AppointmentManagement.css'; // Create appropriate styles for this page
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

// Dummy data for departments
const departments = [
  { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
  { id: 'neurology', name: 'Neurology', icon: '🧠' },
  { id: 'orthopedics', name: 'Orthopedics', icon: '💪' },
  { id: 'dermatology', name: 'Dermatology', icon: '🧴' },
  { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
  { id: 'surgery', name: 'Surgery', icon: '🔪' },
];

const AdminAppointments = () => {
  const navigate = useNavigate();
  const { departmentId } = useParams();  // Capture departmentId from URL for department-wise routing
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    department: departmentId || '',  // Set default department based on URL
    doctor: '',
    patient: '',
    date: '',
    time: '',
    details: '',
  });

  const [selectedDepartment, setSelectedDepartment] = useState(departmentId || ''); // State to track selected department
  const [selectedAppointment, setSelectedAppointment] = useState(null); // To handle appointment edit
  const [isEditing, setIsEditing] = useState(false); // To track if editing is happening
  const [doctors, setDoctors] = useState([]); // State to store doctors for the selected department
  const [appointmentStatus, setAppointmentStatus] = useState(['Confirmed', 'Completed', 'Cancelled']); // Status options

  // Fetch admin profile from localStorage and decode the token
  useEffect(() => {
    const fetchAdminProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/admin/login'); // Redirect if no token is found in localStorage
        return;
      }
      try {
        const decodedToken = jwtDecode(accessToken);
        const adminId = decodedToken.userid;  // Assuming 'userid' is the key in your token
        console.log('Admin ID:', adminId);
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/admin/login'); // Redirect to login if token decoding fails
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  // Fetch all appointments (not limited to specific department)
  useEffect(() => {
    fetch('http://localhost:5000/getallappoinment', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setAppointments(data.data); // Assuming `data.data` contains all appointments
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch appointments');
        setLoading(false);
      });
  }, []);  // No departmentId dependency, fetch all appointments when component mounts

  // Fetch doctors for the selected department
  useEffect(() => {
    if (selectedDepartment) {
      fetch(`http://localhost:5000/getdoctors/${selectedDepartment}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          setDoctors(data.data || []); // Assuming response contains doctors data
        })
        .catch((error) => {
          console.error('Error fetching doctors:', error);
        });
    }
  }, [selectedDepartment]);

  // Handle department selection
  const handleDepartmentClick = (departmentId) => {
    setSelectedDepartment(departmentId); // Update selected department
    navigate(`/admin/appointments/${departmentId}`);
  };

  // Handle adding new appointment
  const handleAddAppointment = () => {
    if (!selectedDepartment) {
      alert('Please select a department first!');
      return;
    }
    setIsAddingAppointment(true);
  };

  // Handle input changes for new appointment
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  // Handle submitting the new appointment
  const handleSubmitNewAppointment = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('department', newAppointment.department);
    formData.append('doctor', newAppointment.doctor);
    formData.append('patient', newAppointment.patient);
    formData.append('date', newAppointment.date);
    formData.append('time', newAppointment.time);
    formData.append('details', newAppointment.details);

    fetch('http://localhost:5000/createappointment', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAppointments((prevAppointments) => [...prevAppointments, data.newAppointment]);
          setIsAddingAppointment(false);
        } else {
          alert('Failed to add appointment');
        }
      })
      .catch((error) => {
        console.error('Error creating appointment:', error);
        alert('Error creating appointment');
      });
  };

  // Handle appointment deletion
  const handleDeleteAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const formData = new FormData();
      formData.append('appoinid', appointmentId);

      fetch('http://localhost:5000/ops/appoinmentdelete', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setAppointments((prevAppointments) =>
              prevAppointments.filter((appointment) => appointment.id !== appointmentId)
            );
          } else {
            alert('Appointment Delete Successfully');
          }
        })
        .catch((error) => {
          console.error('Error deleting appointment:', error);
          alert('Failed to delete appointment');
        });
    }
  };

  // Handle appointment update
  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditing(true); // Start editing
  };

  // Handle appointment update form input changes
  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedAppointment((prevAppointment) => ({
      ...prevAppointment,
      [name]: value,
    }));
  };

  // Handle appointment status change
  const handleStatusChange = (event) => {
    const { value } = event.target;
    setSelectedAppointment((prevAppointment) => ({
      ...prevAppointment,
      appoinmentstatus: value,
    }));
  };

  // Handle appointment update submission
  const handleUpdateAppointment = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('appoinid', selectedAppointment.uid);
    formData.append('appoinmenttime', selectedAppointment.appoinmenttime);
    formData.append('appoinmentdetails', selectedAppointment.appoinmentdetails);
    formData.append('appoinmentstatus', selectedAppointment.appoinmentstatus);

    fetch('http://localhost:5000/update/appoinment', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAppointments((prevAppointments) =>
            prevAppointments.map((app) =>
              app.uid === selectedAppointment.uid ? selectedAppointment : app
            )
          );
          setIsEditing(false); // Close the edit form
        } else {
          alert('Failed to update appointment');
        }
      })
      .catch((error) => {
        console.error('Error updating appointment:', error);
        alert('Failed to update appointment');
      });
  };

  // Render appointments table
  const renderAppointmentsTable = (appointments) => {
    if (!appointments || appointments.length === 0) {
      return <div>No appointments found.</div>;
    }

    return (
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Department</th>
            <th>Doctor</th>
            <th>Patient</th>
            <th>Date and Time</th>
            <th>Details</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.uid}>
              <td>{appointment.uid}</td>
              <td>{appointment.department || "N/A"}</td>
              <td>{appointment.doctor_fullname || "N/A"}</td>
              <td>{appointment.patient_firstname} {appointment.patient_lastname}</td>
              <td>{appointment.appoinmenttime}</td>
              <td>{appointment.appoinmentdetails}</td>
              <td>{appointment.appoinmentstatus}</td>
              <td>
                <button onClick={() => handleEditAppointment(appointment)}>Edit</button>
                <button onClick={() => handleDeleteAppointment(appointment.uid)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dashboard-container">
      <AdminNavbar />
      <div className="dashboard-content">
        <AdminSidebar />

        {/* Admin Manage Appointments */}
        <div className="appointments-container">
          <h2>All Appointments</h2>

          {/* Department Filter */}
          <h3>Select Department</h3>
          <div className="departments">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="department-card"
                onClick={() => handleDepartmentClick(dept.id)}
              >
                <div className="department-icon">{dept.icon}</div>
                <div className="department-name">{dept.name}</div>
              </div>
            ))}
          </div>

          {/* Button to Add New Appointment */}
          <button onClick={handleAddAppointment}>Add New Appointment</button>

          {/* Appointment Table */}
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            renderAppointmentsTable(appointments)
          )}

          {/* Edit Appointment Form */}
          {isEditing && selectedAppointment && (
            <div className="edit-appointment-form">
              <h3>Edit Appointment</h3>
              <form onSubmit={handleUpdateAppointment}>
                <div>
                  <label>Appointment ID</label>
                  <input
                    type="text"
                    name="uid"
                    value={selectedAppointment.uid}
                    readOnly
                  />
                </div>
                <div>
                  <label>Appointment Time</label>
                  <input
                    type="text"
                    name="appoinmenttime"
                    value={selectedAppointment.appoinmenttime}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <label>Appointment Details</label>
                  <input
                    type="text"
                    name="appoinmentdetails"
                    value={selectedAppointment.appoinmentdetails}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div>
                  <label>Appointment Status</label>
                  <select
                    name="appoinmentstatus"
                    value={selectedAppointment.appoinmentstatus}
                    onChange={handleStatusChange}
                  >
                    {appointmentStatus.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
               
               
                <button 
  type="submit" 
  style={{
    backgroundColor: '#28a745', 
    color: 'white', 
    padding: '10px 20px', 
    border: 'none', 
    fontSize: '14px', 
    cursor: 'pointer', 
    borderRadius: '5px', 
      width:'120px'
  }}
>
  Update Appointment
</button>

<button 
  type="button" 
  onClick={() => setIsEditing(false)}
  style={{
    backgroundColor: '#dc3545', 
    color: 'white', 
    padding: '5px 10px', 
    fontSize: '12px', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer', 
    marginLeft: '10px', 
    width:'50px'
  }}
>
  Close
</button>

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
