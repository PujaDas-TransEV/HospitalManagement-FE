import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import './Home.css'; // Ensure you have corresponding CSS
import mainsImage from '../Assests/mains.png';
import dt1 from '../Assests/dt1.jpg';
import dt2 from '../Assests/dt2.jpg';
import dt3 from '../Assests/dt3.jpg';
import heart from '../Assests/heart.jpg'; // Added
import medicine from '../Assests/medicine.webp'; // Added
import s3 from '../Assests/s3.png';
import p1 from '../Assests/p1.png';
import p2 from '../Assests/p2.png';
import p3 from '../Assests/p3.jpg';
import p4 from '../Assests/p4.jpg';
import p5 from '../Assests/p5.jpg';
import p6 from '../Assests/p6.jpg';
import aboutImage from '../img/galary/room1.jpg';
import Choose from '../Assests/Hospitalback.jpg';
import cardiologyImage from '../img/slider/1(2).jpg';
import neurologyImage from '../img/slider/2(1).jpg';
import orthopedicsImage from '../img/slider/3(1).jpg';
import cath_lab from '../img/galary/cath_lab.jpg';
import hospital from '../img/galary/hospital(1).jpg';
import opd from '../img/galary/opd.jpg';
import parking from '../img/galary/parking.jpg';
import platinum_wing from '../img/galary/platinum_wing.jpg';
import patient1 from '../Assests/p1.png';
import patient2 from '../Assests/p2.png';
import patient3 from '../Assests/p3.jpg';
import patient4 from '../Assests/p4.jpg';
import patient5 from '../Assests/p5.jpg';
import doctor from '../Assests/h1.avif';



