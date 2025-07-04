import React, { useState } from "react";
import './Medical.css';
import { useNavigate } from 'react-router-dom';
// Import images for different sections (replace with actual image paths)
import heroImage from '../img/slider/3(1).jpg';
import service1Image from '../img/bg/1.jpg';
import service2Image from '../Assests/hospital.jpg';
import doctorImage from '../Assests/dt2.jpg';
import testimonialImage from '../Assests/h1.avif';
import mapImage from '../Assests/map.png';
import Footer from '../Footer/Footer';
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
  // const handleBookNowClick = () => {
  //   setIsModalOpen(true);
  // };
const handleBookNowClick = () => {
  const token = localStorage.getItem("accessToken"); // Or whatever key you use

  if (!token) {
    navigate('/login');
  } else {
    navigate('/patient-Appointments'); // Replace with your actual appointment route
  }
};
const handleBooksNowClick = () => {
  const token = localStorage.getItem("accessToken"); // Or whatever key you use

  if (!token) {
    navigate('/login');
  } else {
    navigate('/home-care-service'); // Replace with your actual appointment route
  }
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
 const navigate = useNavigate(); // ✅ setup navigation

  const goToSurveyPage = () => {
    navigate('/survey');
  };
const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment online via our website or by calling our office.'
  },
  {
    question: 'What insurance plans do you accept?',
    answer: 'We accept a wide variety of insurance plans. Please contact us for more details.'
  },
  {
    question: 'Is emergency service available?',
    answer: 'Yes, we provide 24/7 emergency services at our hospital.'
  },
  {
    question: 'Do you have specialist doctors?',
    answer: 'Yes, we have a team of experienced specialists across various departments.'
  },
  {
    question: 'How do I get my medical reports?',
    answer: 'You can collect your reports from the reception or download them through our patient portal.'
  }
];


    const [activeFAQIndex, setActiveFAQIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveFAQIndex(activeFAQIndex === index ? null : index);
  };
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-sectionss" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-contents">
          <h1>Welcome to HealthCare Clinic</h1>
          <p>Your health is our priority. Providing world-class care to our patients.</p>
          <button className="cta-button" onClick={handleBookNowClick}>Book an Appointment</button>
        </div>
      </section>

      {/* About Us Section */}
      {/* <section className="about-sections">
        <div className="containers">
          <h2 className="section-headings">About Us</h2>
          <p>
            HealthCare Clinic has been serving the community for over 25 years. Our team of dedicated professionals strives to provide comprehensive and compassionate care to every patient.
          </p>
        </div>
      </section> */}
{/* About Medical Care Section */}
      <section className="about-sections">
        <div className="containers">
          <h2 className="section-headings">About Our Medical Care</h2>
          <p>
            At Lifecare Clinic, we combine cutting-edge technology with compassionate care to offer a wide range of medical services tailored to our patients' needs. With over 25 years of experience, we provide expert treatment across various specialties, backed by a team of skilled professionals dedicated to your health.
          </p>
          <ul className="about-list">
            <li> 24/7 Emergency and Critical Care Units</li>
            <li> State-of-the-art Diagnostic and Surgical Facilities</li>
            <li> Comprehensive Inpatient and Outpatient Services</li>
            <li> Patient-centered Approach and Friendly Staff</li>
          </ul>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="services-sections">
        <div className="containers">
          <h2 className="section-headings">Our Services</h2>
          <div className="services-containers">
            <div className="service-cards">
              <img src={service1Image} alt="Service 1" />
              <h3>General Medicine</h3>
              <p>We offer primary care services for general health issues, chronic conditions, and preventive health checks.</p>
            </div>
            <div className="service-cards">
              <img src={service2Image} alt="Service 2" />
              <h3>Emergency Care</h3>
              <p>Our emergency department is open 24/7, ready to treat critical injuries and conditions.</p>
            </div>
          </div>
        </div>
      </section>
<section className="design-professionals-section">
  <div className="container">
    <h2 className="section-heading">Our Design Professionals</h2>
    <p className="sub-heading">
      Our dedicated design professionals help craft patient-centered medical environments with comfort and care in mind.
    </p>
    <div className="professional-cards">
      <div className="professional-card">
        <img src="https://img.icons8.com/color/96/architect.png" alt="Architect" />
        <h3>Anirban Roy</h3>
        <p>Senior Medical Architect with 12+ years of experience designing state-of-the-art health facilities.</p>
      </div>
      <div className="professional-card">
        <img src="https://img.icons8.com/color/96/engineer.png" alt="Engineer" />
        <h3>Pooja Mehta</h3>
        <p>Biomedical Engineer ensuring medical environments are safe, efficient, and compliant with global standards.</p>
      </div>
      <div className="professional-card">
        <img src="https://img.icons8.com/color/96/interior.png" alt="Interior Designer" />
        <h3>Rahul Sinha</h3>
        <p>Interior Designer focused on creating healing spaces that promote patient well-being and comfort.</p>
      </div>
    </div>
  </div>
</section>

      {/* Departments Section */}
      <section className="departments-sections">
        <div className="containers">
          <h2 className="section-headings">Our Medical Departments</h2>
          <div className="departments-containers">
            <div className="department-card-medicals">
              <h3>Cardiology</h3>
              <p>Providing advanced treatment for heart diseases and conditions with state-of-the-art equipment.</p>
            </div>
            <div className="department-card-medicals">
              <h3>Neurology</h3>
              <p>Expert treatment for neurological disorders, including strokes, epilepsy, and Parkinson's disease.</p>
            </div>
            <div className="department-card-medicals">
              <h3>Pediatrics</h3>
              <p>Comprehensive healthcare services for children from infancy to adolescence.</p>
            </div>
          </div>
        </div>
      </section>
