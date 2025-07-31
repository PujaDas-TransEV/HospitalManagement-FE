
import React, { useEffect, useState } from "react";
import {
  FaStethoscope,
  FaShuttleVan,
  FaPassport,
  FaUserTie,
} from "react-icons/fa";
import international1 from "../Assests/international-patient-home.webp";

const InternationalSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      style={{
        backgroundColor: "#fff",
        padding: isMobile ? "30px 20px" : "60px 80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          flexWrap: "wrap",
          gap: "30px",
          alignItems: "flex-start",
          marginLeft: isMobile ? "0px" : "200px",
        }}
      >
        {/* Left image */}
        <div style={{ flex: "1 1 300px" }}>
          <img
            src={international1}
            alt="International"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              marginBottom: isMobile ? "20px" : "0",
            }}
          />
        </div>

        {/* Text + Cards */}
        <div style={{ flex: "1 1 400px" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <p
              style={{
                color: "#c2192f",
                fontSize: "16px",
                margin: 0,
                fontWeight: "bold",
                marginRight: "10px",
              }}
            >
              International Patient
            </p>
            <div
              style={{
                position: "relative",
                width: "50px",
                height: "3px",
                backgroundColor: "#c2192f",
                borderRadius: "1px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "-4px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#c2192f",
                  borderRadius: "50%",
                }}
              ></div>
            </div>
          </div>

          {/* Heading */}
          <h2
            style={{
              color: "#0c427c",
              fontSize: isMobile ? "22px" : "28px",
              marginBottom: "30px",
              marginRight: isMobile ? "0" : "340px",
            }}
          >
            Facilities for International Patients
          </h2>

          {/* Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, auto)",
              gap: "12px",
              alignItems: "start",
            }}
          >
            <div style={cardStyle}>
              <FaStethoscope size={30} color="#0c427c" />
              <span>
                Health Check-up
                <br />
                Packages
              </span>
            </div>
            <div style={cardStyle}>
              <FaShuttleVan size={30} color="#0c427c" />
              <span>
                Airport Pick Up
                <br />
                and Drop
              </span>
            </div>
            <div style={cardStyle}>
              <FaPassport size={30} color="#0c427c" />
              <span>
                Travel Desk / Visa
                <br />
                Assistance
              </span>
            </div>
            <div style={cardStyle}>
              <FaUserTie size={30} color="#0c427c" />
              <span>
                Dedicated Relationship
                <br />
                Managers
              </span>
            </div>
          </div>

          {/* Helpdesk Box */}
          <div
            style={{
              marginTop: "30px",
              backgroundColor: "#e5f0ff",
              padding: "20px",
              border: "2px solid #0c427c",
              borderRadius: "6px",
              maxWidth: isMobile ? "100%" : "80%",
            }}
          >
            <p
              style={{
                color: "#c2192f",
                margin: 0,
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              International Helpdesk :
            </p>
            <p
              style={{
                color: "#0c427c",
                fontSize: "16px",
                marginTop: "8px",
              }}
            >
              033 2462 2462 / internationaldesk@peerlesshospital.com
            </p>
          </div>

          {/* Button */}
          <button
            onClick={() => (window.location.href = "/international-patient")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#E4A400",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#FFD700";
              e.target.style.border = "2px solid #FFD700";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#FFD700";
              e.target.style.color = "#fff";
              e.target.style.border = "none";
            }}
          >
            Know More
          </button>
        </div>
      </div>
    </section>
  );
};

// Reusable card style
const cardStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  backgroundColor: "#f0d3d7ff",
  padding: "15px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "bold",
  color: "#c2192f",
  lineHeight: "1.4",
  width: "max-content",
  minWidth: "220px",
  maxWidth: "260px",
};

export default InternationalSection;
