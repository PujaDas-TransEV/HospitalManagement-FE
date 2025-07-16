import React, { useEffect, useState, useRef } from 'react';
import {jwtDecode} from 'jwt-decode';
import jsPDF from 'jspdf';
import { FaSpinner } from 'react-icons/fa';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import './PatientBilling.css';

const PatientInvoicePage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSurvey, setShowSurvey] = useState(null);
  const [showInvoice, setShowInvoice] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ratingnumber: 0,
    feedbacktype: '',
    feedbackmessage: ''
  });

  const invoiceRef = useRef(null);

  const feedbackOptions = [
    'Billing Experience',
    'Doctor Interaction',
    'Hospital Facility',
    'Staff Behavior',
    'Overall Satisfaction',
    'Others',
  ];

  
useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const decoded = jwtDecode(token);
        const email = decoded.email;
        if (!email) throw new Error('Email not found in token');

        const response = await fetch('http://192.168.0.106:5000/billing/getbillbypatientemail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientemailid: email })
        });

        const data = await response.json();

        // ✅ Check if no billing records found
        if (data.status === false && data.message) {
          setError(data.message);
          setBills([]);
          return;
        }

        if (!response.ok || !data.bills) {
          throw new Error(data.error || 'Failed to fetch bills');
        }

        setBills(data.bills || []);
        if (data.bills.length > 0) {
          setFormData(prev => ({
            ...prev,
            name: data.bills[0].patient_name,
            email: data.bills[0].patient_email,
          }));
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);
  const [invoiceData, setInvoiceData] = useState(null);

  const handleViewInvoice = async (billId) => {
    try {
      const response = await fetch('http://192.168.0.106:5000/billing/getbillbybillid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billid: billId })
      });

      const data = await response.json();
      if (!response.ok || !data.bill) throw new Error('Failed to fetch bill details');

      setInvoiceData(data.bill);
      setShowInvoice(billId);
    } catch (err) {
      alert('Failed to load invoice.');
      console.error(err);
    }
  };

 
 const handleDownloadInvoicePDF = () => {
    if (!invoiceData) return;
  try {
    const doc = new jsPDF();

    let y = 20;
    const leftMargin = 15;
    const rightMargin = 195;
    const pageHeight = doc.internal.pageSize.height;

    // Check if there's enough space for next block, else add new page
    const checkPageSpace = (neededHeight = 20) => {
      if (y + neededHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    // Helper to draw text with options
    const drawText = (text, x, yPos, opts = {}) => {
      doc.setFont('helvetica', opts.fontStyle || 'normal');
      doc.setFontSize(opts.size || 12);
      doc.setTextColor(opts.color || '#000');
      doc.text(text, x, yPos, opts.align || {});
    };

    // --- HEADER ---
    drawText('Hospital Invoice', leftMargin, y, { size: 22, fontStyle: 'bold', color: '#1976d2' });
    y += 15;

    // --- Invoice Info Box ---
    checkPageSpace(30);
    doc.setFillColor('#e3f2fd'); // light blue bg
    doc.rect(leftMargin, y, rightMargin - leftMargin, 30, 'F');
    drawText(`Invoice ID: ${invoiceData.bill_id}`, leftMargin + 5, y + 10, { color: '#1976d2', size: 14, fontStyle: 'bold' });
    drawText(`Date: ${new Date(invoiceData.created_at).toLocaleDateString()}`, leftMargin + 5, y + 22, { color: '#1976d2', size: 12 });
    y += 35;

    doc.setDrawColor('#1976d2');
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, rightMargin, y);
    y += 10;

    // --- Patient Information ---
    checkPageSpace(55);
    doc.setFillColor('#f0f4f8'); // light gray-blue bg
    doc.rect(leftMargin, y, rightMargin - leftMargin, 55, 'F');
    drawText('Patient Information', leftMargin + 5, y + 15, { fontStyle: 'bold', size: 14 });
    y += 25;
    drawText(`Name: ${invoiceData.patient_name}`, leftMargin + 5, y); y += 8;
    drawText(`Age: ${invoiceData.patient_age} | Gender: ${invoiceData.patient_gender}`, leftMargin + 5, y); y += 8;
    drawText(`Phone: ${invoiceData.patient_phone}`, leftMargin + 5, y); y += 8;
    drawText(`Email: ${invoiceData.patient_email}`, leftMargin + 5, y); y += 15;

    // --- Doctor Information ---
    // checkPageSpace(40);
    // doc.setFillColor('#fff7e6'); // light yellow bg
    // doc.rect(leftMargin, y, rightMargin - leftMargin, 40, 'F');
    // drawText('Doctor Information', leftMargin + 5, y + 18, { fontStyle: 'bold', size: 14, color: '#bf6d00' });
    // drawText(`Dr. ${invoiceData.doctor_name} ($invoiceData.department})`, leftMargin + 5, y + 30);
    // y += 50;
if (invoiceData.doctor_name) {
  checkPageSpace(40);
  doc.setFillColor('#fff7e6'); // light yellow bg
  doc.rect(leftMargin, y, rightMargin - leftMargin, 40, 'F');
  drawText('Doctor Information', leftMargin + 5, y + 18, { fontStyle: 'bold', size: 14, color: '#bf6d00' });
  drawText(`Dr. ${invoiceData.doctor_name} (${invoiceData.department || ''})`, leftMargin + 5, y + 30);
  y += 50;
}

    // --- Charges Header ---
    checkPageSpace(15);
    doc.setFillColor('#cce4f7'); // medium blue bg
    doc.rect(leftMargin, y, rightMargin - leftMargin, 15, 'F');
    drawText('Charges', leftMargin + 5, y + 11, { fontStyle: 'bold', size: 13, color: '#1976d2' });
    drawText('Amount ', rightMargin - 15, y + 11, { align: 'right', fontStyle: 'bold', size: 13, color: '#1976d2' });
    y += 15;

    // --- Charges Table ---
    const charges = [
      ['Medicine', invoiceData.medicine_charge],
      ['Treatment', invoiceData.treatment_charge],
      ['Lab',invoiceData.lab_charge],
      ['Room',invoiceData.room_charge],
      ['Other Charges', invoiceData.other_charges],
    ];

    charges.forEach(([label, amount], i) => {
      checkPageSpace(12);
      doc.setFillColor(i % 2 === 0 ? '#f5f9ff' : '#ffffff'); // alternating row colors
      doc.rect(leftMargin, y, rightMargin - leftMargin, 12, 'F');
      drawText(label, leftMargin + 5, y + 8);
      drawText(`${amount}`, rightMargin - 15, y + 8, { align: 'right' });
      y += 12;
    });

    y += 10;

    // --- Total Summary Header ---
    checkPageSpace(20);
    doc.setFillColor('#d7f0d7'); // light green bg
    doc.rect(leftMargin, y, rightMargin - leftMargin, 20, 'F');
    drawText('Total Summary', leftMargin + 5, y + 14, { fontStyle: 'bold', size: 14, color: '#2e7d32' });
    drawText('Amount ', rightMargin - 15, y + 14, { align: 'right', fontStyle: 'bold', size: 14, color: '#2e7d32' });
    y += 20;

    const totals = [
      ['Gross Total', invoiceData.gross_total],
      ['Discount', `${invoiceData.discount_amount} (${invoiceData.discount_percent}%)`],
      ['Insurance Covered', `${invoiceData.insurance_coverage_amount} (${invoiceData.insurance_coverage_percent}%)`],
      ['Final Amount Payable', invoiceData.final_amount_payable],
    ];

    totals.forEach(([label, amount], i) => {
      checkPageSpace(12);
      doc.setFillColor(i % 2 === 0 ? '#e9f5e9' : '#ffffff');
      doc.rect(leftMargin, y, rightMargin - leftMargin, 12, 'F');
      drawText(label, leftMargin + 5, y + 8);
      drawText(`${amount}`, rightMargin - 15, y + 8, { align: 'right' });
      y += 12;
    });

    y += 15;
    checkPageSpace(20);
    drawText(`Payment Method: ${invoiceData.payment_method}`, leftMargin, y);
    y += 10;
    drawText(`Payment Status: ${invoiceData.payment_status}`, leftMargin, y);
    y += 15;

    checkPageSpace(20);
    drawText('Notes:', leftMargin, y, { fontStyle: 'bold' });
    y += 10;
    const notes = invoiceData.notes || 'N/A';
    // Wrap notes text if too long
    const splitNotes = doc.splitTextToSize(notes, rightMargin - leftMargin - 10);
    splitNotes.forEach(line => {
      checkPageSpace(10);
      drawText(line, leftMargin + 5, y);
      y += 8;
    });

    y += 15;
    checkPageSpace(15);
    drawText('Thank you for choosing our service.', leftMargin, y, { size: 10, color: '#555' });

    // Save PDF
    doc.save(`Invoice_${invoiceData.bill_id.slice(0,8)}.pdf`);

  } catch (err) {
    alert('Failed to generate invoice PDF');
    console.error(err);
  }
};
  const handlePrintInvoice = () => {
    if (!invoiceRef.current) return;
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleSubmitSurvey = async () => {
    try {
      if (formData.feedbacktype && !formData.feedbackmessage.trim()) {
        alert('Please enter your feedback message.');
        return;
      }

      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('ratingnumber', formData.ratingnumber);
      payload.append('feedbacktype', formData.feedbacktype);
      payload.append('feedbackmessage', formData.feedbackmessage);

      const response = await fetch('http://192.168.0.106:5000/ops/surveycreate', {
        method: 'POST',
        body: payload
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Survey submission failed');

      alert('✅ Thank you for your feedback!');
      setShowSurvey(null);
      setFormData((prev) => ({
        ...prev,
        ratingnumber: 0,
        feedbacktype: '',
        feedbackmessage: ''
      }));
    } catch (err) {
      console.error(err);
      alert('Survey submission failed.');
    }
  };

  return (
    <div className="dashboard-container-billing">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
       

<div
  className="invoice-page"
  style={{
    backgroundColor: '#f4f7f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgb(0 0 0 / 0.1)',
    minHeight: loading ? '200px' : 'auto', 
    position: 'relative',
    maxWidth: '100%',
    width: '100%',
    boxSizing: 'border-box',
    overflowX: 'auto',
    maxHeight: '600px',     
    overflowY: 'auto',    
  }}
>



          <h2 style={{ color: '#004e89', marginBottom: '25px' }}>🧾 Your Invoices</h2>

          {/* Loading Spinner Overlay */}
          
 {loading && (
            <div className="loading-overlay">
              <FaSpinner className="spinner-icon" />
              {/* <p>Loading your billing details...</p> */}
            </div>
          )}
          {!loading && error && <p className="error" style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && bills.length === 0 && <p>No invoices found.</p>}

          {!loading && !error && bills.length > 0 && (
            <>
              {/* Desktop Table */}
              <table className="invoice-table desktop-table">
                <thead style={{ backgroundColor: '#0077b6', color: '#fff' }}>
                  <tr>
                    <th>Bill ID</th>
                    <th>Date</th>
                    <th>Patient Name</th>
                   
                    <th>Amount (₹)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill.bill_id}>
                      <td>{bill.bill_id.slice(0, 8)}</td>
                      <td>{new Date(bill.created_at).toLocaleDateString()}</td>
                      <td> {bill.patient_name}</td>
                      {/* <td>{bill.department}</td> */}
                      <td style={{ textAlign: 'right' }}>{bill.final_amount_payable}</td>
                      <td
                        style={{
                          color:
                            bill.payment_status.toLowerCase() === 'paid' ? 'green' : 'red',
                          textAlign: 'center'
                        }}
                      >
                        {bill.payment_status}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          style={actionBtnStyle}
                          title="View Invoice"
                          onClick={() => handleViewInvoice(bill.bill_id)}
                        >
                          📄
                        </button>
                        <button
                          style={actionBtnStyle}
                          title="Download Invoice PDF"
                          onClick={() => {
                            handleViewInvoice(bill.bill_id);
                            setTimeout(() => handleDownloadInvoicePDF(), 500);
                          }}
                        >
                          ⬇️
                        </button>
                        <button
                          style={actionBtnStyle}
                          title="Print Invoice"
                          onClick={() => {
                            handleViewInvoice(bill.bill_id);
                            setTimeout(() => handlePrintInvoice(), 500);
                          }}
                        >
                          🖨️
                        </button>
                        <button
                          style={{ ...actionBtnStyle, backgroundColor: '#028090' }}
                          title="Rate Experience"
                          onClick={() => setShowSurvey(bill.bill_id)}
                        >
                          ⭐
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="mobile-cards">
                {bills.map((bill) => (
                  <div className="invoice-card" key={bill.bill_id}>
                    <div className="card-header">
                      <span><strong>Bill ID:</strong> {bill.bill_id.slice(0, 8)}</span>
                      <span
                        className={`status-badge ${
                          bill.payment_status.toLowerCase() === 'paid' ? 'paid' : 'unpaid'
                        }`}
                      >
                        {bill.payment_status}
                      </span>
                    </div>
                    <p><strong>Date:</strong> {new Date(bill.created_at).toLocaleDateString()}</p>
                    <p><strong>Patient Name:</strong> {bill.patient_name}</p>
                    {/* <p><strong>Department:</strong> {bill.department}</p> */}
                    <p><strong>Amount:</strong> ₹{bill.final_amount_payable}</p>
                    <div className="card-actions">
                      <button
                        style={actionBtnStyle}
                        title="View Invoice"
                        onClick={() => handleViewInvoice(bill.bill_id)}
                      >
                        📄
                      </button>
                      <button
                        style={actionBtnStyle}
                        title="Download Invoice PDF"
                        onClick={() => {
                          handleViewInvoice(bill.bill_id);
                          setTimeout(() => handleDownloadInvoicePDF(), 500);
                        }}
                      >
                        ⬇️
                      </button>
                      <button
                        style={actionBtnStyle}
                        title="Print Invoice"
                        onClick={() => {
                          handleViewInvoice(bill.bill_id);
                          setTimeout(() => handlePrintInvoice(), 500);
                        }}
                      >
                        🖨️
                      </button>
                      <button
                        style={{ ...actionBtnStyle, backgroundColor: '#028090' }}
                        title="Rate Experience"
                        onClick={() => setShowSurvey(bill.bill_id)}
                      >
                        ⭐
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Invoice Modal */}
          {showInvoice && invoiceData && (
            <div className="modal-overlay" onClick={() => setShowInvoice(null)}>
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                ref={invoiceRef}
                
              >
                <button
                  onClick={() => setShowInvoice(null)}
                  className="modal-close-btn"
                  aria-label="Close invoice modal"
                >
                  ✖
                </button>
                <h3>Invoice Details</h3>
                <p><strong>Bill ID:</strong> {invoiceData.bill_id}</p>
                <p><strong>Date:</strong> {new Date(invoiceData.created_at).toLocaleDateString()}</p>
                <p><strong>Patient:</strong> {invoiceData.patient_name} ({invoiceData.patient_gender}, {invoiceData.patient_age} yrs)</p>
                <p><strong>Email:</strong> {invoiceData.patient_email}</p>
                <p><strong>Phone:</strong> {invoiceData.patient_phone}</p>
                {/* <p><strong>Doctor:</strong> Dr. {invoiceData.doctor_name} ({invoiceData.department})</p> */}
                {invoiceData.doctor_name && (
  <p><strong>Doctor:</strong> Dr. {invoiceData.doctor_name} {invoiceData.department && `(${invoiceData.department})`}</p>
)}

                <p><strong>Treatment:</strong> {invoiceData.treatment_type}</p>
                <p><strong>Room:</strong> {invoiceData.room_type} - ₹{invoiceData.room_charge}</p>
                <p><strong>Purpose:</strong> {invoiceData.purpose}</p>

                <h4>Charges</h4>
                <ul>
                  <li>Medicine: ₹{invoiceData.medicine_charge}</li>
                  <li>Treatment: ₹{invoiceData.treatment_charge}</li>
                  <li>Lab: ₹{invoiceData.lab_charge}</li>
                  <li>Other Charges: ₹{invoiceData.other_charges}</li>
                </ul>

                <p><strong>Gross Total:</strong> ₹{invoiceData.gross_total}</p>
                <p><strong>Discount:</strong> ₹{invoiceData.discount_amount} ({invoiceData.discount_percent}%)</p>
                <p><strong>Insurance Coverage:</strong> ₹{invoiceData.insurance_coverage_amount} ({invoiceData.insurance_coverage_percent}%)</p>
                <p><strong>Final Amount Payable:</strong> ₹{invoiceData.final_amount_payable}</p>
                <p><strong>Payment Method:</strong> {invoiceData.payment_method}</p>
                <p><strong>Payment Status:</strong> {invoiceData.payment_status}</p>
                <p><strong>Notes:</strong> {invoiceData.notes || 'N/A'}</p>

                <div style={{ marginTop: '20px' }}>
                  <button onClick={handleDownloadInvoicePDF} style={btnStyle}>Download PDF</button>
                  <button onClick={handlePrintInvoice} style={{ ...btnStyle, marginLeft: '10px' }}>Print</button>
                </div>
              </div>
            </div>
          )}

          {/* Survey Modal */}
          {showSurvey && (
            <div className="modal-overlay" onClick={() => setShowSurvey(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#e0f7fa', padding: '20px', borderRadius: '8px' }}>
                <button
                  onClick={() => setShowSurvey(null)}
                  className="modal-close-btn"
                  aria-label="Close survey modal"
                >
                  ✖
                </button>
                <h3>Rate Your Billing Experience</h3>
                <div className="rating-stars" style={{ fontSize: '24px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setFormData((prev) => ({ ...prev, ratingnumber: star }))}
                      style={{
                        cursor: 'pointer',
                        color: star <= formData.ratingnumber ? '#f5b301' : '#ccc',
                        marginRight: '5px',
                      }}
                      aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <label htmlFor="feedbacktype">Feedback Category:</label>
                <select
                  id="feedbacktype"
                  value={formData.feedbacktype}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feedbacktype: e.target.value }))}
                  style={{ marginBottom: '10px', width: '100%' }}
                >
                  <option value="">Select Category (optional)</option>
                  {feedbackOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label htmlFor="feedbackmessage">Your Feedback:</label>
                <textarea
                  id="feedbackmessage"
                  rows={4}
                  placeholder="Write your comments here..."
                  value={formData.feedbackmessage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, feedbackmessage: e.target.value }))}
                  style={{ width: '100%', marginBottom: '15px' }}
                />

                <button onClick={handleSubmitSurvey} style={btnStyle}>Submit Feedback</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const actionBtnStyle = {
  backgroundColor: '#0077b6',
  border: 'none',
  borderRadius: '5px',
  padding: '6px 10px',
  color: '#fff',
  margin: '0 4px',
  cursor: 'pointer',
  fontSize: '14px',
  userSelect: 'none',
};

const btnStyle = {
  padding: '8px 16px',
  borderRadius: '5px',
  backgroundColor: '#0077b6',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  userSelect: 'none',
};



export default PatientInvoicePage;
