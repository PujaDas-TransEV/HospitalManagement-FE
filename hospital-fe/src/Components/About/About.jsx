import React from "react";
import { Link } from "react-router-dom";
import AboutImage from '../Assests/home.png';
import VisionImage from '../Assests/blog1.jpg';
import MissionImage from '../Assests/blog3.jpg';
import ValuesImage from '../Assests/hospital.jpg';
import CardiologyImage from '../Assests/medicine.webp';
import NeurologyImage from '../img/slider/3(1).jpg';
import OrthopedicsImage from '../img/slider/2(1).jpg';
import PediatricsImage from '../img/slider/1(2).jpg';
import './About.css';  
import Footer from '../Footer/Footer';
const About = () => {
  const lines = [
  "Empowering Health Choices for a Vibrant Life — Your Trusted Partner in Wellness",
  "At LifeCare Hospital, we are committed to delivering compassionate and expert care tailored to your unique needs.",
  "Your health is our priority, and together, we build a healthier future."
];
  return (
    <div>

     
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
        {/* <div style={{ width: '80%', marginTop: '10px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold' }}>
            Empowering Health Choices for a Vibrant Life Your Trusted..
          </h1>
          <p style={{ fontSize: '1.125rem' }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam magnam
            omnis natus accusantium quos. Reprehenderit incidunt expedita
             molestiae impedit at sequi dolorem iste sit culpa, optio voluptates
             fugiat vero consequatur?
          </p>
        </div> */}
        <div style={{ width: '80%', marginTop: '10px', color: 'white' }}>
  {lines.map((line, index) => (
    <p
      key={index}
      className="slide-in"
      style={{ 
        fontSize: index === 0 ? '3rem' : '1.125rem',
        fontWeight: index === 0 ? 'bold' : 'normal',
        animationDelay: `${index * 0.5}s`,
        color: 'white'  
      }}
    >
      {line}
    </p>
  ))}
</div>


      </div>

      
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

     
      <div style={{ backgroundColor: '#f0f8ff', padding: '40px', display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', padding: '10px' }}>
          <img src={MissionImage} alt="Mission" style={{ width: '100%' }} />
        </div>
        <div style={{ flex: '1', padding: '10px' }}>
          <h2>Mission</h2>
          <p style={{
    fontSize: '1.125rem'}}>The ‘well being’ ensured by extension of Available, Accessible, Affordable, Safe, Efficacious, Professional and Ethical.</p>
          <p style={{
    fontSize: '1.125rem'}}>  We are committed to advancing health outcomes through compassionate care, innovation, and a patient-centered approach that respects the dignity and uniqueness of every individual.</p>
    <p style={{ fontSize: '1.125rem' }}>
    Through continuous improvement and dedication, we strive to foster a supportive environment where patients and their families feel empowered, informed, and cared for at every stage of their health journey.
  </p>
  <p style={{ fontSize: '1.125rem' }}>
    Our goal is to blend cutting-edge medical technology with empathy and respect to transform lives and build healthier communities.
  </p>
   <p style={{ fontSize: '1.125rem' }}>
    Compassion is the heart of our mission to create a welcoming and supportive atmosphere for all who seek our care.
  </p>
        </div>
      </div>

    
      <div style={{ backgroundColor: '#e6ffe6', padding: '40px', display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', padding: '10px' }}>
          <h2>Vision</h2>
          <p style={{
    fontSize: '1.125rem'}}>Ensuring ‘well being’ as a humane commitment to enliven humanity.</p>
        <p style={{ fontSize: '1.125rem' }}>
  Our vision is to be a beacon of hope and excellence in healthcare, pioneering innovative solutions that transform lives and communities. We strive to create a future where quality healthcare is accessible to all, fostering healthier generations through compassion, integrity, and continuous advancement.
</p>
<p style={{ fontSize: '1.125rem' }}>
  We envision a world where every individual receives personalized care that respects their unique needs and dignity. By integrating cutting-edge technology with empathetic service, we aim to set new standards in medical excellence and patient satisfaction.
</p>
<p style={{ fontSize: '1.125rem' }}>
  Our commitment extends beyond treatment to promoting wellness and prevention, empowering people to lead healthier, happier lives.
</p>
        </div>
        <div style={{ flex: '1', padding: '10px' }}>
          <img src={VisionImage} alt="Vision" style={{ width: '100%' }} />
        </div>
      </div>

      
      <div style={{ backgroundColor: '#fffacd', padding: '40px', display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', padding: '10px' }}>
          <img src={ValuesImage} alt="Values" style={{ width: '100%' }} />
        </div>
        <div style={{ flex: '1', padding: '10px' }}>
          <h2>Values</h2>
         <p style={{ fontSize: '1.125rem' }}>
  Providing consistent and high-quality care in a compassionate and patient-centered environment.
</p>
<p style={{ fontSize: '1.125rem' }}>
  We uphold integrity, respect, and excellence in everything we do, ensuring that every patient is treated with dignity and empathy.
</p>
<p style={{ fontSize: '1.125rem' }}>
  Commitment to teamwork and continuous learning allows us to innovate and improve the healthcare experience for our community.
</p>
<p style={{ fontSize: '1.125rem' }}>
  We value transparency, accountability, and ethical practices as the foundation of trust between caregivers and patients.
</p>
<p style={{ fontSize: '1.125rem' }}>
  Sustainability and responsibility guide our efforts to minimize environmental impact while maximizing community health benefits.
</p>
<p style={{ fontSize: '1.125rem' }}>
  We believe in empowering patients through education and open communication to foster informed health decisions.
</p>
        </div>
      </div>

     
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
      {/* <div style={{ backgroundColor: '#f4f4f4', padding: '60px 0' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>
          Our <span style={{ color: '#72c02c' }}>Latest Posts</span>
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px' }}>
          {[1, 2, 3].map((id) => (
            <div key={id} style={{ width: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h3>Post Title {id}</h3>
              <p style={{
    fontSize: '1.125rem'}}>Short summary of the latest post...</p>
            
            <a href={`#post-${id}`} style={{ color: '#72c02c', textDecoration: 'underline' }}>
  Read More
</a>

            </div>
          ))}
        </div> */}
        <div style={{ backgroundColor: '#f4f4f4', padding: '60px 0' }}>
  <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>
    Our <span style={{ color: '#72c02c' }}>Latest Posts</span>
  </h2>
  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '40px', flexWrap: 'wrap' }}>
    {[
      {
        id: 1,
        title: 'Advancements in Cardiac Care',
        summary: 'Discover how our cardiology department uses cutting-edge technology to save lives and improve heart health.'
      },
      {
        id: 2,
        title: 'COVID-19 Safety Protocols',
        summary: 'Learn about the latest measures LifeCare Hospital is taking to keep patients and staff safe during the pandemic.'
      },
      {
        id: 3,
        title: 'Nutrition Tips for Recovery',
        summary: 'Explore dietary recommendations from our experts to help patients recover faster and maintain optimal health.'
      }
    ].map(({ id, title, summary }) => (
      <div key={id} style={{ width: '300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
      <h3 style={{ color: '#337ab7' }}>{title}</h3>

        <p style={{ fontSize: '1.125rem' }}>{summary}</p>
        <a href={`#post-${id}`} style={{ color: '#72c02c', textDecoration: 'underline' }}>
          Read More
        </a>
      </div>
    ))}
  </div>


      </div>

     
      <div style={{ backgroundColor: '#ffffff', padding: '60px 0' }}>
        <h2 style={{ fontSize: '2.5rem', textAlign: 'center' }}>
          Contact <span style={{ color: '#72c02c' }}>Information</span>
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '100px', marginTop: '40px', flexWrap: 'wrap' }}>
          <div>
            <h3>Address:</h3>
            <p style={{
    fontSize: '1.125rem'}}>MANI CASADONA,UNIT-10ES06, Kolkata, India</p>
          </div>
          <div>
            <h3>Phone:</h3>
            <p style={{
    fontSize: '1.125rem'}}>(+91) 79080 03488</p>
          </div>
          <div>
            <h3>Email:</h3>
            <p style={{
    fontSize: '1.125rem'}}>tgwbin@gmail.com</p>
          </div>
        </div>
      </div>

     
   

<Footer/>

    </div>
  );
};

export default About;
