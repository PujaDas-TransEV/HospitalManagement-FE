
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaPlusCircle,
  FaSearch,
  FaTrashAlt,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import './RoomManagement.css';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const RoomManagementPage = () => {
  const [wardId, setWardId] = useState('');
  const [wards, setWards] = useState([]);
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [roomIdSearch, setRoomIdSearch] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchWards();
    fetchAllRooms();
  }, []);

  const fetchWards = async () => {
    try {
      const res = await axios.get('http://192.168.0.106:5000/ops/getallward');
      setWards(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setErrorMessage('Failed to fetch wards.');
    }
  };

  const fetchAllRooms = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://192.168.0.106:5000/ops/getallrooms');
      setAllRooms(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      setErrorMessage('Failed to fetch rooms.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomCreate = async e => {
    e.preventDefault();
    if (!wardId || !roomNumber || !roomType || !capacity) {
      setErrorMessage('All fields are required.');
      return;
    }
    try {
      const fd = new FormData();
      fd.append('ward_id', wardId);
      fd.append('room_number', roomNumber);
      fd.append('room_type', roomType);
      fd.append('capacity', capacity);

      const res = await axios.post(
        'http://192.168.0.106:5000/ops/roomfacilitycreate',
        fd
      );
      if (res.status === 201) {
        setSuccessMessage(`Room created Successfully`);
        setRoomNumber('');
        setRoomType('');
        setCapacity('');
        setWardId('');
        fetchAllRooms();
        setShowCreateModal(false);
      }
    } catch {
      setErrorMessage('Failed to create room.');
    }
  };

  const handleSearchByRoomId = async () => {
    if (!roomIdSearch.trim()) {
      setErrorMessage('Please enter Room ID.');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('roomid', roomIdSearch.trim());
      const res = await axios.post(
        'http://192.168.0.106:5000/ops/getroombyid',
        fd
      );
      if (res.data.data?.length > 0) {
        setRoomDetails(res.data.data[0]);
        setErrorMessage('');
      } else {
        setRoomDetails(null);
        setErrorMessage('Room not found.');
      }
    } catch {
      setRoomDetails(null);
      setErrorMessage('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async id => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      const fd = new FormData();
      fd.append('roomid', id);
      const res = await axios.post(
        'http://192.168.0.106:5000/ops/deleteroom',
        fd
      );
      if (res.status === 200) {
        setSuccessMessage('Room deleted successfully!');
        setRoomDetails(prev => (prev?.uid === id ? null : prev));
        fetchAllRooms();
      }
    } catch {
      setErrorMessage('Failed to delete room.');
    }
  };

  return (
    <div className="room-management-wrapper">
      <AdminNavbar />
      <div className="room-management-content">
        <AdminSidebar />

        <div className="room-container">
          <h2>🏨 Room Management</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <div className="controls-row">
            <button
              className="btn create-btn"
              onClick={() => setShowCreateModal(true)}
            >
              <FaPlusCircle /> Create Room
            </button>

            <div className="search-wrapper">
              <input
                type="text"
                style={{
          backgroundColor: "#e0f7fa",
         
        }}
                placeholder="Search Room by ID"
                value={roomIdSearch}
                onChange={e => setRoomIdSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchByRoomId()}
              />
              <button
                className="btn search-btn"
                onClick={handleSearchByRoomId}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {roomDetails && (
            <div className="room-details-card">
              <button className="close-btn" onClick={() => setRoomDetails(null)}>
                &times;
              </button>
              <h3>Room Details</h3>
              <p><strong>ID:</strong> {roomDetails.uid}</p>
              <p><strong>Number:</strong> {roomDetails.room_number}</p>
              <p><strong>Type:</strong> {roomDetails.room_type}</p>
              <p><strong>Capacity:</strong> {roomDetails.capacity}</p>
              <p><strong>Ward ID:</strong> {roomDetails.room_ward_id}</p>
              <button
                className="btn btn-delete"
                onClick={() => handleDeleteRoom(roomDetails.uid)}
              >
                <FaTrashAlt /> 
              </button>
            </div>
          )}

          {loading && (
            <div className="spinner-wrapper">
              <FaSpinner className="loading-spinner" />
            </div>
          )}

          {!loading && (
            <div className="rooms-list">
              <table className="rooms-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Number</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allRooms.map(room => (
                    <tr key={room.uid}>
                      <td>{room.uid}</td>
                      <td>{room.room_number}</td>
                      <td>{room.room_type}</td>
                      <td>{room.capacity}</td>
                      <td>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDeleteRoom(room.uid)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="rooms-cards">
                {allRooms.map(room => (
                  <div key={room.uid} className="room-card">
                    <p><strong>ID:</strong> {room.uid}</p>
                    <p><strong>Number:</strong> {room.room_number}</p>
                    <p><strong>Type:</strong> {room.room_type}</p>
                    <p><strong>Capacity:</strong> {room.capacity}</p>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteRoom(room.uid)}
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showCreateModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowCreateModal(false)}
          >
            <div
              className="modal-content"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
              <h3>Create Room</h3>
              <form onSubmit={handleRoomCreate} className="create-room-form"style={{
          backgroundColor: "#e0f7fa",
          padding: "20px",
          borderRadius: "8px",
        }}>
                <label>
                  Ward:
                  <select
                    value={wardId}
                    onChange={e => setWardId(e.target.value)}
                  >
                    <option value="">Select Ward</option>
                    {wards.map(w => (
                      <option key={w.uid} value={w.uid}>
                        {w.wardname}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Room Number:
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={e => setRoomNumber(e.target.value)}
                  />
                </label>
                <label>
                  Room Type:
                  <select
                    value={roomType}
                    onChange={e => setRoomType(e.target.value)}
                  >
                    <option value="">Select Type</option>
                    {['General', 'ICU', 'Private', 'Shared', 'Emergency'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Capacity:
                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                  />
                </label>
                <button type="submit" className="btn submit-btn">
                  Create Room
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagementPage;
