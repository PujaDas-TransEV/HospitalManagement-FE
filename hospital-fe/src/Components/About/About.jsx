import React from "react";
import { Link } from "react-router-dom"; 
import AboutImage from '../Assests/home.png';  
import VisionImage from '../Assests/blog1.jpg';  
import MissionImage from '../Assests/blog3.jpg';
import ValuesImage from '../Assests/blog3.jpg'; 
import CardiologyImage from '../Assests/medicine.webp'; 
import NeurologyImage from '../img/slider/3(1).jpg'; 
import OrthopedicsImage from '../img/slider/2(1).jpg'; 
import PediatricsImage from '../img/slider/1(2).jpg';  
import './About.css';  

const About = () => {
  return (
    <div>
      {/* Background Section */}
      <div
        className="min-h-screen flex flex-col justify-center lg:px-32 px-5 text-white bg-no-repeat bg-cover opacity-90"
        style={{ backgroundImage: `url(${AboutImage})` }}
      >
        <div className="w-full lg:w-4/5 space-y-5 mt-10">
          <h1 className="text-5xl font-bold leading-tight">
            Empowering Health Choices for a Vibrant Life Your Trusted..
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam magnam
            omnis natus accusantium quos. Reprehenderit incidunt expedita
            molestiae impedit at sequi dolorem iste sit culpa, optio voluptates
            fugiat vero consequatur?
          </p>
        </div>
      </div>

      {/* About Section */}
      <div className="container content-sm" style={{ marginTop: '-25px' }}>
        <div 
          className="headline-center" 
          style={{
            marginBottom: '60px', 
            textAlign: 'center', 
            backgroundColor: '#fff', 
            padding: '40px', 
            borderRadius: '8px', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
            maxWidth: '600px', 
            margin: '0 auto'
          }}
        >
          <h2 style={{ margin: 0 }}>
            ABOUT <span style={{ color: '#72c02c' }}>LifeCare</span>
          </h2>
        </div>
      </div>

      {/* Unity Hospital Section */}
      <div className="container content" style={{ marginTop: '-20px' }}>
        <div className="row" style={{ marginBottom: '40px' }}>
          <div className="col-md-12" style={{ marginBottom: '40px' }}>
            <p>
              <span style={{ color: '#72c02c' }}>Lifecare </span> Hospital is a multi/super speciality hospital located at the prime location of Vaishnodevi Circle, SG Road, Ahmedabad; with state-of-the-art facilities & treatments at an affordable cost, encompassing a wide spectrum of accurate diagnostics and elegant therapeutics created on the philosophical edifice of patient and ethical centricity ensuring humanistic dispensation.
            </p>
            <ul className="list-unstyled">
              <li><i className="fa fa-check" style={{ color: 'green' }}></i> Multiple Options For Treatment.</li>
              <li><i className="fa fa-check" style={{ color: 'green' }}></i> Full Of Latest Technologies and Equipments.</li>
              <li><i className="fa fa-check" style={{ color: 'green' }}></i> Best Hospital Of 2020 Award Winner.</li>
              <li><i className="fa fa-check" style={{ color: 'green' }}></i> 24/7 Ambulance Support.</li>
              <li><i className="fa fa-check" style={{ color: 'green' }}></i> Eminent and Experienced Doctors.</li>
            </ul> 
            <blockquote>
              <p>As a leading health organization in our region, we want to be a strong influence for better health and prevention, and there’s no better place to start than among our own employees.</p>
              <small>CEO Harshil Patel</small>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission-container" style={{ backgroundColor: '#f0f8ff' }}>
        <div className="service-block-v6">
          <div className="col-md-6">
            <img src={MissionImage} alt="Mission" />
          </div>
          <div className="service-desc">
            <h2>Mission</h2>
            <p>The ‘well being’ ensured by extension of Available, Accessible, Affordable, Safe, Efficacious, Professional and Ethical.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel urna nec justo vehicula fermentum non eu justo. Aliquam vitae dolor felis. Integer nec dui tristique, iaculis arcu non, facilisis libero.</p>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="vision-container" style={{ backgroundColor: '#e6ffe6' }}>
        <div className="service-block-v6">
          <div className="service-desc">
            <h2>Vision</h2>
            <p>Ensuring ‘well being’ as a humane commitment to enliven humanity.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel urna nec justo vehicula fermentum non eu justo. Aliquam vitae dolor felis. Integer nec dui tristique, iaculis arcu non, facilisis libero.</p>
          </div>
          <div className="col-md-6">
            <img src={VisionImage} alt="Vision" />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="values-container" style={{ backgroundColor: '#fdfd96' }}>
        <div className="service-block-v6">
          <div className="col-md-6">
            <img src={ValuesImage} alt="Values" />
          </div>
          <div className="service-desc">
            <h2>Values</h2>
            <p>Providing consistent and high-quality care in a compassionate and patient-centered environment.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel urna nec justo vehicula fermentum non eu justo. Aliquam vitae dolor felis. Integer nec dui tristique, iaculis arcu non, facilisis libero.</p>
          </div>
        </div>
      </div>

     
<div className="departments-container" style={{ backgroundColor: '#f9f9f9', padding: '60px 0' }}>
  <div className="headline-center" style={{ marginBottom: '60px' }}>
    <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginLeft:'700px' }}>
      Our <span style={{ color: '#72c02c' }}>Departments</span>
    </h2>
  </div>

  <div className="container">
    <div className="department-cards-container" style={{marginLeft:'200px'}}>
      {/* Cardiology */}
      <div className="department-card-about" >
        <img src={CardiologyImage} alt="Cardiology" className="department-img" />
        <div className="department-info">
          <h3>Cardiology</h3>
          <p>Our Cardiology Department provides comprehensive heart care, including diagnosis, treatment, and ongoing management for all heart-related conditions.</p>
        </div>
      </div>

      {/* Neurology */}
      <div className="department-card-about">
        <img src={NeurologyImage} alt="Neurology" className="department-img" />
        <div className="department-info">
          <h3>Neurology</h3>
          <p>We offer advanced diagnostic and therapeutic services for neurological disorders such as stroke, epilepsy, and brain injuries.</p>
        </div>
      </div>

      {/* Orthopedics */}
      <div className="department-card-about">
        <img src={OrthopedicsImage} alt="Orthopedics" className="department-img" />
        <div className="department-info">
          <h3>Orthopedics</h3>
          <p>Our Orthopedics Department specializes in bone, joint, and musculoskeletal care, providing treatment for fractures, arthritis, and sports injuries.</p>
        </div>
      </div>

      {/* Pediatrics */}
      <div className="department-card-about">
        <img src={PediatricsImage} alt="Pediatrics" className="department-img" />
        <div className="department-info">
          <h3>Pediatrics</h3>
          <p>Our Pediatrics Department offers care for children from infancy through adolescence, ensuring their health and development are supported at every stage.</p>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Latest Posts Section */}
      <div className="latest-posts-container" style={{ backgroundColor: '#f4f4f4', padding: '60px 0' }}>
        <div className="headline-center" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>
            Our <span style={{ color: '#72c02c' }}>Latest Posts</span>
          </h2>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="post-card">
                <h3>Post Title One</h3>
                <p>Short summary of the latest post...</p>
                <Link to="/post/1" className="read-more">Read More</Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="post-card">
                <h3>Post Title Two</h3>
                <p>Short summary of the latest post...</p>
                <Link to="/post/2" className="read-more">Read More</Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="post-card">
                <h3>Post Title Three</h3>
                <p>Short summary of the latest post...</p>
                <Link to="/post/3" className="read-more">Read More</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="contact-info-container" style={{ backgroundColor: '#ffffff', padding: '60px 0' }}>
        <div className="headline-center" style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>
            Contact <span style={{ color: '#72c02c' }}>Information</span>
          </h2>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h3>Address:</h3>
              <p>123 Main Street, Ahmedabad, India</p>
            </div>
            <div className="col-md-6">
              <h3>Phone:</h3>
              <p>(+91) 123 456 7890</p>
            </div>
            <div className="col-md-6">
              <h3>Email:</h3>
              <p>transhospital@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer">
        <div className="text">
          <h3 style={{color:'white'}}>About Us</h3>
          <p style={{color:'whitesmoke'}}>24 Hours</p>
          <p style={{color:'whitesmoke'}}>Top Doctor</p>
          <p style={{color:'whitesmoke'}}>Best Care</p>
          <p style={{color:'whitesmoke'}}>Patient</p>
        </div>
        <div className="text">
          <h3 style={{color:'white'}}>Speciality</h3>
          <p style={{color:'whitesmoke'}}>Knee surgery</p>
          <p style={{color:'whitesmoke'}}>Spin surgery</p>
          <p style={{color:'whitesmoke'}}>Leg surgery</p>
          <p style={{color:'whitesmoke'}}>Tendon surgery</p>
        </div>
        <div className="text">
          <h3>Best Teams</h3>
          <p style={{color:'whitesmoke'}}>Doctors</p>
          <p style={{color:'whitesmoke'}}>Nursing</p>
          <p style={{color:'whitesmoke'}}>Staff</p>
          <p style={{color:'whitesmoke'}}>Hospital</p>
        </div>
        <div className="text">
          <h3 style={{color:'white'}}>Address</h3>
          <p style={{color:'whitesmoke'}}>Near MG Road</p>
          <p style={{color:'whitesmoke'}}>Galaxy Care</p>
          <p style={{color:'whitesmoke'}}>333-09093</p>
          <p style={{color:'whitesmoke'}}>09-883-090</p>
        </div>
      </div>
    </div>
  );
};

export default About;
