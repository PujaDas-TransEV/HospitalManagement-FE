
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import mainsImage from "../Assests/mains.png";
import surgeryImage from "../Assests/home2.webp";
import supportImage from "../Assests/home1.webp";

const slides = [
  {
    smallLine: "32 Years of Healing and Wellness",
    mainLine: "A Legacy of Healing, Hope and Health",
    description:
      "At the heart of our legacy lies a commitment to your well-being, spanning three decades of exceptional healthcare.",
    image: surgeryImage,
    link: "/about",
  },
  {
    smallLine: "Advanced Surgery Facilities",
    mainLine: "Trusted Hands, Proven Excellence",
    description:
      "Our state-of-the-art surgical infrastructure ensures safe, successful procedures from top-tier specialists.",
    image: supportImage,
    link: "/surgery",
  },
  {
    smallLine: "24/7 Emergency Support",
    mainLine: "Always Ready, Always Near",
    description:
      "No matter the hour, our emergency response team is equipped and ready to help when you need us most.",
    image: mainsImage,
    link: "/emergency",
  },
];

const MainSlider = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNavigate = () => {
    navigate(slides[index].link);
  };

  // Responsive font sizes & layout using media queries with JS approach:
  const getResponsiveStyles = () => {
    if (window.innerWidth <= 480) {
      // Small phones
      return {
        textContainer: {
          maxWidth: "90vw",
          left: "5vw",
          top: "45%",
          padding: "15px",
        },
        smallLine: { fontSize: "1rem" },
        mainLine: { fontSize: "1.8rem" },
        description: { fontSize: "1rem", maxWidth: "100%" },
        button: { width: "140px", fontSize: "0.9rem", padding: "10px 20px" },
        buttonPrevNext: { padding: "8px 14px", fontSize: "1.1rem" },
      };
    } else if (window.innerWidth <= 768) {
      // Tablets and small laptops
      return {
        textContainer: {
          maxWidth: "60vw",
          left: "5vw",
          top: "50%",
          padding: "18px",
        },
        smallLine: { fontSize: "1.1rem" },
        mainLine: { fontSize: "2.2rem" },
        description: { fontSize: "1.1rem", maxWidth: "100%" },
        button: { width: "150px", fontSize: "1rem", padding: "11px 22px" },
        buttonPrevNext: { padding: "10px 18px", fontSize: "1.2rem" },
      };
    } else {
      // Desktop & large
      return {
        textContainer: {
          maxWidth: "40vw",
          left: "5%",
          top: "50%",
          padding: "20px",
        },
        smallLine: { fontSize: "1.2rem" },
        mainLine: { fontSize: "2.8rem" },
        description: { fontSize: "1.2rem", maxWidth: "600px" },
        button: { width: "160px", fontSize: "1rem", padding: "12px 25px" },
        buttonPrevNext: { padding: "12px", fontSize: "1.3rem" },
      };
    }
  };

  const styles = getResponsiveStyles();

  return (
    <div
      style={{
        position: "relative",
        height: "80vh",
        width: "100%",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Images */}
      {slides.map((slide, i) => (
        <img
          key={i}
          src={slide.image}
          alt={`slide-${i}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            objectFit: "cover",
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
            zIndex: i === index ? 1 : 0,
            userSelect: "none",
            pointerEvents: i === index ? "auto" : "none",
          }}
          draggable={false}
        />
      ))}

      {/* Text overlay on left center */}
      <div
        style={{
          position: "absolute",
          top: styles.textContainer.top,
          left: styles.textContainer.left,
          transform: "translateY(-50%)",
          color: "black",
          maxWidth: styles.textContainer.maxWidth,
          padding: styles.textContainer.padding,
          // backgroundColor: "rgba(255, 255, 255, 0.85)",
          borderRadius: "8px",
          // boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "0.6rem",
        }}
      >
        <span
          style={{
            fontSize: styles.smallLine.fontSize,
            fontWeight: "400",
            opacity: 0.85,
            letterSpacing: "1px",
          }}
        >
          {slides[index].smallLine}
        </span>

        <h1
          style={{
            fontSize: styles.mainLine.fontSize,
            fontWeight: "600",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {slides[index].mainLine}
        </h1>

        <p
          style={{
            fontSize: styles.description.fontSize,
            marginTop: "0.5rem",
            lineHeight: "1.5",
            maxWidth: styles.description.maxWidth,
          }}
        >
          {slides[index].description}
        </p>

        <button
          onClick={handleNavigate}
          style={{
            backgroundColor: "#134172ff",
            border: "none",
            borderRadius: "5px",
            padding: styles.button.padding,
            color: "white",
            fontSize: styles.button.fontSize,
            cursor: "pointer",
            marginTop: "1.5rem",
            width: styles.button.width,
            alignSelf: "flex-start",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0f335c")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#134172ff")
          }
        >
          Know More
        </button>
      </div>

      {/* Prev button */}
      <button
        onClick={handlePrev}
        style={{
          position: "absolute",
          top: "50%",
          left: "20px",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: styles.buttonPrevNext.padding,
          cursor: "pointer",
          fontSize: styles.buttonPrevNext.fontSize,
          zIndex: 10,
          userSelect: "none",
          transition: "background-color 0.3s ease",
        }}
        aria-label="Previous Slide"
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.75)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
        }
      >
        <FaArrowLeft />
      </button>

      {/* Next button */}
      <button
        onClick={handleNext}
        style={{
          position: "absolute",
          top: "50%",
          right: "20px",
          transform: "translateY(-50%)",
          background: "rgba(0, 0, 0, 0.5)",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: styles.buttonPrevNext.padding,
          cursor: "pointer",
          fontSize: styles.buttonPrevNext.fontSize,
          zIndex: 10,
          userSelect: "none",
          transition: "background-color 0.3s ease",
        }}
        aria-label="Next Slide"
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.75)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)")
        }
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default MainSlider;
