import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoomManagement.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RoomManagementPage = () => {
  const [wardId, setWardId] = useState(''); // to store selected ward ID
  const [wardName, setWardName] = useState(''); // to store the selected ward name
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState(''); // room type dropdown
  const [capacity, setCapacity] = useState('');
  const [roomIdSearch, setRoomIdSearch] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createdRoomId, setCreatedRoomId] = useState(''); // store created room_id
  const [allRooms, setAllRooms] = useState([]);
  const [wards, setWards] = useState([]); // to store list of wards

  const navigate = useNavigate(); // Initialize the navigate hook

  // Fetch all wards on component load
  useEffect(() => {
    fetchWards();
    fetchAllRooms();
  }, []);

  // Function to fetch all wards
  const fetchWards = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ops/getallward');
      if (response.data && Array.isArray(response.data.data)) {
        setWards(response.data.data); // save wards in state
      }
    } catch (error) {
      setErrorMessage('Failed to fetch wards.');
    }
  };

  // Function to fetch all rooms
  const fetchAllRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/ops/getallrooms');
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setAllRooms(data); // Save all rooms in state
    } catch (error) {
      setErrorMessage('Failed to fetch rooms.');
    }
  };

  // Handle Room creation
  const handleRoomCreate = async (e) => {
    e.preventDefault();

    if (!wardId || !roomNumber || !roomType || !capacity) {
      setErrorMessage('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('ward_id', wardId);
    formData.append('room_number', roomNumber);
    formData.append('room_type', roomType);
    formData.append('capacity', capacity);

    try {
      const response = await axios.post('http://localhost:5000/ops/roomfacilitycreate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setSuccessMessage(`Room created successfully! Room ID: ${response.data.uid}`);
        setCreatedRoomId(response.data.uid); // store the created room ID
        setWardId('');
        setRoomNumber('');
        setRoomType('');
        setCapacity('');
        fetchAllRooms();  // Refresh the room list after creation
      }
    } catch (error) {
      setErrorMessage('Failed to create room. Please try again.');
    }
  };

  // Handle search for room by ID
  const handleSearchByRoomId = async () => {
    if (!roomIdSearch) {
      setErrorMessage('Please enter a Room ID.');
      return;
    }

    const formData = new FormData();
    formData.append('roomid', roomIdSearch);

    try {
      const response = await axios.post('http://localhost:5000/ops/getroombyid', formData);
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        setRoomDetails(response.data.data[0]);
        setErrorMessage('');
      } else {
        setErrorMessage('Room not found.');
        setRoomDetails(null); // Reset room details if not found
      }
    } catch (error) {
      setErrorMessage('Failed to fetch room details. Please try again.');
      setRoomDetails(null); // Reset room details on error
    }
  };

  // Handle Ward selection
  const handleWardSelect = (event) => {
    const selectedWard = wards.find(ward => ward.wardname === event.target.value);
    setWardId(selectedWard ? selectedWard.uid : '');
    setWardName(event.target.value);
  };

  // Handle Room Type selection
  const handleRoomTypeSelect = (event) => {
    setRoomType(event.target.value);
  };

  // Handle delete room
  const handleDeleteRoom = async (roomId) => {
    const formData = new FormData();
    formData.append('roomid', roomId);

    try {
      const response = await axios.post('http://localhost:5000/ops/deleteroom', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setSuccessMessage('Room deleted successfully!');
        fetchAllRooms();  // Refresh the room list after deletion
      }
    } catch (error) {
      setErrorMessage('Failed to delete room. Please try again.');
    }
  };

  // Navigate to the Patient Admission Page when button is clicked
  const handlePatientAdmissionRedirect = () => {
    navigate('/patient-admission'); // Redirect to Patient Admission page
  };

  return (
    <div className="room-management-page">
      <AdminNavbar />
      <div className="room-management-content">
        <AdminSidebar />

        <div className="container">
          <h2 className="page-title">Room Management</h2>

          {/* Error Message */}
          {errorMessage && <div className="error">{errorMessage}</div>}

          {/* Success Message */}
          {successMessage && <div className="success">{successMessage}</div>}

          {/* Patient Admission Button */}
          <div className="patient-admission-btn">
            <button onClick={handlePatientAdmissionRedirect} className="btn">
              Go to Patient Admission
            </button>
          </div>

          {/* Search Section */}
          <div className="search-section">
            <h3>Search Room by ID</h3>
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomIdSearch}
              onChange={(e) => setRoomIdSearch(e.target.value)}
            />
            <button onClick={handleSearchByRoomId} className="btn">Search</button>

            {/* Display Room Details */}
            {roomDetails && (
              <div className="room-details">
                <h4>Room Details</h4>
                <p><strong>Room ID:</strong> {roomDetails.uid}</p>
                <p><strong>Room Number:</strong> {roomDetails.room_number}</p>
                <p><strong>Room Type:</strong> {roomDetails.room_type}</p>
                <p><strong>Capacity:</strong> {roomDetails.capacity}</p>
                <p><strong>Ward ID:</strong> {roomDetails.room_ward_id}</p>
              </div>
            )}
          </div>

          {/* Room Creation Form */}
          <div className="card form-container">
            <h3>Create a New Room</h3>
            <form onSubmit={handleRoomCreate}>
              <div className="form-group">
                <label htmlFor="wardId">Ward Name</label>
                <select
                  id="wardId"
                  value={wardName}
                  onChange={handleWardSelect}
                >
                  <option value="">Select Ward</option>
                  {wards.map((ward) => (
                    <option key={ward.uid} value={ward.wardname}>
                      {ward.wardname} - {ward.wardlocation} ({ward.capacity} beds)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="roomType">Room Type</label>
                <select
                  id="roomType"
                  value={roomType}
                  onChange={handleRoomTypeSelect}
                >
                  <option value="">Select Room Type</option>
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Private">Private</option>
                  <option value="Shared">Shared</option>
                  <option value="Surgical">Surgical</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="roomNumber">Room Number</label>
                <input
                  type="text"
                  id="roomNumber"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="Enter Room Number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="Enter Room Capacity"
                />
              </div>

              <button type="submit" className="btn">Create Room</button>
            </form>
          </div>

          {/* All Rooms Table */}
          <div className="card all-rooms-container">
            <h3>All Rooms</h3>
            <table>
              <thead>
                <tr>
                  <th>Room ID</th>
                  <th>Room Number</th>
                  <th>Room Type</th>
                  <th>Capacity</th>
                  <th>Actions</th> {/* Add Actions column */}
                </tr>
              </thead>
              <tbody>
                {allRooms.map((room) => (
                  <tr key={room.uid}>
                    <td>{room.uid}</td>
                    <td>{room.room_number}</td>
                    <td>{room.room_type}</td>
                    <td>{room.capacity}</td>
                    <td>
                      {/* Delete button */}
                      <button
                        className="btn delete-btn"
                        onClick={() => handleDeleteRoom(room.uid)} // Pass room id for deletion
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManagementPage;
