// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaBars, FaCaretDown } from "react-icons/fa";
// import { jwtDecode } from "jwt-decode";
// import MiniNavbar from "../MiniNavbar/Mininavbar";
// import "./Navbar.css";

// const Navbar = () => {
//   const [isMenuActive, setMenuActive] = useState(false);
//   const [profilePic, setProfilePic] = useState("/images/default-profile.jpg");
//   const [showLoginMenu, setShowLoginMenu] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userType, setUserType] = useState(null);
//  const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) return;

//     try {
//       const decoded = jwtDecode(token);
//       const userId = decoded.userid || decoded.doctorid;
//       const role = decoded.userType || decoded.role;

//       if (!userId || !role) return;

//       setIsLoggedIn(true);
//       setUserType(role);

//       const fetchProfile = async () => {
//         let url = "";
//         const formData = new FormData();

//         if (role === "doctor") {
//           url = "https://backend.medapp.transev.site/doctors/getbyid";
//           formData.append("doctorid", userId);
//         } else if (role === "patient") {
//           url = "https://backend.medapp.transev.site/patients/profile/getbyid";
//           formData.append("patientid", userId);
//         }

//         try {
//           const response = await fetch(url, {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//             body: formData,
//           });

//           const data = await response.json();
//           const picture = data?.data?.profilepictures || data?.data?.profilepicture;

//           if (response.ok && picture) {
//             setProfilePic(`data:image/jpeg;base64,${picture}`);
//           } else {
//             setProfilePic("/images/default-profile.jpg");
//           }
//         } catch (err) {
//           setProfilePic("/images/default-profile.jpg");
//         }
//       };

//       fetchProfile();
//     } catch (err) {
//       setIsLoggedIn(false);
//       setProfilePic("/images/default-profile.jpg");
//     }
//   }, []);

//     const goToProfile = () => {
//     if (userType === 'doctor') {
//       navigate('/doctordashboard');
//     } else if (userType === 'patient') {
//       navigate('/patient-dashboard');
//     }
//   };

//   const handleLoginClick = () => {
//     setShowDropdown((prev) => !prev);
//   };

//   const handlePatientLogin = () => {
//     navigate('/login');
//     setShowDropdown(false);
//   };

//   const handleDoctorLogin = () => {
//     navigate('/doctor-login');
//     setShowDropdown(false);
//   };
//    const handleAdminLogin = () => {
//     navigate('/admin/login');
//     setShowDropdown(false);
//   };
//   const handleGuestLogin = () => {
//     navigate('/guest/login');
//     setShowDropdown(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     setIsLoggedIn(false);
//     setUserType(null);
//     setProfilePic('/images/default-profile.jpg');
//     navigate('/');
//   };


//   return (
//     <>
//       <MiniNavbar />
//       <nav
//         className="main-nav"
//         style={{
//           height: "90px",
//           backgroundColor: "#ffffff",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 20px",
//           position: "sticky",
//           top: 0,
//           zIndex: 1000,
//           boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <div className="logo">
//         <Link
//   to="/"
//   className="logo-link"
//   style={{
//     fontSize: "28px",
//     fontWeight: "bold",
//     textDecoration: "none",
//     display: "inline-block",
//   }}
// >
//   <span style={{ color: "#008000" }}>Life</span>
//   <span style={{ color: "#FFA500" }}>Care</span>
// </Link>

//         </div>

      

