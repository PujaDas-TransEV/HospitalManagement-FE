
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
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 2rem',
          color: 'white',
          backgroundImage: `url(${AboutImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 0.9,
        }}
      >
        <div style={{ width: '80%', marginTop: '10px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            Empowering Health Choices for a Vibrant Life Your Trusted..
          </h1>
          <p style={{ fontSize: '1.125rem' }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam magnam
            omnis natus accusantium quos. Reprehenderit incidunt expedita
             molestiae impedit at sequi dolorem iste sit culpa, optio voluptates
             fugiat vero consequatur?
          </p>
        </div>
      </div>

      {/* About Section */}
      <div style={{ marginTop: '-25px', textAlign: 'center' }}>
        <div
          style={{
            marginBottom: '60px',
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
    
        <div style={{
  padding: '2rem',
  marginBottom: '40px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
}}>
  <p style={{
    fontSize: '1.25rem',
    lineHeight: '1.8',
    color: '#333'
  }}>
    <span style={{ color: '#72c02c', fontWeight: 'bold' }}>Lifecare</span> Hospital is a multi/super speciality hospital located at the prime location of Vaishnodevi Circle, SG Road, Ahmedabad; with state-of-the-art facilities & treatments at an affordable cost, encompassing a wide spectrum of accurate diagnostics and elegant therapeutics created on the philosophical edifice of patient and ethical centricity ensuring humanistic dispensation.
  </p>

  <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '20px' }}>
    {[
      "Multiple Options For Treatment.",
      "Full Of Latest Technologies and Equipments.",
      "Best Hospital Of 2020 Award Winner.",
      "24/7 Ambulance Support.",
      "Eminent and Experienced Doctors."
    ].map((item, i) => (
      <li key={i} style={{
        marginBottom: '12px',
        fontSize: '1.15rem',
        color: '#444',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ color: 'green', fontWeight: 'bold', marginRight: '10px' }}>✓</span> {item}
      </li>
    ))}
  </ul>


        <blockquote style={{ fontStyle: 'italic', marginTop: '20px' }}>
          <p>As a leading health organization in our region, we want to be a strong influence for better health and prevention, and there’s no better place to start than among our own employees.</p>
          <small>— CEO Harshil Patel</small>
        </blockquote>
      </div>

      {/* Mission Section */}
      <div style={{ backgroundColor: '#f0f8ff', padding: '40px', display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', padding: '10px' }}>
          <img src={MissionImage} alt="Mission" style={{ width: '100%' }} />
        </div>
        <div style={{ flex: '1', padding: '10px' }}>
          <h2>Mission</h2>
          <p style={{
    fontSize: '1.125rem'}}>The ‘well being’ ensured by extension of Available, Accessible, Affordable, Safe, Efficacious, Professional and Ethical.</p>
          <p style={{
    fontSize: '1.125rem'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel urna nec justo vehicula fermentum non eu justo. Aliquam vitae dolor felis. Integer nec dui tristique, iaculis arcu non, facilisis libero.</p>
        </div>
      </div>

      {/* Vision Section */}
      <div style={{ backgroundColor: '#e6ffe6', padding: '40px', display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', padding: '10px' }}>
          <h2>Vision</h2>
          <p style={{
    fontSize: '1.125rem'}}>Ensuring ‘well being’ as a humane commitment to enliven humanity.</p>
          <p style={{
    fontSize: '1.125rem'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel urna nec justo vehicula fermentum non eu justo. Aliquam vitae dolor felis. Integer nec dui tristique, iaculis arcu non, facilisis libero.</p>
        </div>
        <div style={{ flex: '1', padding: '10px' }}>
          <img src={VisionImage} alt="Vision" style={{ width: '100%' }} />
        </div>
      </div>

      {/* Values Section */}
      <div style={{ backgroundColor: '#fdfd96', padding: '40px', display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', padding: '10px' }}>
          <img src={ValuesImage} alt="Values" style={{ width: '100%' }} />
        </div>
        <div style={{ flex: '1', padding: '10px' }}>
          <h2>Values</h2>
          <p style={{
    fontSize: '1.125rem'}}>Providing consistent and high-quality care in a compassionate and patient-centered environment.</p>
          <p style={{
    fontSize: '1.125rem'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vel urna nec justo vehicula fermentum non eu justo. Aliquam vitae dolor felis. Integer nec dui tristique, iaculis arcu non, facilisis libero.</p>
        </div>
      </div>

      {/* Departments Section */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '60px 0' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>
          Our <span style={{ color: '#72c02c' }}>Departments</span>
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '40px' }}>
          {[
            { img: CardiologyImage, title: 'Cardiology', desc: 'Our Cardiology Department provides comprehensive heart care, including diagnosis, treatment, and ongoing management for all heart-related conditions.' },
            { img: NeurologyImage, title: 'Neurology', desc: 'We offer advanced diagnostic and therapeutic services for neurological disorders such as stroke, epilepsy, and brain injuries.' },
            { img: OrthopedicsImage, title: 'Orthopedics', desc: 'Our Orthopedics Department specializes in bone, joint, and musculoskeletal care, providing treatment for fractures, arthritis, and sports injuries.' },
            { img: PediatricsImage, title: 'Pediatrics', desc: 'Our Pediatrics Department offers care for children from infancy through adolescence, ensuring their health and development are supported at every stage.' },
          ].map((dept, i) => (
            <div key={i} style={{ width: '250px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={dept.img} alt={dept.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h3>{dept.title}</h3>
                <p style={{
    fontSize: '1.125rem'}}>{dept.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Posts */}
      <div style={{ backgroundColor: '#f4f4f4', padding: '60px 0' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>
          Our <span style={{ color: '#72c02c' }}>Latest Posts</span>
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
          {[1, 2, 3].map((id) => (
            <div key={id} style={{ width: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>Post Title {id}</h3>
              <p style={{
    fontSize: '1.125rem'}}>Short summary of the latest post...</p>
              {/* <Link to={`/post/${id}`} style={{ color: '#72c02c', textDecoration: 'underline' }}>Read More</Link> */}
            <a href={`#post-${id}`} style={{ color: '#72c02c', textDecoration: 'underline' }}>
  Read More
