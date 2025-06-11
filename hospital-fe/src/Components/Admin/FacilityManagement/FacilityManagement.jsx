import React, { useEffect, useState } from 'react';
import { Button, Spinner, Table, Modal, Form } from 'react-bootstrap';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './FacilityManagement.css'; // Import your CSS file here

const FacilityManagementPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
  const [currentFacilityId, setCurrentFacilityId] = useState(null);
 const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [facilityDetails, setFacilityDetails] = useState(null);
  // Fetch all facilities
  const fetchFacilities = () => {
    setLoading(true);
    setError(null);

    fetch('http://192.168.0.105:5000/facilityops/getallfacility')
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setFacilities(data.data || []); 
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching facilities.');
        setLoading(false);
      });
  };

  // Fetch facilities on page load
  useEffect(() => {
    fetchFacilities();
  }, []);

  // Handle field changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Edit Facility
  const handleEditFacility = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataObj = new FormData();

    // Appending all form fields to the FormData object
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }

    formDataObj.append('facilityid', currentFacilityId);

    fetch('http://192.168.0.105:5000/facilityops/updatefacilitydata', {
      method: 'POST',
      body: formDataObj,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          alert('Facility Updated Successfully!');
          setShowEditModal(false); // Close modal after update
          fetchFacilities(); // Refresh the list of facilities
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Error updating facility.');
        setLoading(false);
      });
  };

  // Open modal to edit a facility
  const openEditModal = (facility) => {
    setCurrentFacilityId(facility.uid); // Save the facility id
    setFormData({
      department_name: facility.departmentname,
      department_details: facility.department_details,
      department_hos_id: facility.department_hos_id,
      department_head_name: facility.department_head_name,
      department_officialemail: facility.department_officialemail,
      department_official_phoneno: facility.department_official_phoneno,
      departmentstatus: facility.departmentstatus,
      department_opentime: facility.department_opentime,
      department_closetime: facility.department_closetime,
    });
    setShowEditModal(true);
  };

  // Handle Delete Facility
  const handleDeleteFacility = (facilityId) => {
    setLoading(true);
    setError(null);

    const formDataObj = new FormData();
    formDataObj.append('facilityid', facilityId);

    fetch('http://192.168.0.105:5000/facilityops/deletefacility', {
      method: 'POST',
      body: formDataObj,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          alert('Facility Deleted Successfully!');
          fetchFacilities(); // Refresh the list after delete
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Error deleting facility.');
        setLoading(false);
      });
  };



