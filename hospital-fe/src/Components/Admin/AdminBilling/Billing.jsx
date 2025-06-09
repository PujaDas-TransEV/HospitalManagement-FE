
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaPlus, FaEdit, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from '../Adminnavbar/AdminNavbar';
import AdminSidebar from '../Adminsidebar/AdminSidebar';
import './Billing.css';

const AdminBillingPage = () => {
  const [searchId, setSearchId] = useState('');
  const [bills, setBills] = useState([]);
  const [editBill, setEditBill] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/billing/getallbill');
      const formattedBills = response.data.bills.map(bill => ({
        ...bill,
        billid: bill.bill_id,
        patientname: bill.patient_name,
        billdate: new Date(bill.created_at).toLocaleDateString(),
        totalamount: bill.gross_total,
        final: bill.final_amount_payable,
        status: bill.payment_status,
      }));
      setBills(formattedBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  // const handleSearch = () => {
  //   if (!searchId.trim()) {
  //     alert('Enter Patient ID, Bill ID, or Email');
  //     return;
  //   }
  //   const filtered = bills.filter(
  //     (bill) =>
  //       bill.billid.toLowerCase().includes(searchId.toLowerCase()) ||
  //       bill.patientname.toLowerCase().includes(searchId.toLowerCase()) ||
  //       (bill.patient_email && bill.patient_email.toLowerCase().includes(searchId.toLowerCase()))
  //   );
  //   setBills(filtered.length ? filtered : []);
  // };

  // const resetSearch = () => {
  //   setSearchId('');
  //   fetchBills();
  // };
const handleSearch = async () => {
  const trimmedSearch = searchId.trim();
  if (!trimmedSearch) {
    alert('Enter Patient ID, Bill ID, or Email');
    return;
  }

  // If it's a valid email format, call the email-specific API
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmedSearch)) {
    try {
      const response = await axios.post('http://localhost:5000/billing/getbillbypatientemail', {
        patientemailid: trimmedSearch,
      });

      const formattedBills = response.data.bills.map((bill) => ({
        ...bill,
        billid: bill.bill_id,
        patientname: bill.patient_name,
        billdate: new Date(bill.created_at).toLocaleDateString(),
        totalamount: bill.gross_total,
        final: bill.final_amount_payable,
        status: bill.payment_status,
      }));

      setBills(formattedBills);
    } catch (error) {
      console.error('Error fetching bills by email:', error);
      alert('Failed to fetch bills for this email.');
    }
  } else {
    // Default fallback: filter from already-loaded list
    const filtered = bills.filter(
      (bill) =>
        bill.billid.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
        bill.patientname.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
        (bill.patient_email && bill.patient_email.toLowerCase().includes(trimmedSearch.toLowerCase()))
    );
    setBills(filtered.length ? filtered : []);
  }
};
const resetSearch = () => {
     setSearchId('');
     fetchBills();
   };
  
