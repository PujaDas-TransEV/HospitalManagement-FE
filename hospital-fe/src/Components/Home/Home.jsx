// import React, { useState, useEffect } from "react";
// import "./Home.css"; // Make sure you have corresponding CSS
// import mainsImage from '../Assests/mains.png'; 
// import dt1 from '../Assests/dt1.jpg'; // Import images
// import dt2 from '../Assests/dt2.jpg';
// import dt3 from '../Assests/dt3.jpg';
// //import s1 from '../Assets/s1.png';
// // import s2 from '../Assets/s2.png';
// import s3 from '../Assests/s3.png';
// import p1 from '../Assests/p1.png';
// import p2 from '../Assests/p2.png';
// import p3 from '../Assests/p3.jpg';
// import p4 from '../Assests/p4.jpg';
// import p5 from '../Assests/p5.jpg';
// import p6 from '../Assests/p6.jpg';
// import { Link, useNavigate } from 'react-router-dom';


// const HospitalDashboard = () => {
//   const [count, setCount] = useState(0);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showDetail, setShowDetail] = useState(false);
//   const [selectedCard, setSelectedCard] = useState(null);

//   const slides = [
//     { imgSrc: p1, alt: 'Patient 1' }, // Use imported image here
//     { imgSrc: p2, alt: 'Patient 2' },
//     { imgSrc: p3, alt: 'Patient 3' },
//     { imgSrc: p4, alt: 'Patient 4' },
//     { imgSrc: p5, alt: 'Patient 5' },
//     { imgSrc: p6, alt: 'Patient 6' },
//   ];


//   const doctorCards = [
//     { imgSrc: dt1, name: "Alexa", description: "Lorem ipsum dolor sit amet." },
//     { imgSrc: dt2, name: "Dr. Smith", description: "Lorem ipsum dolor sit amet." },
//     { imgSrc: dt3, name: "Dr. Johnson", description: "Lorem ipsum dolor sit amet." },
//   ];

//   const specialtyCards = [
//     // { imgSrc: s1, title: "Knee Surgery", description: "Lorem ipsum dolor sit amet." },
//     // { imgSrc: s2, title: "Spin Surgery", description: "Lorem ipsum dolor sit amet." },
//     { imgSrc: s3, title: "Leg Surgery", description: "Lorem ipsum dolor sit amet." },
//   ];
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount((prevCount) => (prevCount + 1) % slides.length);
//     }, 2000);

//     return () => clearInterval(interval); // Clean up interval on component unmount
//   }, [slides.length]);

//   const handleConnect = () => {
//     if (email === "" || password === "") {
//       alert("Enter Details");
//     } else {
//       alert("You Logged In");
//     }
//   };

//   const handleCardClick = (card) => {
//     setSelectedCard(card);
//     setShowDetail(true);
//   };

//   const handleCloseDetail = () => {
//     setShowDetail(false);
//     setSelectedCard(null);
//   };

//   return (
//     <div className="container">
//       {/* Navbar */}
//       <nav>
//         <div className="logo">
//           <h1>LifeCare</h1>
//         </div>
//         <i id="bar" className="fa-solid fa-bars"></i>
//         <ul>
//           <li><Link to="/home">Home</Link></li>
//           <li><Link to="/about">About Us</Link></li>
//           <li><Link to="/specialities" >Medical Care</Link></li>
        
//           <li><Link to="/contact" >Contact Us</Link></li>
         
//         </ul>
//         <Link to="/login">
//     <button className="login-btn">Login</button>
//   </Link>
//       </nav>

//       {/* Main Content */}
//       <div className="main">
//         <div className="mainText">
//           <h1>The Hospital that <br /> Care for you</h1>
//           <h3>Best Team's</h3>
//           <button>Show more</button>
//         </div>
//         {/* Use imported image here */}
//         <img src={mainsImage} alt="Hospital" />
//       </div>

//       {/* Doctors Section */}
//       <div id="doctor">
//         <div className="head">
//           <h1>Our Doctor's</h1>
//         </div>
//         <div className="teams">
//           {doctorCards.map((card, index) => (
//             <div key={index} className="card" onClick={() => handleCardClick(card)}>
//               <img src={card.imgSrc} alt={card.name} />
//               <p>{card.name}</p>
//               <p>{card.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Specialties Section */}
//       <div id="speciality">
//         <div className="head">
//           <h1>Our Speciality's</h1>
//         </div>
//         <div className="speciality">
//           {specialtyCards.map((card, index) => (
//             <div key={index} className="spCard">
//               <img src={card.imgSrc} alt={card.title} />
//               <p>{card.title}</p>
//               <p>{card.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Patient Reviews Section */}
//       <div id="patient">
//         <div className="head">
//           <h1>Patient Review's</h1>
//         </div>
//         <div className="reviews">
//           {slides.map((slide, index) => (
//             <div key={index} className="patientReview" style={{ left: `${index * 100}%`, transform: `translateX(-${count * 100}%)` }}>
//               <img src={slide.imgSrc} alt={slide.alt} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Contact Us Section */}
//       <div id="contact">
//         <div className="head">
//           <h1>Contact Us</h1>
//         </div>
//         <div className="contact">
//           <h1>Connect With Us</h1>
//           <input type="text" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//           <button id="connectBtn" onClick={handleConnect}>Connect</button>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <div className="footer">
//         <div className="text">
//           <h3>About Us</h3>
//           <p>24 Hours</p>
//           <p>Top Doctor</p>
//           <p>Best Care</p>
//           <p>Patient</p>
//         </div>
//         <div className="text">
//           <h3>Speciality</h3>
//           <p>Knee surgery</p>
//           <p>Spin surgery</p>
//           <p>Leg surgery</p>
//           <p>Tendon surgery</p>
//         </div>
//         <div className="text">
//           <h3>Best Teams</h3>
//           <p>Doctors</p>
//           <p>Nursing</p>
//           <p>Staff</p>
//           <p>Hospital</p>
//         </div>
//         <div className="text">
//           <h3>Address</h3>
//           <p>Near MG Road</p>
//           <p>Galaxy Care</p>
//           <p>333-09093</p>
//           <p>09-883-090</p>
//         </div>
//       </div>