//         <ul className={isMenuActive ? "nav-menu active" : "nav-menu"}>
//           <li><Link to="/" className="nav-linkk"   style={{ fontSize: "18px" }}>Home</Link></li>
//           <li className="has-dropdown">
//             <span className="nav-linkk"  style={{ fontSize: "18px" }}>About Us <FaCaretDown /></span>
//             <div className="dropdown">
//               {["Company Overview", "Mission & Vision", "Board of Directors", "Board Committees", "CSR Policy", "Remuneration Policy"].map((txt) => (
//                 <Link key={txt} to={`/${txt.replace(/\s+/g, "").toLowerCase()}`}>{txt}</Link>
//               ))}
//             </div>
//           </li>
//           <li className="has-dropdown">
//             <span className="nav-linkk"  style={{ fontSize: "18px" }}>Patients <FaCaretDown /></span>
//             <div className="dropdown">
//               {["Patient Guide", "International Patient", "Testimonials", "Book an Appointment", "Case Study"].map((txt) => (
//                 <Link key={txt} to={`/${txt.replace(/\s+/g, "").toLowerCase().replace("&", "")}`}>{txt}</Link>
//               ))}
//             </div>
//           </li>
//           <li className="has-dropdown">
//             <span className="nav-linkk"  style={{ fontSize: "18px" }}>Departments <FaCaretDown /></span>
//             <div className="dropdown">
//               {["Anaesthesiology", "Cardiology", "Urology"].map((txt) => (
//                 <Link key={txt} to={`/departments/${txt.toLowerCase().replace(/ & | /g, "-")}`}>{txt}</Link>
//               ))}
//             </div>
//           </li>
//           <li className="has-dropdown">
//             <span className="nav-linkk"  style={{ fontSize: "18px" }}>Services <FaCaretDown /></span>
//             <div className="dropdown">
//               {["Our Clinics", "Special Clinics", "Day Care Unit", "Operation Theatre", "ICCU/ITU", "Blood Centre", "Diagnostic Services", "Health Check Up", "Packages"].map((txt) => (
//                 <Link key={txt} to={`/services/${txt.replace(/\s+/g, "").toLowerCase().replace(/\/|&/g, "")}`}>{txt}</Link>
//               ))}
//             </div>
//           </li>
//           <li><Link to="/ourdoctors" className="nav-linkk"  style={{ fontSize: "18px" }}>Our Doctors</Link></li>
//           <li className="has-dropdown">
//             <span className="nav-linkk"  style={{ fontSize: "18px" }}>Academics <FaCaretDown /></span>
//             <div className="dropdown">
//               {["Medical", "Nursing", "Lifecare College of Physiotherapy", "Paramedical", "Hospital Administration"].map((txt) => (
//                 <Link key={txt} to={`/academics/${txt.replace(/\s+/g, "").toLowerCase().replace(/ /g, "-")}`}>{txt}</Link>
//               ))}
//             </div>
//           </li>
//           <li><Link to="/gallery" className="nav-linkk"  style={{ fontSize: "18px" }}>Gallery</Link></li>
//           <li><Link to="/blog" className="nav-linkk"  style={{ fontSize: "18px" }}>Blog</Link></li>
//           <li><Link to="/contact" className="nav-linkk"  style={{ fontSize: "18px" }}>Contact Us</Link></li>
//         </ul>

//      {isLoggedIn && (userType === 'doctor' || userType === 'patient') ? (
//          <img
//            src={profilePic}
//           alt="Profile"
//           className="profile-pic"
//           onClick={goToProfile}
//           title="Go to Profile"
//         />
//       ) : (
//         <div className="login-dropdown">
//           <button className="login-btn" onClick={handleLoginClick}>Login</button>
//           {showDropdown && (
//             <div className="dropdown-menu">
//               <button onClick={handlePatientLogin}>Patient Login</button>
//               <button onClick={handleDoctorLogin}>Doctor Login</button>
//                 <button onClick={handleAdminLogin}>Admin Login</button>
//                <button onClick={handleGuestLogin}>Guest Login</button>
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//      </>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import MiniNavbar from "../MiniNavbar/Mininavbar";
import "./Navbar.css";

const sections = [
  { name: "Home", path: "/" },
  {
    name: "About Us", sub: ["Company Overview", "Mission & Vision", "Board of Directors", "Board Committees", "CSR Policy", "Remuneration Policy"]
  },
  {
    name: "Patients", sub: ["Patient Guide", "International Patient", "Testimonials", "Book an Appointment", "Case Study"]
  },
  {
    name: "Departments", sub: ["Anaesthesiology", "Cardiology", "Urology"]
  },
  {
    name: "Services", sub: ["Our Clinics", "Special Clinics", "Day Care Unit", "Operation Theatre", "ICCU/ITU", "Blood Centre", "Diagnostic Services", "Health Check Up", "Packages"]
  },
  { name: "Our Doctors", path: "/ourdoctors" },
  {
    name: "Academics", sub: ["Medical", "Nursing", "Lifecare College of Physiotherapy", "Paramedical", "Hospital Administration"]
  },
  { name: "Gallery", path: "/gallery" },
  { name: "Blog", path: "/blog" },
  { name: "Contact Us", path: "/contact" }
];

