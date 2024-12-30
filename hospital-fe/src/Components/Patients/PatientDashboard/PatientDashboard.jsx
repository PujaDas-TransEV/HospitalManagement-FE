import React from 'react';
import PatientNavbar  from '../Navbar/PatientNavbar';
import PatientSidebar from '../Sidebar/PatientSidebar';


import './PatientDashboard.css'; // Styles

const PatientDashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Navbar at the top */}
      <PatientNavbar />
      
      <div className="dashboard-content">
        {/* Sidebar for navigation */}
        <PatientSidebar />
        
        {/* Main content area */}
        <div className="main-content">
        

          {/* Health Overview */}
          <section className="health-overview">
            <h3>Health Overview</h3>
            <div className="health-metrics">
              <div className="metric">
                <span>Blood Pressure</span>
                <span>120/80 mmHg</span>
              </div>
              <div className="metric">
                <span>Weight</span>
                <span>70 kg</span>
              </div>
              <div className="metric">
                <span>Cholesterol</span>
                <span>200 mg/dL</span>
              </div>
            </div>
          </section>

          {/* Upcoming Appointments */}
          <section className="appointments">
            <h3>Upcoming Appointments</h3>
            <ul>
              <li>Doctor: Dr. Smith | Date: 12 Jan 2024 | Time: 10:00 AM</li>
              <li>Doctor: Dr. Lee | Date: 15 Jan 2024 | Time: 2:00 PM</li>
            </ul>
          </section>

          {/* Recent Messages */}
          <section className="messages">
            <h3>Recent Messages</h3>
            <div className="message">
              <p><strong>Dr. Smith:</strong> Please make sure to bring your lab results on your next visit.</p>
            </div>
            <div className="message">
              <p><strong>Hospital Admin:</strong> Your upcoming appointment has been confirmed.</p>
            </div>
          </section>

          {/* Recent Bills */}
          <section className="bills">
            <h3>Recent Bills</h3>
            <ul>
              <li>Invoice #12345 - $100 - Paid</li>
              <li>Invoice #12346 - $200 - Due</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

