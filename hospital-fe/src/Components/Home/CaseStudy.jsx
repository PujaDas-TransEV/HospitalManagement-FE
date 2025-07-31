// import React, { useState } from "react";
// import rareCaseImg from '../Assests/case.webp'; // Update path accordingly
// import infocusImg from '../Assests/medical.jpg';    // Update path accordingly

// const CaseStudySection = () => {
//   const [hoverFirstImage, setHoverFirstImage] = useState(false);

//   const images = [
//     {
//       src: rareCaseImg,
//       label: "Rare Case",
//       alt: "Rare Case",
//       link: "/rare-case",
//     },
//     {
//       src: infocusImg,
//       label: "Infocus",
//       alt: "Infocus",
//       link: "/infocus",
//     },
//   ];

//   const handleViewMoreClick = () => {
//     window.location.href = "/case-studies";
//   };

//   return (
//     <section
//       style={{
//         display: "flex",
//         gap: "60px",
//         padding: "60px 5%",
//         fontFamily: "Arial, sans-serif",
//         alignItems: "flex-start",
//         flexWrap: "wrap",
//         backgroundColor: "#f9faff",
//       }}
//     >
//       {/* Left side content with labels and images below */}
//       <div style={{ flex: "1 1 400px", minWidth: "320px", paddingLeft: "40px" }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//             marginBottom: "12px",
//           }}
//         >
//           <span
//             style={{
//               fontSize: "14px",
//               fontWeight: "600",
//               color: "#ca0e0eff",
//               textTransform: "uppercase",
//             }}
//           >
//             Case Study
//           </span>
//         <div
//             style={{
//               position: "relative",
//               width: "80px",
//               height: "4px",
//               backgroundColor: "#ca0e0eff",
//               borderRadius: "2px",
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 right: 0,
//                 top: "-4px",
//                 width: "12px",
//                 height: "12px",
//                 backgroundColor: "#c2192fff",
//                 borderRadius: "50%",
//               }}
//             ></div>
//             </div></div>

//         {/* Labels in one line */}
//         <div
//           style={{
//             display: "flex",
//             gap: "48px",
//             color: "#0056b3",
//             fontSize: "32px",
//             fontWeight: "700",
//             textTransform: "uppercase",
//             marginBottom: "24px",
//           }}
//         >
//           <span>Rare Case and Infocus</span>
         
//         </div>

//         {/* Images below each label side by side */}
//         <div
//           style={{
//             display: "flex",
//             gap: "48px",
//           }}
//         >
//           {/* First image with hover overlay */}
//           <div
//             style={{
//               position: "relative",
//               width: "800px",
//               height: "500px",
//               overflow: "hidden",
//               cursor: "pointer",
//               boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
//               backgroundColor: "#fff",
//               flexShrink: 0,
//             }}
//             onMouseEnter={() => setHoverFirstImage(true)}
//             onMouseLeave={() => setHoverFirstImage(false)}
//             onClick={() => (window.location.href = images[0].link)}
//           >
//             <img
//               src={images[0].src}
//               alt={images[0].alt}
//               style={{ width: "120%", height: "100%", objectFit: "cover" }}
//             />
//             {/* Overlay animation */}
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 height: hoverFirstImage ? "210px" : "0",
//                 backgroundColor: "rgba(0,0,0,0.6)",
//                 color: "white",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 transition: "height 0.3s ease",
//                 overflow: "hidden",
//                 userSelect: "none",
//               }}
//             >
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   window.location.href = "/case-studies";
//                 }}
//                 style={{
//                   backgroundColor: "#FFD700",
//                   color: "#000",
//                   border: "none",
//                   borderRadius: "6px",
//                   padding: "12px 32px",
//                   fontWeight: "700",
//                   fontSize: "18px",
//                   cursor: "pointer",
//                   boxShadow: "0 3px 8px rgba(255, 215, 0, 0.7)",
//                   transition: "background-color 0.3s",
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e6c200")}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFD700")}
//                 aria-label="View more case studies"
//               >
//                 View More
//               </button>
//             </div>
//             {/* Label below image */}
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "-48px",
//                 width: "100%",
//                 textAlign: "center",
//                 fontWeight: "700",
//                 fontSize: "24px",
//                 color: "#0056b3",
//                 userSelect: "none",
//               }}
//             >
//               {images[0].label}
//             </div>
//           </div>

//           {/* Second image normal */}
//           <div
//             style={{
//               position: "relative",
//               width: "800px",
//               height: "500px",
//               overflow: "hidden",
//               boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
//               backgroundColor: "#fff",
//               flexShrink: 0,
//               cursor: "pointer",
//             }}
//             onClick={() => (window.location.href = images[1].link)}
//           >
//             <img
//               src={images[1].src}
//               alt={images[1].alt}
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//             {/* Label below image */}
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "-48px",
//                 width: "100%",
//                 textAlign: "center",
//                 fontWeight: "700",
//                 fontSize: "24px",
//                 color: "#0056b3",
//                 userSelect: "none",
//               }}
//             >
//               {images[1].label}
//             </div>
//           </div>
//         </div>
//       </div>

    

     
//     </section>
//   );
// };

