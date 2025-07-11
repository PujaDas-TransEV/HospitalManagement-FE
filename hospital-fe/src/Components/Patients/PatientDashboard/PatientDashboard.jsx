
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import jsPDF from 'jspdf';
import {
  FaHome,
  FaCalendarCheck,
  FaHistory,
  FaPrescriptionBottleAlt,
  FaFlask,
  FaFileInvoice,
  FaLifeRing,
  FaUserCircle,
  FaCog,
  FaBell
} from 'react-icons/fa';
import './PatientDashboard.css';

const FEATURE_BUTTONS = [
  { icon: FaHome, label: 'Homecare Service', path: '/home-care-service', color: '#ff6b6b' },
  { icon: FaCalendarCheck, label: 'Appointment Booking', path: '/patient-Appointments', color: '#4dabf7' },
  { icon: FaHistory, label: 'Admission History', path: '/medical-history', color: '#ffa94d' },
  { icon: FaPrescriptionBottleAlt, label: 'Prescriptions', path: '/prescription', color: '#63e6be' },
  { icon: FaFlask, label: 'Lab Report', path: '/labreport', color: '#9775fa' },
  { icon: FaFileInvoice, label: 'Invoice', path: '/invoice', color: '#ff922b' },
  { icon: FaLifeRing, label: 'Support', path: '/patient-support', color: '#74c0fc' },
  { icon: FaUserCircle, label: 'User Profile', path: '/profile', color: '#fcc419' },
  { icon: FaCog, label: 'Settings', path: '/settings', color: '#a9e34b' },
];

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [bill, setBill] = useState(null);
  const [modalAppt, setModalAppt] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('accessToken');
  const patientId = localStorage.getItem('patientId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        if (!token || !patientId) return;

  
        const formData = new FormData();
        formData.append('patientid', patientId);
        const pr = await fetch('http://192.168.0.106:5000/patients/profile/getbyid', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const pd = await pr.json();
        if (pr.ok) setProfile(pd.data);

       
        const af = new FormData();
        af.append('patientid', patientId);
        const ar = await fetch('http://192.168.0.106:5000/getappoinmenthistory', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: af,
        });
        const ad = await ar.json();
        if (ar.ok) {
          const now = new Date();
          const up = (ad.data || [])
            .filter(x => new Date(x.appoinmenttime) > now)
            .sort((a, b) => new Date(a.appoinmenttime) - new Date(b.appoinmenttime))
            .slice(0, 2);
          setAppointments(up);
        }

       
        const email = pd.data?.email;
        if (email) {
          const br = await fetch('http://192.168.0.106:5000/billing/getbillbypatientemail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ patientemailid: email }),
          });
          const bd = await br.json();
          if (br.ok && bd.bills?.length) {
            const sorted = bd.bills.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setBill(sorted[0]);
          }
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token, patientId]);

 

