
// import React, { useState } from "react";
// import { FaPhoneAlt, FaEnvelope, FaAmbulance } from "react-icons/fa";

// const MiniNavbar = () => {
//   const [location, setLocation] = useState("Kolkata");

//   const handleLocationChange = (e) => {
//     const selectedLocation = e.target.value;
//     setLocation(selectedLocation);
//     // Redirect logic (adjust URLs as needed)
//     if (selectedLocation === "Kolkata") {
//       window.location.href = "/";
//     } else if (selectedLocation === "Guahati") {
//       window.location.href = "/";
//     }
//   };

//   return (
//     <>
//       <style>{`
//         .mini-navbar {
//           background-color: #193d81;
//           color: white;
//           font-family: Arial, sans-serif;
//           font-size: 15px;
//           height: 40px; /* increased height */
//           display: flex;
//           align-items: center;
//           padding: 0 15px;
//           justify-content: space-between;
//           flex-wrap: nowrap;
//         }
//         .mini-navbar-left {
//           display: flex;
//           align-items: center;
//           gap: 18px;
//           flex-grow: 1; /* take most space */
//           overflow-x: auto;
//         }
//         .mini-navbar-item {
//           display: flex;
//           align-items: center;
//           white-space: nowrap;
//           flex-shrink: 0;
//         }
//         .icon-circle {
//           background-color: white;
//           border-radius: 50%;
//           color: #193d81;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           width: 22px;
//           height: 22px;
//           font-size: 14px;
//           margin-right: 8px;
//           flex-shrink: 0;
//         }
//         .separator {
//           color: white;
//           margin: 0 12px;
//           user-select: none;
//           flex-shrink: 0;
//         }
//         .emergency-number {
//           font-weight: 600;
//         }
//         .ambulance-icon {
//           color: red;
//           margin-right: 8px;
//           flex-shrink: 0;
//           display: flex;
//           align-items: center;
//           font-weight: 700;
//           font-size: 18px;
//         }
//         /* Location container */
//         .location-container {
//           background-color: white;
//           color: #193d81;
//           font-weight: 600;
//           padding: 3px 14px;
//           border-radius: 20px; /* pill shape */
//           display: flex;
//           align-items: center;
//           white-space: nowrap;
//           cursor: pointer;
//           user-select: none;
//         }
//         .location-label {
//           margin-right: 10px;
//           font-weight: 700;
//         }
//         select.location-select {
//           background-color: transparent;
//           color: #193d81;
//           border: none;
//           font-weight: 600;
//           cursor: pointer;
//           outline: none;
//           -webkit-appearance: none; /* Remove default arrow for Webkit */
//           -moz-appearance: none; /* Remove default arrow for Firefox */
//           appearance: none;
//           padding-right: 12px;
//           font-size: 15px;
//           font-family: inherit;
//           user-select: text;
//         }
//         /* Add custom dropdown arrow with CSS */
//         .location-container {
//           position: relative;
//         }
//         .location-container::after {
//           content: '';
//           position: absolute;
//           right: 10px;
//           top: 50%;
//           transform: translateY(-50%);
//           border: 6px solid transparent;
//           border-top-color: #193d81;
//           pointer-events: none;
//         }
//         /* Responsive */
//         @media (max-width: 480px) {
//           .mini-navbar {
//             font-size: 13px;
//             height: 36px;
//             padding: 0 10px;
//           }
//           .icon-circle {
//             width: 20px;
//             height: 20px;
//             font-size: 12px;
//             margin-right: 6px;
//           }
//           .mini-navbar-left {
//             gap: 12px;
//           }
//           .ambulance-icon {
//             font-size: 16px;
//           }
//           .location-container {
//             padding: 2px 10px;
//             font-size: 13px;
//             border-radius: 16px;
//           }
//           select.location-select {
//             font-size: 13px;
//           }
//         }
//       `}</style>

//       <div className="mini-navbar" role="banner" aria-label="Top contact and emergency info">
//         <div className="mini-navbar-left">
//           {/* Call Icon */}
//           <div className="mini-navbar-item">
//             <div className="icon-circle" aria-label="Call icon">
//               <FaPhoneAlt size={12} />
//             </div>
//             <span>+91 12345 67890</span>
//           </div>

//           {/* Mail Icon + mail id */}
//           <div className="mini-navbar-item">
//             <div className="icon-circle" aria-label="Mail icon">
//               <FaEnvelope size={12} />
//             </div>
//             <span>mail@example.com</span>
//           </div>

//           <div className="separator" aria-hidden="true">|</div>

//           {/* Emergency */}
//           <div className="mini-navbar-item emergency-number">
//             Emergency: +91 89810 80008
//           </div>

//           <div className="separator" aria-hidden="true">|</div>

//           {/* Ambulance red icon + number */}
//           <div className="mini-navbar-item ambulance-icon" aria-label="Ambulance icon">
//             <FaAmbulance size={18} />
//             <span style={{ marginLeft: "6px", color: "white", fontWeight: "600" }}>
//               Ambulance: +91 90382 24000 / +91 90382 25000
//             </span>
//           </div>

//           <div className="separator" aria-hidden="true">|</div>