//       {/* Detailed View Modal */}
//       {showDetail && (
//         <div className="detail">
//           <button id="closeBtn" onClick={handleCloseDetail}>
//             <i className="fa-solid fa-xmark"></i>
//           </button>
//           <div className="content">
//             {selectedCard && (
//               <>
//                 <img src={selectedCard.imgSrc} alt={selectedCard.name} />
//                 <div className="contentText">
//                   <h1>{selectedCard.name}</h1>
//                   <p>{selectedCard.description}</p>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HospitalDashboard;

import React, { useState, useEffect } from "react";
import "./Home.css"; // Make sure you have corresponding CSS
import mainsImage from '../Assests/mains.png'; 
import dt1 from '../Assests/dt1.jpg'; // Import images
import dt2 from '../Assests/dt2.jpg';
import dt3 from '../Assests/dt3.jpg';
//import s1 from '../Assets/s1.png';
// import s2 from '../Assets/s2.png';
import s3 from '../Assests/s3.png';
import p1 from '../Assests/p1.png';
import p2 from '../Assests/p2.png';
import p3 from '../Assests/p3.jpg';
import p4 from '../Assests/p4.jpg';
import p5 from '../Assests/p5.jpg';
import p6 from '../Assests/p6.jpg';
import { Link, useNavigate } from 'react-router-dom';
import aboutImage from '../img/galary/room1.jpg';


const HospitalDashboard = () => {
  const [count, setCount] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const slides = [
    { imgSrc: p1, alt: 'Patient 1' }, // Use imported image here
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
  ];

  const specialtyCards = [
    // { imgSrc: s1, title: "Knee Surgery", description: "Lorem ipsum dolor sit amet." },
    // { imgSrc: s2, title: "Spin Surgery", description: "Lorem ipsum dolor sit amet." },
    { imgSrc: s3, title: "Leg Surgery", description: "Lorem ipsum dolor sit amet." },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % slides.length);
    }, 2000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [slides.length]);

  const handleConnect = () => {
    if (email === "" || password === "") {
      alert("Enter Details");
    } else {
      alert("You Logged In");
    }
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedCard(null);
  };

  return (
    <div className="container">
      {/* Navbar */}
      <nav>
        <div className="logo">
          <h1>LifeCare</h1>
        </div>
        <i id="bar" className="fa-solid fa-bars"></i>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/specialities" >Medical Care</Link></li>
        
          <li><Link to="/contact" >Contact Us</Link></li>
         
        </ul>
        <Link to="/login">
    <button className="login-btn">Login</button>
  </Link>
      </nav>

      {/* Main Content */}
      <div className="main">
        <div className="mainText">
          <h1>The Hospital that <br /> Care for you</h1>
          <h3>Best Team's</h3>
          <button>Show more</button>
        </div>
        {/* Use imported image here */}
        <img src={mainsImage} alt="Hospital" />
      </div>

      <div id="about-us">
      <div className="about-us-content">
    <div className="about-us-left">
      <img src={aboutImage} alt="Hospital" /> {/* This is your left side image */}
    </div>
    <div className="about-us-right">
      <h2>About Us</h2>
      <p>
        LifeCare Hospital is dedicated to providing exceptional medical care with a personal touch. Our team of highly trained doctors, nurses, and staff ensure that each patient receives the highest level of care, tailored to their individual needs.
      </p>
      <p>
        Whether you need a routine check-up, specialized treatment, or emergency care, we are here for you. Our state-of-the-art facilities and compassionate approach ensure you get the best possible outcome.
      </p>

      {/* Additional Paragraphs */}
      <p>
        At LifeCare, we understand that each patient’s needs are unique. We take the time to listen to you, understand your concerns, and develop a treatment plan that suits your individual health goals. Our approach prioritizes your well-being, ensuring that you feel comfortable and supported throughout your care journey.
      </p>
      <p>
        We are committed to staying at the forefront of medical advancements. Our hospital is equipped with the latest technology, and our staff undergoes continuous training to provide you with the most up-to-date and effective treatments. We combine innovation with compassion to deliver the best outcomes for our patients.
      </p>
      <p>
        Join the thousands of patients who trust LifeCare Hospital for their health and wellness. Our mission is to provide exceptional care, promote well-being, and improve the quality of life for each person who walks through our doors.
      </p>
    </div>
  </div>
</div>
      {/* Doctors Section */}
      <div id="doctor">
        <div className="head">
          <h1>Our Doctor's</h1>
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
     
 
      {/* Specialties Section */}
      <div id="speciality">
        <div className="head">
          <h1>Our Speciality's</h1>
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
      <div id="patient">
        <div className="head">
          <h1>Patient Review's</h1>
        </div>
        <div className="reviews">
          {slides.map((slide, index) => (
            <div key={index} className="patientReview" style={{ left: `${index * 100}%`, transform: `translateX(-${count * 100}%)` }}>
              <img src={slide.imgSrc} alt={slide.alt} />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Us Section */}
      <div id="contact">
        <div className="head">
          <h1>Contact Us</h1>
        </div>
        <div className="contact">
          <h1>Connect With Us</h1>
          <input type="text" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button id="connectBtn" onClick={handleConnect}>Connect</button>
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