const downloadInvoice = async (billId) => {
  try {
    const res = await fetch('http://192.168.0.106:5000/billing/getbillbybillid', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ billid: billId }),
    });

    const { bill } = await res.json();
    if (!res.ok || !bill) throw new Error();

    const doc = new jsPDF();

    let y = 20;
    const leftMargin = 15;
    const rightMargin = 195;
    const pageHeight = doc.internal.pageSize.height;

    const checkPageSpace = (neededHeight = 20) => {
      if (y + neededHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    };

    const drawText = (text, x, yPos, opts = {}) => {
      doc.setFont('helvetica', opts.fontStyle || 'normal');
      doc.setFontSize(opts.size || 12);
      doc.setTextColor(opts.color || '#000');
      doc.text(text, x, yPos, opts.align || {});
    };


    drawText('Hospital Invoice', leftMargin, y, { size: 22, fontStyle: 'bold', color: '#1976d2' });
    y += 15;


checkPageSpace(30);
doc.setFillColor('#e3f2fd');
doc.rect(leftMargin, y, rightMargin - leftMargin, 20, 'F');
drawText(`Invoice ID: ${bill.bill_id}`, leftMargin + 5, y + 7, { color: '#1976d2' });
drawText(`Date: ${new Date(bill.created_at).toLocaleDateString()}`, leftMargin + 5, y + 14, { color: '#1976d2' });
y += 30;

    doc.setDrawColor('#1976d2');
    doc.setLineWidth(0.5);
    doc.line(leftMargin, y, rightMargin, y);
    y += 10;

 
    checkPageSpace(50);
    doc.setFillColor('#f0f4f8');
    doc.rect(leftMargin, y, rightMargin - leftMargin, 50, 'F');
    drawText('Patient Information', leftMargin + 5, y + 12, { fontStyle: 'bold', size: 14 });
    y += 25;
    drawText(`Name: ${bill.patient_name}`, leftMargin + 5, y); y += 8;
    drawText(`Age: ${bill.patient_age} | Gender: ${bill.patient_gender}`, leftMargin + 5, y); y += 8;
    drawText(`Phone: ${bill.patient_phone}`, leftMargin + 5, y); y += 8;
    drawText(`Email: ${bill.patient_email}`, leftMargin + 5, y); y += 20;


    checkPageSpace(30);
    doc.setFillColor('#fff7e6');
    doc.rect(leftMargin, y, rightMargin - leftMargin, 30, 'F');
    drawText('Doctor Information', leftMargin + 5, y + 15, { fontStyle: 'bold', size: 14, color: '#bf6d00' });
    drawText(`Dr. ${bill.doctor_name}`, leftMargin + 5, y + 27);
    y += 40;


    checkPageSpace(15);
    doc.setFillColor('#cce4f7');
    doc.rect(leftMargin, y, rightMargin - leftMargin, 12, 'F');
    drawText('Charges', leftMargin + 5, y + 9, { fontStyle: 'bold', size: 13, color: '#1976d2' });
    drawText('Amount', rightMargin - 15, y + 9, { align: 'right', fontStyle: 'bold', size: 13, color: '#1976d2' });
    y += 12;

   
    const charges = [
      ['Medicine', bill.medicine_charge],
      ['Treatment', bill.treatment_charge],
      ['Lab', bill.lab_charge],
      ['Room', bill.room_charge],
    ];

    charges.forEach(([label, amount], i) => {
      checkPageSpace(12);
      doc.setFillColor(i % 2 === 0 ? '#f5f9ff' : '#ffffff');
      doc.rect(leftMargin, y, rightMargin - leftMargin, 10, 'F');
      drawText(label, leftMargin + 5, y + 7);
      drawText(`${amount}`, rightMargin - 15, y + 7, { align: 'right' });
      y += 10;
    });

    y += 10;

   
    checkPageSpace(15);
    doc.setFillColor('#d7f0d7');
    doc.rect(leftMargin, y, rightMargin - leftMargin, 12, 'F');
    drawText('Total Summary', leftMargin + 5, y + 9, { fontStyle: 'bold', size: 13, color: '#2e7d32' });
    drawText('Amount', rightMargin - 15, y + 9, { align: 'right', fontStyle: 'bold', size: 13, color: '#2e7d32' });
    y += 12;

    const totals = [
      ['Gross Total', bill.gross_total],
      ['Discount', bill.discount_amount],
      ['Insurance Covered', bill.insurance_coverage_amount],
      ['Final Amount Payable', bill.final_amount_payable],
    ];

    totals.forEach(([label, amount], i) => {
      checkPageSpace(12);
      doc.setFillColor(i % 2 === 0 ? '#e9f5e9' : '#ffffff');
      doc.rect(leftMargin, y, rightMargin - leftMargin, 10, 'F');
      drawText(label, leftMargin + 5, y + 7);
      drawText(`${amount}`, rightMargin - 15, y + 7, { align: 'right' });
      y += 10;
    });

    y += 15;
    checkPageSpace(10);
    drawText('Thank you for choosing our service.', leftMargin, y, { size: 10, color: '#555' });

    doc.save(`Invoice_${bill.bill_id}.pdf`);

  } catch (err) {
    alert('Failed to generate invoice PDF');
    console.error(err);
  }
};

  return (
    <div className="dashboard-container-patient">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
        <div className="dashboard-main-patient">
          <header className="dashboard-header">
            <h1>Dashboard</h1>
          </header>

          {(profile?.bloodgroup || profile?.weight || profile?.height) && (
            <div className="vital-bar">
              {profile.bloodgroup && <div><strong>Blood Group:</strong> {profile.bloodgroup}</div>}
              {profile.weight && <div><strong>Weight:</strong> {profile.weight} kg</div>}
              {profile.height && <div><strong>Height:</strong> {profile.height} cm</div>}

               <FaBell
                 className="notif-icon"
                 size={20}
                
                 onClick={() => setDropdownOpen(!dropdownOpen)}
               /> 
              

              {dropdownOpen && (
                <div className="notif-dropdown">
                  <div className="dropdown-section upcoming">
                    <h4>Upcoming Appointments</h4>
                    {appointments.length ? appointments.map((a, i) => (
                     
                      <div key={i} className="dropdown-item" onClick={() => setModalAppt(a)}>
  Appointment booked on {new Date(a.appoinmenttime).toLocaleString()} with Dr. {a.doctor_fullname || 'Loading...'}
</div>

                    )) : <div className="dropdown-item">None</div>}
                  </div>
                  <div className="dropdown-section bill">
                    <h4>Recent Bill</h4>
                    {bill ? (
                      <div className="dropdown-item">
                        ₹{bill.final_amount_payable}
                        <button onClick={() => downloadInvoice(bill.bill_id)}>Download</button>
                      </div>
                    ) : <div className="dropdown-item">None</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="info-section">
            <div className="feature-grid">
              {FEATURE_BUTTONS.map((btn, idx) => {
                const Icon = btn.icon;
                return (
                  <div key={idx} className="feature-card" onClick={() => navigate(btn.path)}>
                    <div className="icon-circle" style={{ backgroundColor: btn.color }}>
                      <Icon size={28} color="#fff" />
                    </div>
                    <div className="feature-label">{btn.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {modalAppt && (
            <div className="modal-overlay" onClick={() => setModalAppt(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => setModalAppt(null)}>×</button>
                <h3>Appointment Details</h3>
                <p><strong>Date:</strong> {new Date(modalAppt.appoinmenttime).toLocaleString()}</p>
                <p><strong>Doctor:</strong> Dr. {modalAppt.doctor_fullname}</p>
                <p><strong>Message:</strong> {modalAppt.message || '‑'}</p>
              </div>
            </div>
          )}

          {error && <p className="dashboard-error">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