//           {/* Location Dropdown */}
//           <div className="mini-navbar-item location-container">
//             <span className="location-label">Location:</span>
//             <select
//               id="location-select"
//               className="location-select"
//               value={location}
//               onChange={handleLocationChange}
//               aria-label="Select location"
//             >
//               <option value="Kolkata">Kolkata</option>
//               <option value="Guahati">Guahati</option>
//             </select>
//           </div>
//         </div>

//         {/* Right side empty */}
//         <div className="mini-navbar-right" style={{ flexShrink: 0 }} aria-hidden="true"></div>
//       </div>
//     </>
//   );
// };

// export default MiniNavbar;
import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaAmbulance } from "react-icons/fa";
import './Mininavbar.css'
const MiniNavbar = () => {
  const [location, setLocation] = useState("Kolkata");

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation);
    // Redirect logic (adjust URLs as needed)
    if (selectedLocation === "Kolkata") {
      window.location.href = "/";
    } else if (selectedLocation === "Guahati") {
      window.location.href = "/";
    }
  };

  return (
    <>
      <style>{`
        .mini-navbar {
          background-color: #193d81;
          color: white;
          font-family: Arial, sans-serif;
          font-size: 15px;
          height: 40px;
          display: flex;
          align-items: center;
          padding: 0 10px; /* smaller general padding */
          justify-content: space-between;
          flex-wrap: nowrap;
        }
        .mini-navbar-left {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-grow: 1;
          overflow-x: auto;
          padding-left: 40px; /* big left gap here */
        }
        .mini-navbar-right {
          flex-shrink: 0;
          padding-right: 40px; /* optional right gap for symmetry */
        }
        .mini-navbar-item {
          display: flex;
          align-items: center;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .icon-circle {
          background-color: white;
          border-radius: 50%;
          color: #193d81;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 22px;
          height: 22px;
          font-size: 14px;
          margin-right: 8px;
          flex-shrink: 0;
        }
        .separator {
          color: white;
          margin: 0 12px;
          user-select: none;
          flex-shrink: 0;
        }
        .emergency-number {
          font-weight: 600;
        }
        .ambulance-icon {
          color: red;
          margin-right: 8px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          font-weight: 700;
          font-size: 18px;
        }
        .location-container {
          background-color: white;
          color: #193d81;
          font-weight: 600;
          padding: 3px 14px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
          position: relative;
        }
        .location-label {
          margin-right: 10px;
          font-weight: 700;
        }
        select.location-select {
          background-color: transparent;
          color: #193d81;
          border: none;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          padding-right: 12px;
          font-size: 15px;
          font-family: inherit;
          user-select: text;
        }
        .location-container::after {
          content: '';
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          border: 6px solid transparent;
          border-top-color: #193d81;
          pointer-events: none;
        }
        @media (max-width: 480px) {
          .mini-navbar {
            font-size: 13px;
            height: 36px;
            padding: 0 8px;
          }
          .mini-navbar-left {
            gap: 12px;
            padding-left: 30px; /* smaller on mobile */
          }
          .mini-navbar-right {
            padding-right: 30px;
          }
          .icon-circle {
            width: 20px;
            height: 20px;
            font-size: 12px;
            margin-right: 6px;
          }
          .ambulance-icon {
            font-size: 16px;
          }
          .location-container {
            padding: 2px 10px;
            font-size: 13px;
            border-radius: 16px;
          }
          select.location-select {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="mini-navbar" role="banner" aria-label="Top contact and emergency info">
        <div className="mini-navbar-left">
          {/* Call Icon */}
          <div className="mini-navbar-item">
            <div className="icon-circle" aria-label="Call icon">
              <FaPhoneAlt size={12} />
            </div>
            <span>+91 12345 67890</span>
          </div>

          {/* Mail Icon + mail id */}
          <div className="mini-navbar-item">
            <div className="icon-circle" aria-label="Mail icon">
              <FaEnvelope size={12} />
            </div>
            <span>mail@example.com</span>
          </div>

          <div className="separator" aria-hidden="true">|</div>

          {/* Emergency */}
          <div className="mini-navbar-item emergency-number">
            Emergency: +91 89810 80008
          </div>

          <div className="separator" aria-hidden="true">|</div>

          {/* Ambulance red icon + number */}
          <div className="mini-navbar-item ambulance-icon" aria-label="Ambulance icon">
            <FaAmbulance size={18} />
            <span style={{ marginLeft: "6px", color: "white", fontWeight: "600" }}>
              Ambulance: +91 90382 24000 / +91 90382 25000
            </span>
          </div>

          <div className="separator" aria-hidden="true">|</div>

          {/* Location Dropdown */}
          <div className="mini-navbar-item location-container">
            <span className="location-label">Location:</span>
            <select
              id="location-select"
              className="location-select"
              value={location}
              onChange={handleLocationChange}
              aria-label="Select location"
            >
              <option value="Kolkata">Kolkata</option>
              <option value="Guahati">Guahati</option>
            </select>
          </div>
        </div>

        {/* Right side empty */}
        <div className="mini-navbar-right" aria-hidden="true"></div>
      </div>
    </>
  );
};

export default MiniNavbar;
