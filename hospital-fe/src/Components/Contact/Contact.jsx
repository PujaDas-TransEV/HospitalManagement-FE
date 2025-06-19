import React, { useState } from 'react';
import './Contact.css';
import mapImage from '../Assests/hosmap.jpeg';
import Footer from '../Footer/Footer'
const ContactPage = () => {
  // const [formData, setFormData] = useState({
  //   name: '',
  //   email: '',
  //   message: '',
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   alert('Your message has been sent successfully!');
  //   setFormData({ name: '', email: '', message: '' });
  // };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="hero-sections">
        <div className="hero-contentt">
          <h1>Contact Us</h1>
          <p>We're here to help. Reach out to us for any inquiries or assistance.</p>
        </div>
      </section>

     
<section className="contact-infos" style={{ backgroundColor: '#f9f9f9', padding: '50px 20px' }}>
  <div className="containers" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    
    <div className="contact-detailss" style={{ flex: '1 1 45%' }}>
      <div className="contact-info-boxs" style={{ backgroundColor: '#d9f2e6', padding: '30px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#006644', fontSize: '1.5rem', marginBottom: '10px' }}>Visit Us</h3>
        <p style={{ color: '#333' }}>MANI CASADONA,UNIT-10ES06,11F/04, NEWTOWN, KOLKATA-700156, INDIA</p>
      </div>

      <div className="contact-info-boxs" style={{ backgroundColor: '#ffe0cc', padding: '30px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#cc5200', fontSize: '1.5rem', marginBottom: '10px' }}>Phone</h3>
        <p style={{ color: '#333' }}>(+91) 79080 03488 / 033-4601 5366</p>
      </div>

      <div className="contact-info-boxs" style={{ backgroundColor: '#e0e7ff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h3 style={{ color: '#3b5bdb', fontSize: '1.5rem', marginBottom: '10px' }}>Email</h3>
        <p style={{ color: '#333' }}>tgwbin@gmail.com</p>
      </div>
    </div>

    <div className="maps" style={{ flex: '1 1 45%', maxWidth: '600px' }}>
      <img
        src={mapImage}
        alt="Map Location"
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  </div>
</section>

      {/* New Section: Our Team */}
      <section className="our-teams">
        <div className="containers">
          <h2>Meet Our Team</h2>
          <div className="team-memberss">
            <div className="team-members">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Dr. John Doe" />
              <h4>Dr. Himangsu Dey</h4>
              <p>Chief Surgeon</p>
            </div>
            <div className="team-members">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Nurse Jane Smith" />
              <h4>Nurse Shyamali Sen</h4>
              <p>Head Nurse</p>
            </div>
            <div className="team-members">
              <img src="https://randomuser.me/api/portraits/men/76.jpg" alt="Dr. Mike Lee" />
              <h4>Dr. Sohel Sarkar</h4>
              <p>Cardiologist</p>
            </div>
          </div>
        </div>
      </section>

   <Footer/>
      
    </div>
  );
};

export default ContactPage;