const handleView = async (billId) => {
  try {
    const response = await axios.post('http://localhost:5000/billing/getbillbybillid', { billid: billId });
    const bill = response.data.bill;

    const invoiceHTML = `
      <html>
        <head>
          <title>Invoice - ${bill.bill_id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Invoice for ${bill.patient_name}</h1>
          <table>
            <tbody>
              <tr><th>Bill ID</th><td>${bill.bill_id}</td></tr>
              <tr><th>Created At</th><td>${new Date(bill.created_at).toLocaleString()}</td></tr>
              <tr><th>Department</th><td>${bill.department}</td></tr>
              <tr><th>Doctor Name</th><td>${bill.doctor_name}</td></tr>
              <tr><th>Doctor Email</th><td>${bill.doctor_email}</td></tr>
              <tr><th>Doctor Phone</th><td>${bill.doctor_phone}</td></tr>
              <tr><th>Patient Name</th><td>${bill.patient_name}</td></tr>
              <tr><th>Patient Email</th><td>${bill.patient_email}</td></tr>
              <tr><th>Patient Phone</th><td>${bill.patient_phone}</td></tr>
              <tr><th>Patient Age</th><td>${bill.patient_age}</td></tr>
              <tr><th>Patient Gender</th><td>${bill.patient_gender}</td></tr>
              <tr><th>Purpose</th><td>${bill.purpose}</td></tr>
              <tr><th>Treatment Type</th><td>${bill.treatment_type}</td></tr>
              <tr><th>Treatment Duration (days)</th><td>${bill.treatment_duration_days || 'N/A'}</td></tr>
              <tr><th>Treatment Charge</th><td>₹${bill.treatment_charge}</td></tr>
              <tr><th>Medicine Charge</th><td>₹${bill.medicine_charge}</td></tr>
              <tr><th>Lab Charge</th><td>₹${bill.lab_charge}</td></tr>
              <tr><th>Room Type</th><td>${bill.room_type}</td></tr>
              <tr><th>Room Charge</th><td>₹${bill.room_charge}</td></tr>
              <tr><th>Other Charges</th><td>₹${bill.other_charges}</td></tr>
              <tr><th>Gross Total</th><td>₹${bill.gross_total}</td></tr>
              <tr><th>Discount Percent</th><td>${bill.discount_percent}%</td></tr>
              <tr><th>Discount Amount</th><td>₹${bill.discount_amount}</td></tr>
              <tr><th>Insurance Provider</th><td>${bill.insurance_provider}</td></tr>
              <tr><th>Insurance Coverage Percent</th><td>${bill.insurance_coverage_percent}%</td></tr>
              <tr><th>Insurance Coverage Amount</th><td>₹${bill.insurance_coverage_amount}</td></tr>
              <tr><th>Final Amount Payable</th><td>₹${bill.final_amount_payable}</td></tr>
              <tr><th>Payment Method</th><td>${bill.payment_method}</td></tr>
              <tr><th>Payment Status</th><td>${bill.payment_status}</td></tr>
             <tr><th>Status</th><td>${bill.status}</td></tr>
              <tr><th>Notes</th><td>${bill.notes}</td></tr>
              <tr><th>Qualification</th><td>${bill.qualification || 'N/A'}</td></tr>
              <tr><th>License Number</th><td>${bill.license_number || 'N/A'}</td></tr>
              <tr><th>Created By</th><td>${bill.created_by || 'N/A'}</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(invoiceHTML);
    pdfWindow.document.close();
    pdfWindow.focus();
    pdfWindow.print();
  } catch (error) {
    console.error('Error fetching bill details:', error);
  }
};

  const openEditPopup = async (billId) => {
    try {
      const response = await axios.post('http://localhost:5000/billing/getbillbybillid', { billid: billId });
      const bill = response.data.bill;
      setEditBill({ ...bill, billid: bill.bill_id }); // Explicit billid
    } catch (error) {
      console.error('Error fetching bill for edit:', error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBill(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('billid', editBill.billid);
    Object.entries(editBill).forEach(([key, value]) => {
      if (key !== 'billid') formData.append(key, value);
    });

    try {
      await axios.post('http://localhost:5000/billing/updatebill', formData);
      alert('Bill updated successfully');
      setEditBill(null);
      fetchBills();
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <AdminNavbar />
      <div className="dashboard-contenta">
        <AdminSidebar />
        <div className="billing-containera">
          <h2>Billing Management</h2>
          <div className="search-containera">
            <input
              type="text"
              placeholder="Search by Patient Name, Bill ID or Email"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            {/* <button onClick={handleSearch}><FaSearch /></button>
            <button onClick={resetSearch}>Reset</button>
            <button onClick={() => navigate('/newbill')}><FaPlus /> New Bill</button> */}
            <button onClick={handleSearch} style={{ backgroundColor: '#4CAF50', color: 'white' }}>
  <FaSearch />
</button>

<button onClick={resetSearch} style={{ backgroundColor: '#f44336', color: 'white' }}>
  Reset
</button>

<button onClick={() => navigate('/newbill')} style={{ backgroundColor: '#2196F3', color: 'white' }}>
  <FaPlus /> New Bill
</button>
          </div>

          {bills.length === 0 ? (
            <p>No bills found.</p>
          ) : (
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Patient Name</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Final Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.billid}>
                    <td>{bill.billid}</td>
                    <td>{bill.patientname}</td>
                    <td>{bill.billdate}</td>
                    <td>₹{bill.totalamount}</td>
                    <td>₹{bill.final}</td>
                    <td>{bill.status}</td>
                    <td>
                      
                      <button onClick={() => handleView(bill.billid)} style={{ backgroundColor: '#009688', color: 'white' }}>
  <FaEye /> View
</button>

<button onClick={() => openEditPopup(bill.billid)} style={{ backgroundColor: '#FF9800', color: 'white' }}>
  <FaEdit /> Edit
</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {editBill && (
            <div className="edit-popup">
              <div className="edit-popup-inner">
                <button className="close-btn" onClick={() => setEditBill(null)}><FaTimes /></button>
                <h3>Edit Bill - {editBill.bill_id}</h3>

                {/* Editable Fields */}
                {[
                  'patient_name', 'patient_email', 'patient_phone', 'patient_age', 'patient_gender',
                  'department', 'doctor_name', 'doctor_email', 'doctor_phone',
                  'insurance_provider', 'payment_method', 'payment_status', 'status', 'purpose',
                  'treatment_type', 'treatment_charge', 'medicine_charge', 'lab_charge',
                  'room_charge', 'other_charges', 'gross_total', 'final_amount_payable',
                  'discount_percent', 'discount_amount', 'insurance_coverage_percent',
                  'insurance_coverage_amount', 'notes'
                ].map(field => (
                  <div key={field}>
                    <label>{field.replace(/_/g, ' ')}:</label>
                    <input
                      name={field}
                      value={editBill[field] || ''}
                      onChange={handleEditChange}
                      type={['notes'].includes(field) ? 'textarea' : 'text'}
                    />
                  </div>
                ))}

                <button onClick={handleUpdate}>Update</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBillingPage;
