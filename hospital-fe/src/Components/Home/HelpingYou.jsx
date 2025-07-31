import React, { useState } from "react";
import onlineAppointmentImg from "../Assests/online.webp";
import teleconsultationImg from "../Assests/teleconsultation.webp";
import billEnquiryImg from "../Assests/bill.webp";
import reportsDownloadImg from "../Assests/reports.webp";

const infoItems = [
  {
    number: "1",
    title: "Online Appointment",
    desc: "Access healthcare easily with our online booking.",
    img: onlineAppointmentImg,
    link: "/online-appointment",
  },
  {
    number: "2",
    title: "Teleconsultation",
    desc: "Consult securely with our healthcare experts online.",
    img: teleconsultationImg,
    link: "/teleconsultation",
  },
  {
    number: "3",
    title: "Bill Enquiry & Payment",
    desc: "Simplify healthcare with online payments.",
    img: billEnquiryImg,
    link: "/bill-payment",
  },
  {
    number: "4",
    title: "Reports Download",
    desc: "Get your investigation reports with just one click.",
    img: reportsDownloadImg,
    link: "/reports-download",
  },
];

const NextSection = () => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const handleEnquire = () => {
    // submission logic here
    closeModal();
  };
  const [isCallHover, setIsCallHover] = useState(false);
  const [isEmailHover, setIsEmailHover] = useState(false);

  const callNumber = "033 4011 1222 / +91 98741 93376";
  const emailAddress = "internationaldesk@peerlesshospital.com";
 
  return (
    <>
      <div
        style={{
          backgroundColor: "transparent",
          padding: "40px 60px",
          fontFamily: "Arial, sans-serif",
          color: "#000",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header Row */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30, gap: 20 }}>
          <div
            style={{
              color: "#bd1313ff",
              fontWeight: "bold",
              fontSize: 20,
              cursor: "default",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0000FF")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#bd1313ff")}
          >
            Simple Process
          </div>
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "4px",
              backgroundColor: "#ca0e0eff",
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

        {/* Subheading */}
        <div style={{ fontWeight: "bold", fontSize: 30, marginBottom: 30, color: "#1a518bff" }}>
          Helping You Stay Strong
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", gap: 30, alignItems: "flex-start" }}>
          {/* Left Section */}
          <div style={{ display: "flex", gap: 30, flex: 1, marginLeft: "-40px" }}>
            {infoItems.map(({ number, title, desc, img, link }) => (
              <div key={number} style={{ minWidth: 220, textAlign: "center" }}>
                <div style={{ position: "relative", paddingTop: "16px" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "0",
                      transform: "translate(50%, -40%)",
                      backgroundColor: "#E4A400",
                      color: "white",
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: 18,
                      boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                      border: "3px solid white",
                      zIndex: 2,
                    }}
                  >
                    {number}
                  </div>

                  {/* Image */}
                  <div
                    style={{
                      width: "100%",
                      height: 170,
                      borderRadius: 8,
                      overflow: "hidden",
                      backgroundColor: "#eee",
                    }}
                  >
                    <img
                      src={img}
                      alt={title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>

                {/* Title */}
                <a
                  href={link}
                  style={{
                    display: "inline-block",
                    marginTop: 10,
                    fontWeight: "bold",
                    fontSize: 20,
                    color: "#1a518bff",
                    textDecoration: "none",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#7B3F00")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#1a518bff")}
                >
                  {title}
                </a>

                {/* Description */}
                <div
                  style={{
                    fontSize: 18,
                    marginTop: 4,
                    color: "#444",
                    lineHeight: "1.3",
                    maxWidth: "220px",
                    margin: "0 auto",
                    marginTop:'8px'
                  }}
                >
                  {desc}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Info Card */}
          <div
            style={{
              backgroundColor: "#fff6E0",
              borderRadius: 20,
              padding: 30,
              width: 400,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              position: "relative",
                marginTop: '-120px', 
                marginLeft:'30px'
            }}
          >
            <div style={{ marginTop: 20, paddingLeft: 10 }}>
              {/* Title Row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#b81414ff",
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                <span style={{ marginBottom: "2px" }}>International Patient</span>
                <div
                  style={{
                    position: "relative",
                    width: "80px",
                    height: "4px",
                    backgroundColor: "#ca0e0eff",
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

              <div style={{ fontSize: 25, fontWeight: "bold", color: "#093c72ff", marginBottom: 10 }}>
                International Helpdesk
              </div>
              <p style={{ fontSize: 18, color: "#222", marginBottom: 15 }}>
                Our international patient helpdesk ensures seamless healthcare
                with support in enquiries, appointments, and travel arrangements.
                Trust us for personalized assistance and the highest standard of
                care.
              </p>
           
   <div style={{ fontWeight: "bold", color: "#7B3F00", marginBottom: 5 }}>
        Call :{" "}
        <a
          href="tel:03340111222"
          onMouseEnter={() => setIsCallHover(true)}
          onMouseLeave={() => setIsCallHover(false)}
          style={{
            color: isCallHover ? "#08315eff" : "#7B3F00",
            textDecoration: "none",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "color 0.3s",
          }}
        >
          {callNumber}
        </a>
      </div>

      <div style={{ fontWeight: "bold", color: "#7B3F00", marginBottom: 20 }}>
        Email :{" "}
        <a
          href={`mailto:${emailAddress}`}
          onMouseEnter={() => setIsEmailHover(true)}
          onMouseLeave={() => setIsEmailHover(false)}
          style={{
            color: isEmailHover ? "#0d3969ff" : "#7B3F00",
            textDecoration: "none",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "color 0.3s",
          }}
        >
          {emailAddress}
        </a>
      </div>
          
               <button
    onClick={openModal}
    style={{
      backgroundColor: showModal ? "transparent" : "#09396dff",
      border: "2px solid #0b3d72ff",
      color: showModal ? "#0b3d72ff" : "#fff",
      borderRadius: "5px",
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
      width: "100%",
      transition: "background-color 0.3s ease, color 0.3s ease",
    }}
    onMouseEnter={(e) => {
      if (!showModal) e.currentTarget.style.backgroundColor = "transparent";
    }}
    onMouseLeave={(e) => {
      if (!showModal) e.currentTarget.style.backgroundColor = "#09396dff";
    }}
  >
    Enquire Now
  </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
           {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              position: "relative",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "22px",
                cursor: "pointer",
                color: "#555",
              }}
              aria-label="Close enquiry form"
            >
              ✕
            </button>

            <h2 style={{ marginBottom: "20px", color: "#0a3461ff" }}>Enquiry Form</h2>

            <input
              type="text"
              placeholder="Full Name"
             style={{
    width: "100%",
    padding: "12px 14px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    fontFamily: "Arial, sans-serif",
    transition: "all 0.3s ease",
    outline: "none",
  }}
  onFocus={(e) => {
    e.target.style.border = "1px solid #4A90E2";
    e.target.style.boxShadow = "0 0 5px rgba(74, 144, 226, 0.5)";
    e.target.style.backgroundColor = "#f9fcff";
  }}
  onBlur={(e) => {
    e.target.style.border = "1px solid #ccc";
    e.target.style.boxShadow = "none";
    e.target.style.backgroundColor = "white";
  }}
            />

           
<input
  type="email"
  placeholder="Email"
  style={{
    width: "100%",
    padding: "12px 14px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    fontFamily: "Arial, sans-serif",
    transition: "all 0.3s ease",
    outline: "none",
  }}
  onFocus={(e) => {
    e.target.style.border = "1px solid #4A90E2";
    e.target.style.boxShadow = "0 0 5px rgba(74, 144, 226, 0.5)";
    e.target.style.backgroundColor = "#f9fcff";
  }}
  onBlur={(e) => {
    e.target.style.border = "1px solid #ccc";
    e.target.style.boxShadow = "none";
    e.target.style.backgroundColor = "white";
  }}
/>

            <input
              type="text"
              placeholder="Phone No"
             style={{
    width: "100%",
    padding: "12px 14px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
    fontFamily: "Arial, sans-serif",
    transition: "all 0.3s ease",
    outline: "none",
  }}
  onFocus={(e) => {
    e.target.style.border = "1px solid #4A90E2";
    e.target.style.boxShadow = "0 0 5px rgba(74, 144, 226, 0.5)";
    e.target.style.backgroundColor = "#f9fcff";
  }}
  onBlur={(e) => {
    e.target.style.border = "1px solid #ccc";
    e.target.style.boxShadow = "none";
    e.target.style.backgroundColor = "white";
  }}
            />

            <textarea
              placeholder="Message"
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            />

            <button
              onClick={handleEnquire}
              style={{
                backgroundColor: "#06223fff",
                color: "white",
                padding: "10px 20px",
                width: "100%",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NextSection;
