
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./PatientNavbar.css";

const PatientNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    firstname: "",
    lastname: "",
    profilePicture: "/images/default-profile.jpg", // Default image path
  });
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch patient data on component mount
  useEffect(() => {
    const fetchPatientData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login"); // Redirect to login if no access token is available
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken); // Decode the token to get the patientId
        const patientId = decodedToken.userid;

        // Create FormData and append patientId (no need to append firstname and lastname)
        const formData = new FormData();
        formData.append("patientid", patientId);

        // Fetch patient profile data from the backend API
        const response = await fetch("http://localhost:5000/patients/profile/getbyid", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData, // Send the formData in the body of the request
        });

        const data = await response.json();

        if (response.ok) {
          // Update the profile data state with fetched data
          setProfileData({
            firstname: data.data.firstname, // Extract firstname
            lastname: data.data.lastname, // Extract lastname
            profilePicture: `data:image/jpeg;base64,${data.data.profilepicture}`, // Extract base64 profile picture
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

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Navigate to the profile page
  const handleMyProfile = () => {
    navigate("/profile");
  };

  // Logout functionality
  const handleLogout = () => {
    // Clear user session data (e.g., remove token)
    localStorage.removeItem("accessToken"); // Adjust according to your authentication logic

    // Navigate to the login page after logging out
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="brand-name">Dashboard</div>
      <div className="profile-info">
        <img
          src={profileData.profilePicture} // Use the dynamic profile picture
          alt="Profile"
          className="profile-img"
          onClick={toggleDropdown}
        />
        <span className="patient-name">{profileData.firstname} {profileData.lastname}</span> {/* Display first and last name */}

        {/* Dropdown Menu */}
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