const HospitalDashboard = () => {
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showMore, setShowMore] = useState(false);

  // Dummy data for new sections
  const specialties = [
    { name: "Cardiology", description: "Cardiology is the branch of medicine that deals with diseases and abnormalities of the heart.", image: cardiologyImage },

    { name: "Neurology", description: "Neurology is the branch of medicine concerned with the study and treatment of disorders of the nervous system.", image:neurologyImage  },
    { name: "Orthopedics", description: "Orthopedics is the branch of surgery concerned with conditions involving the musculoskeletal system.", image:orthopedicsImage },
  ];

  const galleryImages = [
    { image: cath_lab, alt: "Image 1", description: "Beautiful Landscape 1" },
    { image: hospital, alt: "Image 2", description: "Beautiful Landscape 2" },
    { image: opd, alt: "Image 3", description: "Beautiful Landscape 3" },
    { image: parking, alt: "Image 4", description: "Beautiful Landscape 4" },
    { image: platinum_wing, alt: "Image 5", description: "Beautiful Landscape 5" },
   
  ];
  

  const reviews = [
    { image: patient1, name: "John Doe", review: "Excellent service!" },
    { image: patient2, name: "Jane Smith", review: "Very professional staff!" },
    { image: patient3, name: "Alice Johnson", review: "Great experience overall." },
    { image: patient4, name: "Bob Brown", review: "Would highly recommend!" },
    { image: patient5, name: "Tom Wilson", review: "Top-notch care and attention!" },
  ];

  // Data for slides, doctor cards, and specialties
  const slides = [
    { imgSrc: p1, alt: 'Patient 1' },
    { imgSrc: p2, alt: 'Patient 2' },
    { imgSrc: p3, alt: 'Patient 3' },
    { imgSrc: p4, alt: 'Patient 4' },
    { imgSrc: p5, alt: 'Patient 5' },
    { imgSrc: p6, alt: 'Patient 6' },
  ];

  const doctorCards = [
    { imgSrc: dt1, name: "Alexa", description: "Lorem ipsum dolor sit amet." },
    { imgSrc: dt2, name: "Dr. Smith", description: "Lorem ipsum dolor sit amet." },
    { imgSrc: dt3, name: "Dr. Johnson", description: "Lorem ipsum dolor sit amet." },
    { imgSrc: doctor, name: "Dr. Panja", description: "Lorem ipsum dolor sit amet." },
  ];

  const specialtyCards = [
    { imgSrc: heart, title: "Heart Surgery", description: "Lorem ipsum dolor sit amet." },
    { imgSrc: medicine, title: "General Medicine", description: "Lorem ipsum dolor sit amet." },
    { imgSrc: s3, title: "Leg Surgery", description: "Lorem ipsum dolor sit amet." },
  ];

  // Slide Show effect (auto slide)
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Handle Login
  const handleConnect = () => {
    if (email === "" || password === "") {
      alert("Enter Details");
    } else {
      alert("You Logged In");
    }
  };

  // Handle Card Click to show details
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowDetail(true);
  };

  // Close detail modal
  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedCard(null);
  };

  // Handle Show More Button
  const navigate = useNavigate();
  const handleShowMore = () => {
    navigate("/specialities"); // Redirect to medical care page
  };

  return (
    <div className="container">
      

      {/* Main Content */}
      <div className="main">
        <div className="mainText">
          <h1>The Hospital that <br /> Care for you</h1>
          <h3>Best Team's</h3>
          <button>Show more</button>
        </div>
        <img src={mainsImage} alt="Hospital" />
      </div>

      {/* About Us Section */}
      <div id="about-us">
        <div className="about-us-content">
          <div className="about-us-left">
            <img src={aboutImage} alt="Hospital" />
          </div>
          <div className="about-us-right">
            <h2>About Us</h2>
            <p>
              LifeCare Hospital is dedicated to providing exceptional medical care with a personal touch. Our team of highly trained doctors, nurses, and staff ensure that each patient receives the highest level of care, tailored to their individual needs.
            </p>
            <p>
              Whether you need a routine check-up, specialized treatment, or emergency care, we are here for you. Our state-of-the-art facilities and compassionate approach ensure you get the best possible outcome.
            </p>
            <p>
              At LifeCare, we understand that each patient’s needs are unique. We take the time to listen to you, understand your concerns, and develop a treatment plan that suits your individual health goals.
            </p>
            <p>
              Join the thousands of patients who trust LifeCare Hospital for their health and wellness. Our mission is to provide exceptional care, promote well-being, and improve the quality of life for each person who walks through our doors.
            </p>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <div className="specialty-section">
        <h2>Our Medical Care</h2>
        <div className="specialty-container">
          {specialties.map((specialty, index) => (
            <div className="specialty-card" key={index}>
              <img src={specialty.image} alt={specialty.name} />
              <p>{specialty.name}</p>
              <p>{specialty.description}</p>
              <button className="show-more-btn" onClick={() => setShowMore(!showMore)}>
                {showMore ? "Show Less" : "Show More"}
              </button>
            </div>
          ))}
        </div>
      </div>

     
      <div className="why-choose-us">
  <div className="why-choose-us-left-container">
    <div className="why-choose-us-left">
      <h2>Why Choose Us</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed
        cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
        Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget
        nulla.
      </p>
    </div>
  </div>
  <div className="why-choose-us-right-container">
    <div className="why-choose-us-right">
      <img src={Choose} alt="Why Choose Us" />
    </div>
  </div>
</div>


      {/* Gallery Section */}
      <div className="gallery-section">
  <h2>Our Gallery</h2>
  <div className="gallery-container">
    {galleryImages.map((item, index) => (
      <div className="gallery-item" key={index}>
        <img src={item.image} alt={item.alt} />
        <p>{item.description}</p>
      </div>
    ))}
  </div>
</div>


     
      
{/* Patient Reviews Section */}


      {/* Doctors Section */}
      <div id="doctor">
        <div className="head">
          <h1>Our Doctors</h1>
        </div>
        <div className="teams">
          {doctorCards.map((card, index) => (
            <div key={index} className="card" onClick={() => handleCardClick(card)}>
              <img src={card.imgSrc} alt={card.name} />
              <p>{card.name}</p>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
<div></div>
      {/* Specialties Section */}
      <div id="speciality">
        <div className="head">
          <h1>Our Specialties</h1>
        </div>
        <div className="speciality">
          {specialtyCards.map((card, index) => (
            <div key={index} className="spCard">
              <img src={card.imgSrc} alt={card.title} />
              <p>{card.title}</p>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
       
      </div>
      
      <div className="reviews-section">
  <h2>Patient Reviews</h2>
  <div className="reviews-container">
    {reviews.map((review, index) => (
      <div className="review-card" key={index}>
        <img src={review.image} alt={review.name} />
        <div className="review-text">
          <p><strong>{review.name}</strong></p>
          <p>"{review.review}"</p>
        </div>
      </div>
    ))}
  </div>
</div>

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

      {/* Detailed View Modal */}
      {showDetail && (
        <div className="detail">
          <button id="closeBtn" onClick={handleCloseDetail}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="content">
            {selectedCard && (
              <>
                <img src={selectedCard.imgSrc} alt={selectedCard.name} />
                <div className="contentText">
                  <h1>{selectedCard.name}</h1>
                  <p>{selectedCard.description}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard;
