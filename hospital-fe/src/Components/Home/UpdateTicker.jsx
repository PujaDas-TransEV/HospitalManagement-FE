import React from "react";

const UpdateTicker = () => {
  const updates = [
    {
      black: "FOR ADMISSION IN B.SC NURSING,",
      red: " PLEASE DIRECT YOUR APPLICATION TO PEERLESS HOSPITAL AND B.K ROY RESEARCH CENTRE",
    },
    {
      black: "DETAILS OF UNCLAIMED DIVIDEND FOR FY 2023-24 -",
      red: " SECTION 124 (2)",
    },
    {
      black: "NOTICE OF EGM",
    },
    {
      red: "ANNUAL RETURN 2022-23",
     
    },
    {
      red: "ANNUAL RETURN 2022",
    
    },
    {
      red: "ANNUAL RETURN 2023-24",
    
    },
    {
        red:'APPLICATIONS INVITED FOR CET COACHING'
    },
    {
      black: "HEALTHCARE EXCELLENCE,",
      red: " DRIVEN BY COMPASSION",
    },
    {
      black: "BOOK APPOINTMENTS ONLINE",
      red: " — QUICK AND EASY",
    },
  ];

  // Generate scrolling content with trailing "|"
  const generateTickerHTML = () =>
    updates
      .map((item) => {
        const blackPart = item.black
          ? `<span style="color:black; font-weight:500">${item.black}</span>`
          : "";
        const redPart = item.red
          ? `<span style="color:red; font-weight:500">${item.red}</span>`
          : "";
        return `${blackPart}${redPart}<span style="color:gray; font-weight:700; margin: 0 20px">|</span>`;
      })
      .join("");

  const tickerText = generateTickerHTML();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "50px",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
        lineHeight: "50px",
        backgroundColor: "#d0ddf3ff",
      }}
    >
      {/* Left Label */}

<div
  style={{
    backgroundColor: "#1a518bff",
    color: "white",
    padding: "0 30px",
    fontWeight: "bold",
    fontSize: "18px",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "200px", // Increased from 140px
    width: "180px",     // Optional: set fixed width for consistent layout
  }}
>
  Updates
</div>

      {/* Right Scroll Area */}
      <div
        style={{
          flex: 1,
          position: "relative",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            whiteSpace: "nowrap",
            display: "inline-block",
            animation: "scroll-left 60s linear infinite",
            fontSize: "16px",
          }}
        >
          {/* Duplicate ticker text for seamless loop */}
          <span
            dangerouslySetInnerHTML={{
              __html: tickerText + tickerText,
            }}
          />
        </div>
      </div>

      {/* Keyframes for animation */}
      <style>
        {`
          @keyframes scroll-left {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default UpdateTicker;

