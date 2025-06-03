import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Table } from 'react-bootstrap';
import './EquipmentManagement.css'; // Make sure to add the CSS file for styling
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const EquipmentManagementPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState({
    equipmentname: '',
    equipmentdetails: '',
    vendorname: '',
    vendordetails: '',
    equipmentvendorassoid: '',
    purchasedat: '',
    quantity: '',
    equipmentprice: '',
    totalgst: '',
    totaltax: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [searchID, setSearchID] = useState('');
  const [searchedEquipment, setSearchedEquipment] = useState(null); // state to store searched equipment

  const [editingEquipment, setEditingEquipment] = useState(null);

  useEffect(() => {
    // Fetch all equipment on page load
    fetchEquipments();
  }, []);

  const fetchEquipments = () => {
    fetch('http://localhost:5000/ops/getallequipment')
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'All equipment data hasbeen fetched successfully') {
          setEquipments(data.data); // Update state with all equipment
        } else {
          setError('Error fetching equipment list');
        }
      })
      .catch((error) => {
        setError('An error occurred while fetching equipment');
      });
  };

  const searchEquipmentByID = () => {
    // Make a fetch request to get equipment details by ID or any other parameter
    const formData = new FormData();
    formData.append('equipid', searchID);

    fetch('http://localhost:5000/ops/getallequipmentbyid', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setSearchedEquipment(data.data); // Store searched equipment
        } else {
          setError('No equipment found with this ID');
          setSearchedEquipment(null);
        }
      })
      .catch((error) => {
        setError('An error occurred while fetching equipment by ID');
        setSearchedEquipment(null);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEquipmentDetails({ ...equipmentDetails, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!Object.values(equipmentDetails).every((val) => val !== '')) {
      setError('All fields are required!');
      return;
    }

    const formData = new FormData();
    Object.keys(equipmentDetails).forEach((key) => {
      formData.append(key, equipmentDetails[key]);
    });

    fetch('http://localhost:5000/ops/createequipment', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setSuccess('Equipment created successfully!');
          setEquipmentDetails({
            equipmentname: '',
            equipmentdetails: '',
            vendorname: '',
            vendordetails: '',
            equipmentvendorassoid: '',
            purchasedat: '',
            quantity: '',
            equipmentprice: '',
            totalgst: '',
            totaltax: '',
          });
          fetchEquipments(); // Refresh equipment list
        } else {
          setError(data.error || 'Equipment created successfully');
        }
      })
      .catch((error) => {
        setError('An error occurred while creating equipment');
      });
  };

  const handleEditEquipment = (equipment) => {
    setEquipmentDetails(equipment);
    setEditingEquipment(equipment.uid); // Set the ID of the equipment being edited
    setShowForm(true); // Open the form to edit equipment
  };

  const handleUpdateEquipment = (e) => {
    e.preventDefault();
    if (!editingEquipment) return;

    const formData = new FormData();
    formData.append('equipmentid', editingEquipment);
    Object.keys(equipmentDetails).forEach((key) => {
      formData.append(key, equipmentDetails[key]);
    });

    fetch('http://localhost:5000/ops/updatedata', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setSuccess('Equipment updated successfully!');
          fetchEquipments(); // Refresh the equipment list
          setEditingEquipment(null); // Clear editing state
          setShowForm(false); // Close the form
        } else {
          setError(data.error || 'Error updating equipment');
        }
      })
      .catch((error) => {
        setError('An error occurred while updating equipment');
      });
  };

  const handleDeleteEquipment = (equipmentID) => {
    const formData = new FormData();
    formData.append('equipmentid', equipmentID); // Append the equipment ID to the form data
  
    fetch('http://localhost:5000/ops/deleteequipment', {
      method: 'POST',
      body: formData, // Send the form data in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setSuccess('Equipment deleted successfully!');
          fetchEquipments(); // Refresh the equipment list
        } else {
          setError(data.error || 'Error deleting equipment');
        }
      })
      .catch((error) => {
        setError('An error occurred while deleting equipment');
      });
  };
  

  return (
    <div className="facility-management-page">
      <AdminNavbar />
      <div className="facility-management-content">
        <AdminSidebar />
        <div className="equipment-management-container">
          <h2>Equipment Management</h2>

          {/* Search functionality */}
          <div className="search-section">
            <Form inline onSubmit={(e) => { e.preventDefault(); searchEquipmentByID(); }}>
              <Form.Control
                type="text"
                placeholder="Search by Equipment ID"
                value={searchID}
                onChange={(e) => setSearchID(e.target.value)}
                style={{ width: '250px', marginRight: '10px' }}
              />
              <Button type="submit" variant="primary" style={{marginLeft:'100px',width:'150px'}}>
                Search
              </Button>
            </Form>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

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

          <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
            style={{ marginBottom: '20px',marginLeft:'100px' }}
          >
            {showForm ? 'Cancel' : 'Create Equipment'}
          </Button>

          {/* Display the list of all equipment */}
          <Table striped bordered hover className="equipment-table">
            <thead>
              <tr>
                <th>Equipment Id</th>
                <th>Equipment Name</th>
                <th>Equipment Details</th>
                <th>Vendor Name</th>
                <th>Vendor Details</th>
                <th>Vendor  Id</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Gst</th>
                <th>Total Tax</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((equipment) => (
                <tr key={equipment.uid}>
                  <td>{equipment.uid}</td>
                  <td>{equipment.equipmentname}</td>
                  <td>{equipment.equipmentdetails}</td>
                  <td>{equipment.vendorname}</td>
                  <td>{equipment.vendordetails}</td>
                  <td>{equipment.equipmentvendorassoid}</td>
                  <td>{equipment.quantity}</td>
                  <td>{equipment.equipmentprice}</td>
                  <td>{equipment.totalgst}</td>
                  <td>{equipment.totaltax}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleEditEquipment(equipment)}
                    >
                      Edit
                    </Button>
                    {' '}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteEquipment(equipment.uid)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Conditional rendering of the form for creating/updating equipment */}
          {showForm && (
            <Form onSubmit={editingEquipment ? handleUpdateEquipment : handleFormSubmit}>
              <Form.Group controlId="equipmentname">
                <Form.Label>Equipment Name</Form.Label>
                <Form.Control
                  type="text"
                  name="equipmentname"
                  value={equipmentDetails.equipmentname}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="equipmentdetails">
                <Form.Label>Equipment Details</Form.Label>
                <Form.Control
                  type="text"
                  name="equipmentdetails"
                  value={equipmentDetails.equipmentdetails}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="vendorname">
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control
                  type="text"
                  name="vendorname"
                  value={equipmentDetails.vendorname}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="vendordetails">
                <Form.Label>Vendor Details</Form.Label>
                <Form.Control
                  type="text"
                  name="vendordetails"
                  value={equipmentDetails.vendordetails}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="equipmentvendorassoid">
                <Form.Label>Vendor Association ID</Form.Label>
                <Form.Control
                  type="text"
                  name="equipmentvendorassoid"
                  value={equipmentDetails.equipmentvendorassoid}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="purchasedat">
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                  type="date"
                  name="purchasedat"
                  value={equipmentDetails.purchasedat}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={equipmentDetails.quantity}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="equipmentprice">
                <Form.Label>Equipment Price</Form.Label>
                <Form.Control
                  type="number"
                  name="equipmentprice"
                  value={equipmentDetails.equipmentprice}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="totalgst">
                <Form.Label>Total GST</Form.Label>
                <Form.Control
                  type="number"
                  name="totalgst"
                  value={equipmentDetails.totalgst}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group controlId="totaltax">
                <Form.Label>Total Tax</Form.Label>
                <Form.Control
                  type="number"
                  name="totaltax"
                  value={equipmentDetails.totaltax}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button type="submit" variant="success" style={{ width: '100%' }}>
                {editingEquipment ? 'Update Equipment' : 'Create Equipment'}
              </Button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

 export default EquipmentManagementPage;

