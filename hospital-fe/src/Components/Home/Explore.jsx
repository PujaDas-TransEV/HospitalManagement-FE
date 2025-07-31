import React from "react";

const ExploreSection = () => {
  return (
    <>
      <style>{`
        .explore-section {
          width: 100%;
          background-color: #e0e0e0;
          font-family: Arial, sans-serif;
          padding: 60px 5%;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
        }

        .explore-container {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          font-weight: 900;
          text-transform: uppercase;
          font-size: 48px;
          user-select: none;
          max-width: 1400px;
          width: 100%;
          line-height: 1.3;
        }

        .black-text {
          color: #000;
          margin-right: 12px;
        }

        .red-text {
          color: #ca0e0e;
          margin-right: 12px;
        }

        .red-background {
          background-color: #ca0e0e;
          color: white;
          padding: 8px 20px;
          border-radius: 8px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          user-select: none;
          font-weight: 900;
          font-size: inherit;
          letter-spacing: 2px;
          margin-left: 370px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .explore-container {
            font-size: 32px;
          }

          .red-background {
            padding: 6px 16px;
          }
        }

        @media (max-width: 480px) {
          .explore-container {
            font-size: 24px;
            gap: 10px;
          }

          .red-background {
            padding: 4px 12px;
          }
        }
      `}</style>

      <section className="explore-section">
        <div className="explore-container">
          <span className="black-text">EXPLORE ALL</span>
          <span className="red-text">LIFECARE SERVICES</span>
          <span className="black-text">UNDER ONE ROOF</span>
          <span className="red-background">LIFECARE</span>
        </div>
      </section>
    </>
  );
};

export default ExploreSection;
