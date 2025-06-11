import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa'; // Import the icons
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';

const API_URL = 'http://192.168.0.106:5000'; // Base URL

const AdminSupport = () => {
  const [supportTickets, setSupportTickets] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all support tickets
  useEffect(() => {
    const fetchSupportTickets = async () => {
      try {
        const response = await fetch(`${API_URL}/ops/getallsupport`);
        const data = await response.json();
        setSupportTickets(data.data || []);
      } catch (error) {
        setError('Error fetching support tickets.');
      }
    };

    fetchSupportTickets();
  }, []);

  // Handle deleting a support ticket
  const handleDelete = async (supportId) => {
    if (window.confirm('Are you sure you want to delete this support ticket?')) {
      const formData = new FormData();
      formData.append('supportid', supportId);

      try {
        const response = await fetch(`${API_URL}/ops/deletesupport`, {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();

        if (data.message) {
          setSupportTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.uid !== supportId)
          );
        } else {
          alert('Error deleting support ticket.');
        }
      } catch (error) {
        console.error('Error deleting support ticket:', error);
        alert('Error deleting support ticket.');
      }
    }
  };

  return (
    <div className="facility-management-page">
    <AdminNavbar />
    <div className="facility-management-content">
      <AdminSidebar />
    <div className="admin-support-container">
      <h2>All Support Tickets</h2>

      {error && <div className="error-message">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>Support ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Issue Type</th>
            <th>Message</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {supportTickets.length === 0 ? (
            <tr>
              <td colSpan="7">No support tickets available.</td>
            </tr>
          ) : (
            supportTickets.map((ticket) => (
              <tr key={ticket.uid}>
                <td>{ticket.uid}</td>
                <td>{ticket.name}</td>
                <td>{ticket.email}</td>
                <td>{ticket.phone}</td>
                <td>{ticket.issuetype}</td>
                <td>{ticket.message}</td>
                <td>
                  <button onClick={() => handleDelete(ticket.uid)}><FaTrashAlt /> Delete</button>
                
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
};

export default AdminSupport;