<section className="homecare-sections">
  <div className="containers">
    <h2 className="section-headings">Our Homecare Services</h2>
    <p>
      We provide compassionate, personalized homecare to support your health and well-being in the comfort of your own home. Our trained caregivers offer a variety of services tailored to meet your unique needs.
    </p>
   
    <div className="homecare-services-container">
      <div className="homecare-card">
        <img src="https://img.icons8.com/color/96/000000/heart-with-pulse.png" alt="Nursing Care" />
        <h3>Nursing Care</h3>
        <p>Professional medical care and monitoring by licensed nurses to support your recovery and chronic condition management.</p>
          <button className="appointment-button" onClick={handleBooksNowClick}>Book Now</button>
      </div>
    
     <div className="homecare-card labtest-card">
  <img src="https://img.icons8.com/color/96/000000/test-tube.png" alt="Lab Test at Home" />
  <h3>Lab Test at Home</h3>
  <p>Convenient collection of blood and other samples at your home with accurate and timely lab testing.</p>
  <button className="appointment-button" onClick={handleBooksNowClick}>Book Now</button>
</div>


      <div className="homecare-card">
        <img src="https://img.icons8.com/color/96/000000/physical-therapy.png" alt="Rehabilitation" />
        <h3>Rehabilitation Support</h3>
        <p>Assistance with physical therapy exercises and mobility support to help regain independence.</p>
          <button className="appointment-button" onClick={handleBooksNowClick}>Book Now</button>
      </div>
      {/* New Appointment Card */}
      <div className="homecare-card">
        <img src="https://img.icons8.com/color/96/000000/doctor-male.png" alt="Doctor Appointment" />
        <h3>Doctor Appointment</h3>
        <p>Schedule a home visit with our qualified doctors for personalized medical consultation and care.</p>
     
          <button className="appointment-button" onClick={handleBooksNowClick}>Book Now</button>
      </div>
    </div>
  </div>
</section>


      {/* Meet Our Doctors Section */}
      <section className="doctors-sections">
        <div className="containers">
          <h2 className="section-headings">Meet Our Doctors</h2>
          <div className="doctor-cards">
            <img src={doctorImage} alt="Doctor" />
            <h3>Dr. Fatima Sekh</h3>
            <p>Specialist in Cardiology</p>
          </div>
        </div>
      </section>

      {/* Patient Testimonials Section */}
      <section className="testimonials-sections">
        <div className="containers">
          <h2 className="section-headings">What Our Patients Say</h2>
          <div className="testimonial-cards">
            <img src={testimonialImage} alt="Patient" />
            <p>"The care I received was exceptional. The staff was friendly, and I felt comfortable and cared for throughout my visit."</p>
            <small>- Alice Dey</small>
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section className="appointment-sections">
        <div className="containers">
          <h2 className="section-headings">Book an Appointment</h2>
          <button className="cta-buttons" onClick={handleBookNowClick}>Book Now</button>
        </div>
      </section>
 <section className="survey-section">
        <div className="containers" style={{ textAlign: 'center', marginTop: '30px' }}>
          <h2 className="section-headings">🏥 Participate in Medical Survey</h2>
          <p>Help us improve community health by submitting your household medical information.</p>
          <button className="cta-button" onClick={goToSurveyPage}>Fill Medical Survey</button>
        </div>
      </section>
      {/* Location & Contact Information Section */}
      <section className="contact-sections" style={{ backgroundImage: `url(${mapImage})` }}>
        <div className="contents">
          <h2>Contact Us</h2>
          <p>Visit us at:</p>
          <p>MANI CASADONA,UNIT-10ES06, Kolkata, India</p>
          <p>Phone: (+91) 79080 03488</p>
          <p>Email: tgwbin@gmail.com</p>
        </div>
      </section>

     
  <section className="faq-section">
        <div className="faq-container">
          <h2 className="faq-heading">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${activeFAQIndex === index ? 'active' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-icon">{activeFAQIndex === index ? '−' : '+'}</span>
              </div>
              {activeFAQIndex === index && (
                <p className="faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
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
       {/* <div className="footer">
        <div className="text">
          <h3 style={{ color: 'white' }}>About Us</h3>
        <p style={{ color: 'white' }}>24 Hours</p>
<p style={{ color: 'white' }}>Top Doctor</p>
<p style={{ color: 'white' }}>Best Care</p>
<p style={{ color: 'white' }}>Patient</p>

        </div>
      <div className="text">
  <h3 style={{ color: 'white' }}>Speciality</h3>
  <p style={{ color: 'white' }}>Knee surgery</p>
  <p style={{ color: 'white' }}>Spin surgery</p>
  <p style={{ color: 'white' }}>Leg surgery</p>
  <p style={{ color: 'white' }}>Tendon surgery</p>
</div>

<div className="text">
  <h3 style={{ color: 'white' }}>Best Teams</h3>
  <p style={{ color: 'white' }}>Doctors</p>
  <p style={{ color: 'white' }}>Nursing</p>
  <p style={{ color: 'white' }}>Staff</p>
  <p style={{ color: 'white' }}>Hospital</p>
</div>

<div className="text">
  <h3 style={{ color: 'white' }}>Address</h3>
  <p style={{ color: 'white' }}>Near MG Road</p>
  <p style={{ color: 'white' }}>Galaxy Care</p>
  <p style={{ color: 'white' }}>333-09093</p>
  <p style={{ color: 'white' }}>09-883-090</p>
</div> 

       
      </div> */}
      <Footer/>
    </div>
  );
};

export default Medicalcare;
