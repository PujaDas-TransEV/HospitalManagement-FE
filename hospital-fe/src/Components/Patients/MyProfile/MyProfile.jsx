
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { FaSpinner } from "react-icons/fa";
import "./MyProfile.css";
import PatientNavbar from "../Navbar/PatientNavbar";
import PatientSidebar from "../Sidebar/PatientSidebar";
import defaultProfile from "../../Assests/default.jpg";
import backgroundImage from "../../Assests/background.jpg";

const PatientProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // NEW: loading for initial fetch

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    dob: "",
    address: "",
    bloodgroup: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      setIsLoading(true); // start loading spinner

      try {
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid;

        const formDataObj = new FormData();
        formDataObj.append("patientid", patientId);

        const response = await fetch(
          "http://192.168.0.106:5000/patients/profile/getbyid",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: formDataObj,
          }
        );

        const data = await response.json();

        if (response.ok) {
          setProfileData(data.data);
          setFormData(data.data);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("An error occurred while fetching the profile.");
      } finally {
        setIsLoading(false); // stop loading spinner
      }
    };

    fetchPatientProfile();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result);
        setIsUpdated(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([uintArray], { type: "image/jpeg" });
  };

  const handleUpdateProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You must be logged in to update your profile.");
      return;
    }

    const decodedToken = jwtDecode(accessToken);
    const patientId = decodedToken.userid;

    const formDataObj = new FormData();
    formDataObj.append("patientid", patientId);
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    if (newImage) {
      const imageBlob = dataURItoBlob(newImage);
      formDataObj.append("profilepicture", imageBlob, "profilepicture.jpg");
    }

    try {
      const response = await fetch(
        "http://192.168.0.106:5000/patients/profile/update",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formDataObj,
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProfileData(data.data);
        setSuccessMessage("Profile updated successfully!");
        setError(null);
        setIsUpdated(false);
        setNewImage(null);
      } else {
        setError(data.message || "Failed to update profile.");
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An error occurred while updating profile.");
      setSuccessMessage(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsUpdated(true);
  };

  const profileImageUrl =
    newImage ||
    (profileData?.profilepicture
      ? `data:image/jpeg;base64,${profileData.profilepicture}`
      : defaultProfile);

  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <PatientNavbar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="home-content">
          <PatientSidebar />
          <div className="profile-container">
            <div className="profile-header">
              <h2>My Profile</h2>
            </div>

            {/* Show spinner only when loading initial data */}
            {isLoading && (
              <div className="loading-overlay" aria-label="Loading">
                <FaSpinner className="spinner-icon" />
              </div>
            )}

            {/* Show profile form only when NOT loading */}
            {!isLoading && (
              <div
                className="profile-card"
                style={{
                  backgroundColor: "#e0f7fa",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <div className="profile-image-container">
                  <div
                    className="profile-image"
                    style={{ backgroundImage: `url(${profileImageUrl})` }}
                    onClick={() => document.getElementById("fileInput").click()}
                    title="Click to change profile picture"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        document.getElementById("fileInput").click();
                      }
                    }}
                  >
                    <input
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="profile-details">
                  {/* 2 per row */}
                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>First Name:</label>
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>Last Name:</label>
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>Phone Number:</label>
                      <input
                        type="text"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>Date of Birth:</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>Address:</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>Blood Group:</label>
                      <input
                        type="text"
                        name="bloodgroup"
                        value={formData.bloodgroup}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>Age:</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>Weight:</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group" style={{ position: "relative" }}>
                      <label>Height:</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                      />
                      <span className="unit-text">cm</span>
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="input-group full-width">
                      <label>Gender:</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}

            {/* Show Update button only if NOT loading */}
            {!isLoading && (
             
              <button
  onClick={handleUpdateProfile}
  className="update-button"
  disabled={!isUpdated}
  style={{
    display: "block",
    margin: "20px auto 0 auto", // centers horizontally with top margin
    width: "150px",
  }}
>
  Update Profile
</button>

            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
