import React, { useState } from "react";
import hospitalImage from "../Assests/about-img.webp"; // ✅ Update the path if needed
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: isHovered ? "transparent" : "#E4A400",
    color: isHovered ? "#FFD700" : "#fff",
    border: isHovered ? "2px solid #FFD700" : "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.3s ease",
    marginTop: "20px",
  };
 const handleClick = () => {
    navigate("/about"); // ✅ Update this path based on your route
  };
  return (
    <section
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      {/* Big Centered Image */}
      <img
        src={hospitalImage}
        alt="Peerless Hospital"
        style={{
          width: "100%",
          maxWidth: "1150px",
          height: "auto",
          margin: "0 auto 40px",
          display: "block",
          borderRadius: "10px",
        }}
      />

      {/* Below image: Two columns */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "40px",
          textAlign: "left",
        }}
      >
        {/* Left Column */}
        <div style={{ flex: "1 1 400px", maxWidth: "500px" }}>
          {/* Welcome + Line in Same Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                color: "#9c0c0cff",
                fontSize: "18px",
                fontWeight: "bold",
                margin: 0,
                marginRight: "15px",
              }}
            >
              Welcome to Peerless Hospital
            </p>

            {/* Line with red dot beside text */}
            <div
              style={{
                position: "relative",
                width: "70px",
                height: "4px",
                backgroundColor: "#9e0c0cff",
                borderRadius: "2px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "-4px",
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#c2192fff",
                  borderRadius: "50%",
                }}
              ></div>
            </div>
          </div>

          {/* Left-Aligned Heading */}
          <h2
            style={{
              color: "#0c427cff",
              fontSize: "32px",
              lineHeight: "1.4",
              marginBottom: "20px",
              marginRight:'160px'
            }}
          >
            32 Years of Experience <br />
            in Serving Mankind
          </h2>

          {/* Button */}
        <button
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
          >
            Read More
          </button>
        </div>

        {/* Right Column */}
        <div style={{ flex: "1 1 400px", maxWidth: "600px" }}>
          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.8",
              color: "#333",
            }}
          >
            For close to a hundred years now the Lifecare name has been synonymous
            with trust. Trust that has been won and retained by successive generations
            of Peerless people, who have made it their mission to give back to the
            society more than what it draws from it for sustenance.
            <br />
            <br />
           Lifecare Hospital & B.K. Roy Research Centre, the 500 bed Multi-Specialty
            Corporate Hospital is built around the core principle of selfless,
            single-minded, and sustainable service with ethical practice. Having a
            pioneering status in the healthcare domain in the Eastern part of India
            with what was and continues to be, a world-class facility backed by some
            of the most acclaimed medical practitioners in their respective fields of
            excellence.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
