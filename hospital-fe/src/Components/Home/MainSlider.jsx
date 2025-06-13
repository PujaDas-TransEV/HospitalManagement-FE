
import React, { useState, useEffect } from 'react';
import './MainSlider.css';
import { useNavigate } from 'react-router-dom';
import mainsImage from '../Assests/mains.png';
import cardiologyImage from '../img/slider/surgery.png';
import neurologyImage from '../img/slider/support.png';

const slides = [
  {
    titleLine1: 'The Hospital that',
    titleLine2: 'Cares for You',
    subtitle: "Best Team's",
  },
  {
    titleLine1: 'Advanced Surgery',
    titleLine2: 'Facilities',
    subtitle: 'Expert Doctors',
  },
  {
    titleLine1: '24/7 Emergency',
    titleLine2: 'Support',
    subtitle: 'We’re Here Anytime',
  },
];

const MainSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % slides.length);
        setAnimating(false);
      }, 500); // match transition timing
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleShowMore = () => {
    navigate('/about');
  };

  return (
    <div className="main-slider">
      <div className={`mainText ${animating ? 'text-out' : 'text-in'}`}>
        <h1>
          {slides[currentIndex].titleLine1}
          <br />
          {slides[currentIndex].titleLine2}
        </h1>
        <h3>{slides[currentIndex].subtitle}</h3>
        <button style={{ color: 'white', backgroundColor: 'black', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer',height:'50px',width:'150px' }} onClick={handleShowMore}>
   Show more
 </button>
      </div>
      <div className="staticImage">
        <img src={mainsImage} alt="Hospital" />
      </div>
    </div>
  );
};

export default MainSlider;