const handleViewDetails = (facilityId) => {
  setLoading(true);
  setError(null);

  const formDataObj = new FormData();
  formDataObj.append('facilityid', facilityId);

  fetch('http://192.168.0.105:5000/facilityops/getfacilitydetailsbyid', {
    method: 'POST',
    body: formDataObj,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        setError(data.error);
        setFacilityDetails(null);
        setShowDetailsModal(false);
      } else if (data.payload && data.payload.length > 0) {
        setFacilityDetails(data.payload[0]); // show first object in payload
        setShowDetailsModal(true);          // open modal to display details
      } else {
        setFacilityDetails(null);
        setError('No details found.');
        setShowDetailsModal(false);
      }
      setLoading(false);
    })
    .catch((error) => {
      setError('Error fetching facility details.');
      setLoading(false);
      setShowDetailsModal(false);
    });
};


  // Handle Add Facility (New facility creation)
  const handleAddFacility = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataObj = new FormData();

    // Appending all form fields to the FormData object
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }

    fetch('http://192.168.0.105:5000/facilityopscreate', {
      method: 'POST',
      body: formDataObj,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          alert('Facility Created Successfully!');
          setShowModal(false); // Close the modal after creation
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
          fetchFacilities(); // Refresh the list of facilities
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Error creating facility.');
        setLoading(false);
      });
  };

  return (
    <div className="facility-management-page">
      <AdminNavbar />
      <div className="facility-management-content">
        <AdminSidebar />
        <div className="container">
          <h2>Facility Management</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <Button variant="primary" onClick={() => setShowModal(true)} style={{marginLeft:'100px'}}>
            Add Facility
          </Button>

          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Table striped bordered hover className="mt-3">
              <thead style={{ backgroundColor: 'lightblue' }}>
                <tr>
                  <th>Department Name</th>
                  <th>Open Time</th>
                  <th>Close Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.length > 0 ? (
                  facilities.map((facility) => (
                    <tr key={facility.uid}>
                      <td>{facility.department_name}</td>
                      <td>{facility.department_opentime || 'N/A'}</td>
                      <td>{facility.department_closetime || 'N/A'}</td>
                      <td>{facility.departmentstatus || 'N/A'}</td>
                      <td>
                        <Button variant="info" onClick={() => openEditModal(facility)}>
                          Edit
                        </Button>
                       <Button
  variant="info"
  style={{ backgroundColor: 'orange' }}
  onClick={() => handleViewDetails(facility.uid)}
>
  View Details
</Button>

                    <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Facility Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {facilityDetails ? (
      <div>
        <p><strong>Department Name:</strong> {facilityDetails["Department_Name"] || 'N/A'}</p>
        <p><strong>Details:</strong> {facilityDetails["Department_details"] || 'N/A'}</p>
        <p><strong>Hospital ID:</strong> {facilityDetails["hospital_assignedid"] || 'N/A'}</p>
        <p><strong>Department Head:</strong> {facilityDetails["Department_head_name"] || 'N/A'}</p>
        <p><strong>Official Email:</strong> {facilityDetails["Department_email"] || 'N/A'}</p>
        <p><strong>Official Phone No:</strong> {facilityDetails["Department_phoneno"] || 'N/A'}</p>
        <p><strong>Status:</strong> {facilityDetails["Department status"] || 'N/A'}</p>
        <p><strong>Open Time:</strong> {facilityDetails["Department Opentime"] || 'N/A'}</p>
        <p><strong>Close Time:</strong> {facilityDetails["Department Closetime"] || 'N/A'}</p>
        <p><strong>Created At:</strong> {new Date(facilityDetails["Created At"]).toLocaleString() || 'N/A'}</p>
      </div>
    ) : (
      <p>No details available.</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

                        <Button variant="danger" onClick={() => handleDeleteFacility(facility.uid)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No facilities found.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>

    
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title > Add Facility</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddFacility}>
            <Form.Group controlId="department_name">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                name="department_name"
                value={formData.department_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="department_details">
              <Form.Label>Department Details</Form.Label>
              <Form.Control
                type="text"
                name="department_details"
                value={formData.department_details}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="department_hos_id">
              <Form.Label>Hospital ID</Form.Label>
              <Form.Control
                type="text"
                name="department_hos_id"
                value={formData.department_hos_id}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_head_name">
              <Form.Label>Department Head</Form.Label>
              <Form.Control
                type="text"
                name="department_head_name"
                value={formData.department_head_name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_officialemail">
              <Form.Label>Official Email</Form.Label>
              <Form.Control
                type="email"
                name="department_officialemail"
                value={formData.department_officialemail}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_official_phoneno">
              <Form.Label>Official Phone No.</Form.Label>
              <Form.Control
                type="text"
                name="department_official_phoneno"
                value={formData.department_official_phoneno}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="department_status"
                value={formData.department_status}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_opentime">
              <Form.Label>Open Time</Form.Label>
              <Form.Control
                type="text"
                name="department_opentime"
                value={formData.department_opentime}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_closetime">
              <Form.Label>Close Time</Form.Label>
              <Form.Control
                type="text"
                name="department_closetime"
                value={formData.department_closetime}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating Facility...' : 'Create Facility'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Facility Modal for Edit */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Facility</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditFacility}>
            <Form.Group controlId="department_name">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                name="departmentname"
                value={formData.department_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="department_details">
              <Form.Label>Department Details</Form.Label>
              <Form.Control
                type="text"
                name="department_details"
                value={formData.department_details}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="department_hos_id">
              <Form.Label>Hospital ID</Form.Label>
              <Form.Control
                type="text"
                name="department_hos_id"
                value={formData.department_hos_id}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_head_name">
              <Form.Label>Department Head</Form.Label>
              <Form.Control
                type="text"
                name="department_head_name"
                value={formData.department_head_name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_officialemail">
              <Form.Label>Official Email</Form.Label>
              <Form.Control
                type="email"
                name="department_officialemail"
                value={formData.department_officialemail}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_official_phoneno">
              <Form.Label>Official Phone No.</Form.Label>
              <Form.Control
                type="text"
                name="department_official_phoneno"
                value={formData.department_official_phoneno}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="departmentstatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="departmentstatus"
                value={formData.department_status}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_opentime">
              <Form.Label>Open Time</Form.Label>
              <Form.Control
                type="text"
                name="department_opentime"
                value={formData.department_opentime}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="department_closetime">
              <Form.Label>Close Time</Form.Label>
              <Form.Control
                type="text"
                name="department_closetime"
                value={formData.department_closetime}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating Facility...' : 'Update Facility'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacilityManagementPage;


