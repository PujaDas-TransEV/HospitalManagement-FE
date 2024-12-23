import React, { useState } from 'react';
import './Contact.css'; // Link to CSS file

// Importing images (correcting paths)
 // Correct path if your image is here
import mapImage from '../img/galary/hospital(1).jpg';  // Correct path if your map image is here

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Your message has been sent successfully!');
  };

  return (
    <div className="contact-container">
      {/* Hero Section */}
      <section className="hero-sections">
        <div className="hero-contentt">
          <h1>Contact Us</h1>
          <p>We're here to help. Reach out to us for any inquiries or assistance.</p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="contact-info">
  <div className="container">
    <div className="contact-details">
      <div className="contact-info-box">
        <h3>Visit Us</h3>
        <p>123 Health Street, City, Country</p>
      </div>
      <div className="contact-info-box">
        <h3>Phone</h3>
        <p>+123 456 7890</p>
      </div>
      <div className="contact-info-box">
        <h3>Email</h3>
        <p>contact@healthcareclinic.com</p>
      </div>
    </div>
    <div className="map">
      <img src={mapImage} alt="Map Location" />
    </div>
  </div>
</section>


      {/* Contact Form Section */}
      <section className="contact-form">
        <div className="container">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message"
                required
              ></textarea>
            </div>
            <button type="submit" className="cta-button">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <div className="footer">
        <div className="text">
          <h3>About Us</h3>
          <p>24 Hours</p>
          <p>Top Doctor</p>
          <p>Best Care</p>
          <p>Patient</p>
        </div>
        <div className="text">
          <h3>Speciality</h3>
          <p>Knee surgery</p>
          <p>Spin surgery</p>
          <p>Leg surgery</p>
          <p>Tendon surgery</p>
        </div>
        <div className="text">
          <h3>Best Teams</h3>
          <p>Doctors</p>
          <p>Nursing</p>
          <p>Staff</p>
          <p>Hospital</p>
        </div>
        <div className="text">
          <h3>Address</h3>
          <p>Near MG Road</p>
          <p>Galaxy Care</p>
          <p>333-09093</p>
          <p>09-883-090</p>
        </div>
      </div>
    </div>

  );
};

export default ContactPage;