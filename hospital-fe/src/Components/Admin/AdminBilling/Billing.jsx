import React, { useState } from 'react';
import { FaSearch, FaEye, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
const sampleBills = [
  {
    billid: 'B1001',
    patientname: 'John Doe',
    billdate: '2025-06-01',
    totalamount: 500,
    paidamount: 500,
    status: 'Paid',
  },
  {
    billid: 'B1002',
    patientname: 'Jane Smith',
    billdate: '2025-06-03',
    totalamount: 700,
    paidamount: 300,
    status: 'Pending',
  },
  {
    billid: 'B1003',
    patientname: 'Alice Johnson',
    billdate: '2025-06-04',
    totalamount: 1200,
    paidamount: 1200,
    status: 'Paid',
  },
];

const AdminBillingPageStatic = () => {
  const [searchId, setSearchId] = useState('');
  const [bills, setBills] = useState(sampleBills);
const navigate = useNavigate();
  const handleSearch = () => {
    if (!searchId.trim()) {
      alert('Enter Patient ID or Bill ID');
      return;
    }
    const filtered = sampleBills.filter(
      (bill) =>
        bill.billid.toLowerCase().includes(searchId.toLowerCase()) ||
        bill.patientname.toLowerCase().includes(searchId.toLowerCase())
    );
    setBills(filtered.length ? filtered : []);
  };

  const resetSearch = () => {
    setSearchId('');
    setBills(sampleBills);
  };

  return (
    <div className="dashboard-container">
      <AdminNavbar />
      <div className="dashboard-content">
        <AdminSidebar />
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: 1000,
      margin: '20px auto',
      padding: 20,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: 20, color: '#333' }}>Billing Management</h2>

      {/* Search and New Bill buttons */}
      <div style={{ display: 'flex', marginBottom: 20, gap: 10 }}>
        <input
          type="text"
          placeholder="Search by Patient Name or Bill ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{
            flex: '1',
            padding: '8px 12px',
            fontSize: 16,
            borderRadius: 4,
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <FaSearch /> 
        </button>
        <button
          onClick={resetSearch}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
       <button
      onClick={() => navigate('/bill')} // Redirects to /bill
      style={{
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: 4,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <FaPlus /> New Bill
    </button>
      </div>

      {/* Table */}
      {bills.length === 0 ? (
        <p>No bills found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
            <tr>
              {['Bill ID', 'Patient Name', 'Date', 'Total', 'Paid', 'Status', 'Actions'].map((head) => (
                <th key={head} style={{ padding: 12, border: '1px solid #ddd', textAlign: 'left' }}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.billid} style={{ backgroundColor: 'white' }}>
                <td style={{ padding: 12, border: '1px solid #ddd' }}>{bill.billid}</td>
                <td style={{ padding: 12, border: '1px solid #ddd' }}>{bill.patientname}</td>
                <td style={{ padding: 12, border: '1px solid #ddd' }}>{bill.billdate}</td>
                <td style={{ padding: 12, border: '1px solid #ddd' }}>${bill.totalamount.toFixed(2)}</td>
                <td style={{ padding: 12, border: '1px solid #ddd' }}>${bill.paidamount.toFixed(2)}</td>
                <td style={{ padding: 12, border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    color: 'white',
                    backgroundColor: bill.status === 'Paid' ? '#28a745' : '#fd7e14',
                    fontWeight: '600',
                    fontSize: 14,
                    minWidth: 70,
                    display: 'inline-block',
                    textAlign: 'center',
                  }}>
                    {bill.status}
                  </span>
                </td>
                <td style={{ padding: 12, border: '1px solid #ddd' }}>
                  <button
                    onClick={() => alert(`View bill details for ${bill.billid}`)}
                    style={{
                      backgroundColor: '#17a2b8',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <FaEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
    </div>
  );
};

export default AdminBillingPageStatic;
