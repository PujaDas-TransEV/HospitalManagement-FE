import React, { useState } from "react";
import './Medical.css';

// Import images for different sections (replace with actual image paths)
import heroImage from '../img/slider/3(1).jpg';
import service1Image from '../img/bg/1.jpg';
import service2Image from '../Assests/hospital.jpg';
import doctorImage from '../Assests/dt2.jpg';
import testimonialImage from '../Assests/h1.avif';
import mapImage from '../Assests/map.png';

const Medicalcare = () => {
  // State to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to manage form input data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
  });

  // Function to open the modal
  const handleBookNowClick = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to book an appointment.");
    } else {
      alert("Appointment booked successfully!");
      closeModal(); // Close the modal after successful submission
    }
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-content">
          <h1>Welcome to HealthCare Clinic</h1>
          <p>Your health is our priority. Providing world-class care to our patients.</p>
          <button className="cta-button" onClick={handleBookNowClick}>Book an Appointment</button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-heading">About Us</h2>
          <p>
            HealthCare Clinic has been serving the community for over 25 years. Our team of dedicated professionals strives to provide comprehensive and compassionate care to every patient.
          </p>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-heading">Our Services</h2>
          <div className="services-container">
            <div className="service-card">
              <img src={service1Image} alt="Service 1" />
              <h3>General Medicine</h3>
              <p>We offer primary care services for general health issues, chronic conditions, and preventive health checks.</p>
            </div>
            <div className="service-card">
              <img src={service2Image} alt="Service 2" />
              <h3>Emergency Care</h3>
              <p>Our emergency department is open 24/7, ready to treat critical injuries and conditions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="departments-section">
        <div className="container">
          <h2 className="section-heading">Our Medical Departments</h2>
          <div className="departments-container">
            <div className="department-card-medical">
              <h3>Cardiology</h3>
              <p>Providing advanced treatment for heart diseases and conditions with state-of-the-art equipment.</p>
            </div>
            <div className="department-card-medical">
              <h3>Neurology</h3>
              <p>Expert treatment for neurological disorders, including strokes, epilepsy, and Parkinson's disease.</p>
            </div>
            <div className="department-card-medical">
              <h3>Pediatrics</h3>
              <p>Comprehensive healthcare services for children from infancy to adolescence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Doctors Section */}
      <section className="doctors-section">
        <div className="container">
          <h2 className="section-heading">Meet Our Doctors</h2>
          <div className="doctor-card">
            <img src={doctorImage} alt="Doctor" />
            <h3>Dr. John Doe</h3>
            <p>Specialist in Cardiology</p>
          </div>
        </div>
      </section>

      {/* Patient Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-heading">What Our Patients Say</h2>
          <div className="testimonial-card">
            <img src={testimonialImage} alt="Patient" />
            <p>"The care I received was exceptional. The staff was friendly, and I felt comfortable and cared for throughout my visit."</p>
            <small>- Jane Doe</small>
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section className="appointment-section">
        <div className="container">
          <h2 className="section-heading">Book an Appointment</h2>
          <button className="cta-button" onClick={handleBookNowClick}>Book Now</button>
        </div>
      </section>

      {/* Location & Contact Information Section */}
      <section className="contact-section" style={{ backgroundImage: `url(${mapImage})` }}>
        <div className="content">
          <h2>Contact Us</h2>
          <p>Visit us at:</p>
          <p>123 Health Street, City, Country</p>
          <p>Phone: (+123) 456-7890</p>
          <p>Email: contact@healthcareclinic.com</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>How do I book an appointment?</h3>
            <p>You can book an appointment online via our website or by calling our office.</p>
          </div>
          <div className="faq-item">
            <h3>What insurance plans do you accept?</h3>
            <p>We accept a wide variety of insurance plans. Please contact us for more details.</p>
          </div>
        </div>
      </section>

      {/* Modal for Booking Appointment */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Book Appointment</h2>
            <p>Please fill in your details to book an appointment.</p>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label>Preferred Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="cta-button">Confirm Booking</button>
            </form>
            <button className="close-modal" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Footer Section */}
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

export default Medicalcare;