export default function Navbar() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [profilePic, setProfilePic] = useState("/images/default-profile.jpg");
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const d = jwtDecode(token);
      const id = d.userid || d.doctorid;
      const rt = d.userType || d.role;
      if (!id || !rt) return;
      setLoggedIn(true);
      setUserType(rt);
      (async () => {
        const url = rt === "doctor"
          ? "https://backend.medapp.transev.site/doctors/getbyid"
          : "https://backend.medapp.transev.site/patients/profile/getbyid";
        const fd = new FormData();
        fd.append(rt === "doctor" ? "doctorid" : "patientid", id);
        const r = await fetch(url, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        });
        const dd = await r.json();
        const pic = dd?.data?.profilepictures || dd?.data?.profilepicture;
        setProfilePic(r.ok && pic ? `data:image/jpeg;base64,${pic}` : "/images/default-profile.jpg");
      })();
    } catch { }
  }, []);

  const handleLogin = path => {
    navigate(path);
    setShowDropdown(false);
    setOpenSidebar(false);
  };

  return <>
    <MiniNavbar />
    <nav className="main-nav fixed-navbar">
      <div className="logo">
        <Link to="/" className="logo-link">Life<span style={{color:"#FFA500"}}>Care</span></Link>
      </div>
      <div className="desktop-menu">
        {sections.map(sec => sec.sub ? (
          <div key={sec.name} className="has-dropdown">
            <span className="nav-linkk">{sec.name} <FaCaretDown/></span>
            <div className="dropdown">
              {sec.sub.map(txt => (
                <Link key={txt} to={`/${txt.replace(/\s+/g,'').toLowerCase()}`}>{txt}</Link>
              ))}
            </div>
          </div>
        ) : (
          <Link key={sec.name} to={sec.path} className="nav-linkk">{sec.name}</Link>
        ))}
      </div>
      <div className="right-area">
        {isLoggedIn ? (
          <img src={profilePic} className="profile-pic" alt="Profile" onClick={() => navigate(userType === "doctor" ? "/doctordashboard" : "/patient-dashboard")}/>
        ) : (
          <div className="login-dropdown">
            <button className="login-btn" onClick={() => setShowDropdown(d => !d)}>Login</button>
            {showDropdown && <div className="dropdown-menu">
              <button onClick={()=>handleLogin("/login")}>Patient Login</button>
              <button onClick={()=>handleLogin("/doctor-login")}>Doctor Login</button>
              <button onClick={()=>handleLogin("/admin/login")}>Admin Login</button>
              <button onClick={()=>handleLogin("/guest/login")}>Guest Login</button>
            </div>}
          </div>
        )}
        <div className="menu-icon" onClick={() => setOpenSidebar(o => !o)}>
          {openSidebar ? <FaTimes/> : <FaBars/>}
        </div>
      </div>
    </nav>

    {openSidebar && <div className="mobile-sidebar">
      <div className="sidebar-content">
        {sections.map(sec => (
          <div key={sec.name} className="mobile-section">
            {sec.sub ? (
              <div>
                <button className="mobile-section-title" onClick={()=>setExpanded(e =>({...e,[sec.name]:!e[sec.name]}))}>
                  {sec.name} <FaCaretDown className={`arrow ${expanded[sec.name]?'open':''}`}/>
                </button>
                {expanded[sec.name] && <div className="mobile-sublinks">
                  {sec.sub.map(txt=>(
                    <Link key={txt} to={`/${txt.replace(/\s+/g,'').toLowerCase()}`} onClick={()=>setOpenSidebar(false)}>{txt}</Link>
                  ))}
                </div>}
              </div>
            ) : (
              <Link to={sec.path} onClick={()=>setOpenSidebar(false)}>{sec.name}</Link>
            )}
          </div>
        ))}

        <div className="mobile-login">
          {isLoggedIn ? (
            <img src={profilePic} className="profile-pic" onClick={()=>navigate(userType==="doctor"?"/doctordashboard":"/patient-dashboard")}/>
          ) : ["Patient","Doctor","Admin","Guest"].map(who=>(
            <button key={who} onClick={()=>handleLogin(`/`+who.toLowerCase()+"-login")}>{who} Login</button>
          ))}
        </div>
      </div>
    </div>}
  </>;
}

