import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { jsPDF } from 'jspdf';
import PatientNavbar from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('accessToken');
  const patientId = localStorage.getItem('patientId');

  useEffect(() => {
    const fetchProfileAndAppointments = async () => {
      setLoading(true);
      setError('');

      if (!token || !patientId) {
        setError('Authentication or patient info missing');
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const profileForm = new FormData();
        profileForm.append('patientid', patientId);

        const profileRes = await fetch('http://192.168.0.105:5000/patients/profile/getbyid', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: profileForm,
        });

        if (!profileRes.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileRes.json();
        setProfile(profileData.data);

        // Fetch appointments
        const appointForm = new FormData();
        appointForm.append('patientid', patientId);

        const appointRes = await fetch('http://192.168.0.105:5000/getappoinmenthistory', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: appointForm,
        });

        if (!appointRes.ok) throw new Error('Failed to fetch appointments');
        const appointData = await appointRes.json();

        const now = new Date();
        const upcoming = (appointData.data || []).filter(
          (appt) => new Date(appt.appoinmenttime) > now
        );
        setAppointments(upcoming.slice(0, 2));
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndAppointments();
  }, [patientId, token]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true);
        setError('');
        if (!token) throw new Error('Token not found');

        const decoded = jwtDecode(token);
        const email = decoded.email;
        if (!email) throw new Error('Email not found in token');

        const response = await fetch('http://192.168.0.105:5000/billing/getbillbypatientemail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ patientemailid: email }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to fetch bills');

        const allBills = data.bills || [];
        if (allBills.length === 0) {
          setBills([]);
          return;
        }

        allBills.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setBills([allBills[0]]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [token]);

  const handleDownloadInvoice = async (billId) => {
    try {
      if (!token) throw new Error('Token not found');

      const response = await fetch('http://192.168.0.105:5000/billing/getbillbybillid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ billid: billId }),
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

      doc.save(`Invoice_${bill.bill_id}.pdf`);
    } catch (err) {
      alert(err.message || 'Error downloading invoice');
    }
  };

  return (
    <div className="dashboard-container">
      <PatientNavbar />
      <div className="dashboard-content">
        <PatientSidebar />
        <div className="main-content-patient">

          {/* Health Overview */}
          <section className="card health-card">
            <h3>Health Overview</h3>
            <div className="health-metrics">
              <div className="metric">
                <span>Blood Group</span>
                <span>{profile?.bloodgroup || 'Loading...'}</span>
              </div>
              <div className="metric">
                <span>Weight</span>
                <span>{profile?.weight ? `${profile.weight} kg` : 'Loading...'}</span>
              </div>
              <div className="metric">
                <span>Height</span>
                <span>{profile?.height ? `${profile.height} ft` : 'Loading...'}</span>
              </div>
            </div>
          </section>

          {/* Upcoming Appointments */}
          <section className="card appointments-card">
            <h3>Upcoming Appointments</h3>
            <ul>
              {appointments.length > 0 ? (
                appointments.map((appt, idx) => {
                  const dateObj = new Date(appt.appoinmenttime);
                  return (
                    <li key={idx}>
                      Doctor: {appt.doctor_fullname || 'Loading...'} | Date: {dateObj.toLocaleDateString()} | Time: {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </li>
                  );
                })
              ) : (
                <li>Loading upcoming appointments...</li>
              )}
            </ul>
          </section>

          {/* Recent Messages */}
          <section className="card messages-card">
            <h3>Recent Messages</h3>
            {appointments.length > 0 ? (
              appointments.map((appt, idx) => (
                <div key={idx} className="message">
                  <p><strong>{appt.doctor_fullname || 'Doctor'}:</strong> {appt.message || 'No message available.'}</p>
                </div>
              ))
            ) : (
              <p>Loading messages...</p>
            )}
          </section>

          {/* Most Recent Bill */}
          <section className="card bills-card">
            <h3>Most Recent Bill</h3>
            {bills.length > 0 ? (
              bills.map((bill) => (
                <div key={bill.bill_id} className="bill-item">
                  <p><strong>Invoice ID:</strong> {bill.bill_id}</p>
                  <p><strong>Amount Payable:</strong> ₹{bill.final_amount_payable}</p>
                  <p><strong>Status:</strong> {bill.payment_status}</p>
                  <p><strong>Date:</strong> {new Date(bill.created_at).toLocaleDateString()}</p>
                  <button onClick={() => handleDownloadInvoice(bill.bill_id)}>Download Invoice</button>
                </div>
              ))
            ) : (
              <p>Loading bill details...</p>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
