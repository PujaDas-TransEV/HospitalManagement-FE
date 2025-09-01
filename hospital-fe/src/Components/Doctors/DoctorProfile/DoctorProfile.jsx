import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DoctorNavbar from "../DoctorNavbar/DoctorNAvbar";
import DoctorSidebar from "../DoctorSidebar/Doctorsidebar";
import defaultProfile from "../../Assests/default.jpg";
import backgroundImage from "../../Assests/background.jpg";
import { FaSpinner } from "react-icons/fa";
import "./DoctorProfile.css"; // Reuse same styling as PatientProfile

const DoctorProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    dob: "",
    address: "",
    specialization: "",
    gender: "",
    license_number: "",
    yoe: "",
    qualification: "",
  });

  const [doctorId, setDoctorId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const decodedToken = jwtDecode(accessToken);
        const doctorIdFromToken = decodedToken.doctorid;
        setDoctorId(doctorIdFromToken);

        const formData = new FormData();
        formData.append("doctorid", doctorIdFromToken);

        const response = await fetch("https://backend.medapp.transev.site/doctors/getbyid", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        });

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
        setIsLoading(false);
      }
    };

    fetchDoctorProfile();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsUpdated(true);
  };

  const handleUpdateProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken || !doctorId) {
      setError("Doctor ID or token missing.");
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("doctorid", doctorId);
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    if (newImage) {
      const imageBlob = dataURItoBlob(newImage);
      formDataObj.append("profile_picture", imageBlob, "profile_picture.jpg");
    }

    try {
      const response = await fetch("https://backend.medapp.transev.site/doctors/updatedata", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formDataObj,
      });

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

  const profileImageUrl =
    newImage ||
    (profileData?.profilepictures
      ? `data:image/jpeg;base64,${profileData.profilepictures}`
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
      <DoctorNavbar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="home-content">
          <DoctorSidebar />
          <div className="profile-container">
            <div className="profile-header">
              <h2>My Profile</h2>
            </div>
  {isLoading && (
              <div className="loading-overlay" aria-label="Loading">
                <FaSpinner className="spinner-icon" />
              </div>
            )}
           
                {!isLoading && (
              <div className="profile-card" style={{ backgroundColor: "#e0f7fa", padding: "20px", borderRadius: "8px" }}>
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
                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>Full Name:</label>
                      <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>Phone Number:</label>
                      <input
                        type="text"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>Date of Birth:</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>Address:</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>Specialization:</label>
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                      />
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

                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>Qualification:</label>
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>YOE:</label>
                      <input
                        type="text"
                        name="yoe"
                        value={formData.yoe}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="profile-detail-row">
                    <div className="input-group">
                      <label>License Number:</label>
                      <input
                        type="text"
                        name="license_number"
                        value={formData.license_number}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <button
                  onClick={handleUpdateProfile}
                  className="update-button"
                  disabled={!isUpdated}
                  style={{ display: "block", margin: "20px auto 0 auto", width: "150px" }}
                >
                  Update Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