</a>

            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div style={{ backgroundColor: '#ffffff', padding: '60px 0' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>
          Contact <span style={{ color: '#72c02c' }}>Information</span>
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '100px', marginTop: '40px', flexWrap: 'wrap' }}>
          <div>
            <h3>Address:</h3>
            <p style={{
    fontSize: '1.125rem'}}>123 Main Street, Ahmedabad, India</p>
          </div>
          <div>
            <h3>Phone:</h3>
            <p style={{
    fontSize: '1.125rem'}}>(+91) 123 456 7890</p>
          </div>
          <div>
            <h3>Email:</h3>
            <p style={{
    fontSize: '1.125rem'}}>transhospital@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ backgroundColor: ' #0B4C4C', color: 'white', display: 'flex', justifyContent: 'space-around', padding: '40px 20px', flexWrap: 'wrap' }}>
        {[
          { title: 'About Us', items: ['24 Hours', 'Top Doctor', 'Best Care', 'Patient'] },
          { title: 'Speciality', items: ['Knee surgery', 'Spin surgery', 'Leg surgery', 'Tendon surgery'] },
          { title: 'Best Teams', items: ['Doctors', 'Nursing', 'Staff', 'Hospital'] },
          { title: 'Address', items: ['Near MG Road', 'Galaxy Care', '333-09093', '09-883-090'] },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: '20px' }}>
            <h3>{section.title}</h3>
            {section.items.map((item, j) => (
              <p key={j} style={{ color: 'whitesmoke' }}>{item}</p>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
};

export default About;