// export default CaseStudySection;
import React, { useState } from "react";
import rareCaseImg from '../Assests/case.webp';
import infocusImg from '../Assests/medical.jpg';

const CaseStudySection = () => {
  const [hoverFirstImage, setHoverFirstImage] = useState(false);

  const images = [
    {
      src: rareCaseImg,
      label: "Rare Case",
      alt: "Rare Case",
      link: "/rare-case",
    },
    {
      src: infocusImg,
      label: "Infocus",
      alt: "Infocus",
      link: "/infocus",
    },
  ];

  return (
    <>
      <style>{`
        section.case-section {
          display: flex;
          justify-content: center;
          padding: 60px 5%;
          background-color: #f9faff;
          font-family: Arial, sans-serif;
        }

        .case-container {
          flex: 1 1 auto;
          max-width: 1400px;
          padding-left: 40px;
          box-sizing: border-box;
        }

        .case-header-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .case-label {
          font-size: 14px;
          font-weight: 600;
          color: #ca0e0eff;
          text-transform: uppercase;
        }

        .case-red-bar {
          position: relative;
          width: 80px;
          height: 4px;
          background-color: #ca0e0eff;
          border-radius: 2px;
        }

        .case-red-dot {
          position: absolute;
          right: 0;
          top: -4px;
          width: 12px;
          height: 12px;
          background-color: #c2192fff;
          border-radius: 50%;
        }

        .case-title {
          color: #0056b3;
          font-size: 32px;
          font-weight: 700;
        //   text-transform: uppercase;
          margin-bottom: 24px;
        }

        .case-images-wrapper {
          display: flex;
          gap: 48px;
          flex-wrap: nowrap;
          justify-content: flex-start;
        }

        .case-image-box {
          position: relative;
          width: 48%; /* About half width */
          max-width: 800px;
          height: 500px;
          overflow: hidden;
          background-color: #fff;
          box-shadow: 0 6px 15px rgba(0,0,0,0.2);
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .case-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
          flex-grow: 1;
        }

        /* Hover effect only on first image */
        .case-image-box.first:hover img {
          transform: scale(1.05);
        }

        .case-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 0;
          background-color: rgba(0,0,0,0.6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          user-select: none;
          transition: height 0.3s ease;
          z-index: 10;
        }

        .case-overlay.show {
          height: 210px;
        }

        .case-view-more-btn {
          background-color: #FFD700;
          color: #000;
          border: none;
          border-radius: 6px;
          padding: 12px 32px;
          font-weight: 700;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(255, 215, 0, 0.7);
          transition: background-color 0.3s;
        }

        .case-view-more-btn:hover {
          background-color: #e6c200;
        }

        .case-label-below {
          margin-top: 12px;
          font-weight: 700;
          font-size: 24px;
          color: #0056b3;
          user-select: none;
          text-align: center;
          width: 100%;
          padding-bottom: 8px;
        }

        /* Responsive: stack images vertically on smaller screens */
        @media (max-width: 1024px) {
          .case-images-wrapper {
            flex-wrap: wrap;
            gap: 32px;
            justify-content: center;
          }
          .case-image-box {
            width: 100%;
            max-width: 100%;
            height: 400px;
          }
        }

        @media (max-width: 480px) {
          .case-image-box {
            height: 300px;
          }
          .case-title {
            font-size: 24px;
          }
          .case-label-below {
            font-size: 20px;
          }
        }
      `}</style>

      <section className="case-section">
        <div className="case-container">
          <div className="case-header-row">
            <span className="case-label">Case Study</span>
            <div className="case-red-bar">
              <div className="case-red-dot"></div>
            </div>
          </div>

          <div className="case-title">Rare Case and Infocus</div>

          <div className="case-images-wrapper">
            {/* First Image */}
            <div
              className="case-image-box first"
              onMouseEnter={() => setHoverFirstImage(true)}
              onMouseLeave={() => setHoverFirstImage(false)}
              onClick={() => (window.location.href = images[0].link)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if(e.key === "Enter") window.location.href = images[0].link; }}
              aria-label={images[0].label}
            >
              <img src={images[0].src} alt={images[0].alt} />
              <div className={`case-overlay ${hoverFirstImage ? "show" : ""}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = "/case-studies";
                  }}
                  className="case-view-more-btn"
                  aria-label="View more case studies"
                >
                  View More
                </button>
              </div>
              <div className="case-label-below">{images[0].label}</div>
            </div>

            {/* Second Image */}
            <div
              className="case-image-box"
              onClick={() => (window.location.href = images[1].link)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if(e.key === "Enter") window.location.href = images[1].link; }}
              aria-label={images[1].label}
            >
              <img src={images[1].src} alt={images[1].alt} />
              <div className="case-label-below">{images[1].label}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CaseStudySection;
