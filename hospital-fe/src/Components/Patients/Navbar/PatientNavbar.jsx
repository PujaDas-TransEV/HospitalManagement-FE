
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./PatientNavbar.css";


const PatientNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    profilePicture: "/images/default-profile.jpg", 
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid;

        const formData = new FormData();
        formData.append("patientid", patientId);

        const response = await fetch("http://192.168.0.106:5000/patients/profile/getbyid", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setProfileData({
            firstname: data.data.firstname,
            lastname: data.data.lastname,
            profilePicture: `data:image/jpeg;base64,${data.data.profilepicture}`,
          });
        } else {
          console.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchPatientData();
  }, [navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMyProfile = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/"); 
  };

  return (
    <div className="navbar">
      <div className="brand-name">LifeCare</div>
      <div className="profile-info" onClick={toggleDropdown}>
        <img
          src={profileData.profilePicture}
          alt="Profile"
          className="profile-img"
        />
        <span className="patient-names">{profileData.firstname} {profileData.lastname}</span>

        {isDropdownOpen && (
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={handleMyProfile}>
              My Profile
            </button>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientNavbar;
