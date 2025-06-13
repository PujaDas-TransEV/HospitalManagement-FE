
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
import pediatricsImage from '../img/slider/2(1).jpg';
import oncologyImage from '../img/slider/3(1).jpg';
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
import MainSlider from '../Home/MainSlider';


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
    { image: cath_lab, alt: "Image 1", description: "Surgery Room" },
    { image: hospital, alt: "Image 2", description: "Hospital Back Side" },
    { image: opd, alt: "Image 3", description: "Waiting Room" },
    { image: parking, alt: "Image 4", description: "Parking Space" },
    { image: platinum_wing, alt: "Image 5", description: "Beautiful Reception area" },
   
  ];
  

  const reviews = [
    { image: patient1, name: "Sime Roy", review: "Excellent service!" },
    { image: patient2, name: "Arup Mandal", review: "Very professional staff!" },
    { image: patient3, name: "Sanjana Routh", review: "Great experience overall." },
    { image: patient4, name: "Simran Das", review: "Would highly recommend!" },
    { image: patient5, name: "Tom Ganguly", review: "Top-notch care and attention!" },
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
    { imgSrc: dt1, name: "Dr.Shreya ", description: "She is a highly experienced cardiologist." },
    { imgSrc: dt2, name: "Dr. Ananya", description: "Expert in neurology, Dr. Ananya " },
    { imgSrc: dt3, name: "Dr.Praduth", description: "He is a compassionate pediatrician ." },
    { imgSrc: doctor, name: "Dr. Panja", description: "A skilled surgeon." },
  ];

  const specialtyCards = [
 { 
  imgSrc: heart, 
  title: "Heart Surgery", 
  description: "Our expert cardiac surgeons perform advanced surgical procedures using the latest techniques and technology to restore heart function, reduce symptoms, and improve your overall quality of life. We provide personalized care tailored to each patient’s needs, ensuring safety and the best possible outcomes." 
},
{ 
  imgSrc: medicine, 
  title: "General Medicine", 
  description: "Offering comprehensive medical care for patients of all ages, our general medicine department focuses on preventive care, early diagnosis, and effective treatment of acute and chronic conditions. Our team is dedicated to promoting wellness and managing health for lifelong vitality." 
},
{
  imgSrc: s3,
  title: "Leg Surgery",
  description: "Our highly skilled orthopedic surgeons specialize in minimally invasive and traditional leg surgeries to treat fractures, joint disorders, and other injuries. We aim to restore mobility, reduce pain, and help patients return to an active lifestyle quickly and safely."
},
// {
//   imgSrc: neurologyImage,
//   title: "Neurology",
//   description: "Providing expert diagnosis and treatment for neurological conditions such as stroke, epilepsy, Parkinson’s disease, and multiple sclerosis. Our neurologists combine advanced imaging and therapies with compassionate care to improve patient outcomes and quality of life."
// },
{
  imgSrc: pediatricsImage,
  title: "Pediatrics",
  description: "Our dedicated pediatricians provide specialized care tailored to infants, children, and adolescents, focusing on growth, development, immunizations, and treatment of childhood illnesses. We partner with families to support the healthy development of every child."
},
{
  imgSrc: oncologyImage,
  title: "Oncology",
  description: "Our oncology department offers comprehensive cancer care, including diagnosis, chemotherapy, radiation, and supportive services. We utilize the latest treatments and clinical trials to provide compassionate, personalized care designed to improve survival and quality of life."
}


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
    navigate("/about"); // Redirect to medical care page
  };
 
  return (
    <div className="container-home">
      

      {/* Main Content */}
      {/* <div className="main">
        <div className="mainText">
          <h1>The Hospital that <br /> Care for you</h1>
          <h3 style={{color:'white'}}>Best Team's</h3>
          
          <button style={{ color: 'white', backgroundColor: 'black', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer',height:'50px',width:'150px' }} onClick={handleShowMore}>
  Show more
</button>

        </div>
        <img src={mainsImage} alt="Hospital" />
      </div> */}
   <MainSlider />
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
        <strong>Expert Medical Team:</strong> Our doctors and staff are highly qualified professionals dedicated to providing you with the best care possible.<br /><br />
        <strong>State-of-the-Art Facilities:</strong> We use the latest technology and advanced treatments to ensure accurate diagnosis and effective treatment.<br /><br />
        <strong>Patient-Centered Care:</strong> Every patient is unique — we listen, understand, and tailor our care plans to fit your individual needs.<br /><br />
        <strong>24/7 Emergency Support:</strong> Around-the-clock emergency services mean we’re here whenever you need us.<br /><br />
        <strong>Compassionate Environment:</strong> We foster a caring and supportive atmosphere that promotes healing and comfort.<br /><br />
        <strong>Proven Track Record:</strong> Thousands of satisfied patients trust LifeCare Hospital for their health and well-being.
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

{/* Doctors Section */}
      <div id="doctor">
        <div className="head">
          <h1>Our Doctors</h1>
        </div>
        <div className="teams">
          {doctorCards.map((card, index) => (
            <div key={index} className="card" onClick={() => handleCardClick(card)}>
              <img src={card.imgSrc} alt={card.name} />
           
              <p style={{ color: 'black' }}>{card.name}</p>
<p style={{ color: 'black' }}>{card.description}</p>

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
      {/* Patient Reviews Section */}
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
          <h3 style={{color:'white'}}>Best Teams</h3>
          <p style={{color:'whitesmoke'}}>Doctors</p>
          <p style={{color:'whitesmoke'}}>Nursing</p>
          <p style={{color:'whitesmoke'}}> Staff</p>
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
