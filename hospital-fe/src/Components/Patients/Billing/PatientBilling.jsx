
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';
import './PatientBilling.css';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
const PatientInvoicePage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const decoded = jwtDecode(token);
        const email = decoded.email;
        if (!email) throw new Error('Email not found in token');

        const response = await fetch('http://localhost:5000/billing/getbillbypatientemail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientemailid: email })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch bills');

        setBills(data.bills || []);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleDownloadInvoice = async (billId) => {
    try {
      const response = await fetch('http://localhost:5000/billing/getbillbybillid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billid: billId })
      });

      const data = await response.json();
      if (!response.ok || !data.bill) throw new Error('Failed to fetch bill details');

      const bill = data.bill;
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Patient Invoice', 15, 20);

      doc.setFontSize(12);
      doc.text(`Bill ID: ${bill.bill_id}`, 15, 30);
      doc.text(`Date: ${new Date(bill.created_at).toLocaleDateString()}`, 15, 38);

      doc.text(`Patient: ${bill.patient_name} | Age: ${bill.patient_age} | Gender: ${bill.patient_gender}`, 15, 46);
      doc.text(`Email: ${bill.patient_email}`, 15, 54);
      doc.text(`Phone: ${bill.patient_phone}`, 15, 62);

      doc.text(`Doctor: Dr. ${bill.doctor_name} (${bill.department})`, 15, 70);
      doc.text(`Treatment Type: ${bill.treatment_type}`, 15, 78);
      doc.text(`Room: ${bill.room_type} (₹${bill.room_charge})`, 15, 86);
      doc.text(`Purpose: ${bill.purpose}`, 15, 94);

      doc.setFontSize(14);
      doc.text('Charges Breakdown', 15, 106);

      doc.setFontSize(12);
      doc.text(`Medicine: ₹${bill.medicine_charge}`, 15, 114);
      doc.text(`Treatment: ₹${bill.treatment_charge}`, 15, 122);
      doc.text(`Lab: ₹${bill.lab_charge}`, 15, 130);
      doc.text(`Other Charges: ₹${bill.other_charges}`, 15, 138);
      doc.text(`Gross Total: ₹${bill.gross_total}`, 15, 146);
      doc.text(`Discount: ₹${bill.discount_amount} (${bill.discount_percent}%)`, 15, 154);
      doc.text(`Insurance Covered: ₹${bill.insurance_coverage_amount} (${bill.insurance_coverage_percent}%)`, 15, 162);
      doc.text(`Final Amount Payable: ₹${bill.final_amount_payable}`, 15, 170);

      doc.text(`Payment Method: ${bill.payment_method} | Status: ${bill.payment_status}`, 15, 178);


      doc.setFontSize(10);
      doc.text(`Notes: ${bill.notes}`, 15, 190);

      doc.save(`invoice_${bill.bill_id.slice(0, 8)}.pdf`);
    } catch (err) {
      alert('Download failed.');
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
    <div className="invoice-page">
      <h2>🧾 Your Invoices</h2>

      {loading ? (
        <p>Loading your billing details...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : bills.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Department</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.bill_id}>
                <td>{bill.bill_id.slice(0, 8)}</td>
                <td>{new Date(bill.created_at).toLocaleDateString()}</td>
                <td>{bill.doctor_name}</td>
                <td>{bill.department}</td>
                <td>{bill.final_amount_payable}</td>
                <td>{bill.payment_status}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleDownloadInvoice(bill.bill_id)}
                  >
                    📥 View Invoice
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

export default PatientInvoicePage;
