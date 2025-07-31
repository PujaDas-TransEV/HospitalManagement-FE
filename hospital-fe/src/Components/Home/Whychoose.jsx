
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat, FaCalendarCheck, FaClock } from "react-icons/fa";

const services = [
  {
    title: "Patient Info",
    icon: <FaHeartbeat color="#c2192f" />,
    items: [
   
      { label: "Patient Guide", path: "/patient-guide" },
      { label: "International Patient", path: "/international-patient" },
      { label: "Inpatient Payment", path: "/inpatient-payment" },
      { label: "Reports Download", path: "/reports-download" },
      {
        label: "List of Empanelled Corporates and TPAs",
        path: "/empanelled-corporates",
      },
    ],
  },
  {
    title: "Appointments",
    icon: <FaCalendarCheck color="#c2192f" />,
    items: [
      { label: "Online Appointment", path: "/online-appointment" },
      { label: "Appointment Request", path: "/appointment-request" },
      { label: "Teleconsultation", path: "/teleconsultation" },
      { label: "Appointment by Phone", path: "/appointment-phone" },
    ],
  },
  {
    title: "24/7 Services",
    icon: <FaClock color="#c2192f" />,
    items: [
      { label: "Emergency and Trauma", path: "/emergency-trauma" },
      { label: "Ambulance Service", path: "/ambulance-service" },
     
      { label: "Laboratory", path: "/laboratory" },
      { label: "Radiology", path: "/radiology" },
      { label: "Operation Theatre", path: "/operation-theatre" },
      { label: "Pharmacy", path: "/pharmacy" },
    ],
  },
];

const WhyChooseUs = () => {
  const navigate = useNavigate();

  // Responsive left padding for container div
  const containerStyle = {
    paddingLeft: "300px",
    paddingRight: "20px",
  };

  // We'll use a media query via a hook to update paddingLeft for smaller screens
  // But since inline styles don't support media queries, let's add a small effect with window width

  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPaddingLeft = () => {
    if (windowWidth <= 480) return "20px";
    if (windowWidth <= 768) return "60px";
    if (windowWidth <= 1024) return "120px";
    return "300px";
  };

  return (
    <section
      style={{
        backgroundColor: "#e5f0ff",
        padding: "60px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Container with responsive left padding */}
      <div style={{ paddingLeft: getPaddingLeft(), paddingRight: "20px" }}>
        {/* Title & Red Dot Line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              color: "#8a0e14ff",
              margin: 0,
              marginRight: "15px",
            }}
          >
            Why Choose Us
          </h3>
          <div
            style={{
              position: "relative",
              width: "60px",
              height: "3px",
              backgroundColor: "#c2192f",
              borderRadius: "1px",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "-3px",
                width: "10px",
                height: "10px",
                backgroundColor: "#c2192f",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "28px",
            color: "#0a3f77ff",
            marginBottom: "40px",
             fontWeight: "bold",
          }}
        >
          Patient Services
        </p>

        {/* Cards Row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: windowWidth < 480 ? "center" : "flex-start",
          }}
        >
          {services.map((service, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#fff",
                width: "320px",
                padding: "24px 20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                textAlign: "left",
                position: "relative",
              }}
            >
              {/* Red circle icon */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "2px solid #c2192f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                }}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h4
                style={{
                  marginLeft: "56px",
                  fontSize: "20px",
                  color: "#0a3f77ff",
                  marginTop: 15,
                  marginBottom: "16px",
                }}
              >
                {service.title}
              </h4>

              {/* Inline Links Sentence */}
              <div
                style={{
                  marginLeft: "10px",
                  lineHeight: "1.8",
                  color: "#333",
                  fontSize: "16px",
                  wordBreak: "break-word",
                }}
              >
                {service.items.map((item, i) => {
                  // For 3rd card, remove margin after "Blood Centre" (index 2)
                  const noMarginAfter =
                    idx === 2 && item.label === "Blood Centre";

                  return (
                    <span
                      key={i}
                      onClick={() => navigate(item.path)}
                      style={{
                        cursor: "pointer",
                        color: "#333",
                        textDecoration: "none",
                        transition: "color 0.3s",
                        marginRight: noMarginAfter ? "0px" : "6px",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#c2192f")}
                      onMouseLeave={(e) => (e.target.style.color = "#333")}
                    >
                      {item.label}
                      {i < service.items.length - 1 && ","}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
