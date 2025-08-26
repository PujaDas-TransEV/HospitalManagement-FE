
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const testimonialsData = [
  {
    label: "Review 1",
    title: "Mr.",
    name: "John Doe",
    review: `“The care I received at Lifecare was exceptional. The doctors and staff made me feel valued and understood. Highly recommend!”`,
  },
  {
    label: "Review 2",
    title: "Mr.",
    name: "Alex Smith",
    review: `“Lifecare staff went above and beyond to ensure my comfort and quick recovery. Truly a patient-first approach.”`,
  },
  {
    label: "Review 3",
    title: "Ms.",
    name: "Jessica Lee",
    review: `“Amazing doctors and compassionate staff. My experience was outstanding from start to finish.”`,
  },
  {
    label: "Review 4",
    title: "Mr.",
    name: "David Kim",
    review: `“Professional service, excellent care, and friendly environment. Would recommend to all.”`,
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = 2;
  const totalCards = testimonialsData.length;
const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + cardsToShow >= totalCards ? 0 : prevIndex + cardsToShow
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [totalCards]);

  const visibleCards = [];
  for (let i = 0; i < cardsToShow; i++) {
    visibleCards.push(testimonialsData[(currentIndex + i) % totalCards]);
  }

  return (
    <>
      <style>{`
        .testimonials-section {
          max-width: 1400px;
          margin: 60px auto;
          padding: 0 5%;
          display: flex;
          gap: 60px;
          font-family: Arial, sans-serif;
          color: #222;
        }

        .left-side {
          flex: 1;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .doctors-title {
          font-size: 20px;
          color: #c2192f;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: bold;
        }

        .doctors-line-container {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .doctors-line {
          width: 60px;
          height: 3px;
          background-color: #c2192f;
          border-radius: 2px;
          position: relative;
        }

        .doctors-dot {
          width: 10px;
          height: 10px;
          background-color: #c2192f;
          border-radius: 50%;
          position: absolute;
          top: -4px;
          right: 0;
        }

        .heading {
          font-size: 30px;
          font-weight: 900;
          text-transform: capitalize;
          color: #0a3f77ff;
        }

        .description {
          font-size: 16px;
          line-height: 1.5;
          color: #444;
          max-width: 380px;
        }

        .view-all-btn {
          align-self: flex-start;
          padding: 12px 28px;
          background-color: #e4a400;
          color: white;
          font-weight: 700;
          font-size: 16px;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .view-all-btn:hover {
          background-color: #9a0808;
        }

        .right-side {
          flex: 2;
          display: flex;
          gap: 24px;
          overflow: hidden;
        }

        .card-wrapper {
          flex: 1;
        }

        .card-container {
          display: flex;
          gap: 12px;
          align-items: stretch;
        }

        .side-line-dot {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 10px;
        }

        .dot-vertical {
          width: 10px;
          height: 10px;
          background-color: #ca0e0e;
          border-radius: 50%;
        }

        .vertical-line {
          width: 2px;
          flex-grow: 1;
          background-color: #ca0e0e;
          margin-top: 4px;
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          height: 200px;
          overflow: hidden;
          font-size: 14px;
          color: #333;
          flex: 1;
        }

        .card-label {
          position: absolute;
          top: 0;
          left: 0;
          background-color: #6a1b9a;
          color: white;
          padding: 4px 12px;
          font-weight: 700;
          font-size: 12px;
          border-radius: 0 0 8px 0;
          z-index: 2;
        }

        .card-top {
          padding: 20px;
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-style: italic;
        }

        .card-bottom {
          background: #f8d7da;
          padding: 16px;
          text-align: center;
          color: #8b0000;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .card-bottom .title {
          font-size: 18px;
        }

        .card-bottom .name {
          font-size: 18px;
          font-weight: 900;
          margin-top: 4px;
        }
.card-style-a,
.card-style-b {
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 200px;
  overflow: hidden;
  font-size: 14px;
  color: #333;
  flex: 1;
  position: relative;
}

        @media (max-width: 900px) {
          .testimonials-section {
            flex-direction: column;
            padding: 40px 5%;
          }

          .right-side {
            flex-direction: column;
          }

          .card-container {
            flex-direction: row;
          }

          .side-line-dot {
            display: none;
          }
        }
      `}</style>

      <section className="testimonials-section">
        <div className="left-side">
          <div className="doctors-line-container">
            <div className="doctors-title">Testimonials</div>
            <div className="doctors-line">
              <div className="doctors-dot" />
            </div>
          </div>
          <div className="heading">What Our Patient Says</div>
          <p className="description">
            A chorus of gratitude, sharing experiences that highlight exceptional
            care, compassion and medical excellence.
          </p>
       <button className="view-all-btn" onClick={() => navigate("/testimonials")}>
  View All
</button>
        </div>

        <div className="right-side">
          {visibleCards.map(({ label, title, name, review }, idx) => (
            <div className="card-wrapper" key={`${label}-${idx}`}>
              <div className="card-container">
               
              
                </div>
               
                <div className={idx % 2 === 0 ? "card-style-a" : "card-style-b"}>
  <div className="card-label">{label}</div>
  <div className="card-top">{review}</div>
  <div className="card-bottom">
    <div className="title">{title}</div>
    <div className="name">{name}</div>
  </div>
</div>

              </div>
          
          ))}
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;
