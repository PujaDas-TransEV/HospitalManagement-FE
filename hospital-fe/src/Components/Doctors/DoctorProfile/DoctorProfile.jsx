import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Ensure you are using the correct import for jwt-decode
import "./DoctorProfile.css";
import DoctorNavbar from '../DoctorNavbar/DoctorNAvbar';
import DoctorSidebar from '../DoctorSidebar/Doctorsidebar';

const DoctorProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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

  const [doctorId, setDoctorId] = useState(null); // Store doctor ID here
  const [isUpdated, setIsUpdated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const doctorIdFromToken = decodedToken.doctorid; // Get the doctor ID from the token

        setDoctorId(doctorIdFromToken); // Set the doctorId to the state

        const formData = new FormData();
        formData.append("doctorid", doctorIdFromToken);

        const response = await fetch("http://localhost:5000/doctors/getbyid", {
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
        } else {
          setError(data.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("An error occurred while fetching the profile.");
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
    formDataObj.append("doctorid", doctorId); // Use the doctor ID obtained from profile
    formDataObj.append("fullname", formData.fullname);
    formDataObj.append("email", formData.email);
    formDataObj.append("phonenumber", formData.phonenumber);
    formDataObj.append("dob", formData.dob);
    formDataObj.append("address", formData.address);
    formDataObj.append("specialization", formData.specialization);
    formDataObj.append("gender", formData.gender);
    formDataObj.append("license_number", formData.license_number);
    formDataObj.append("yoe", formData.yoe);
    formDataObj.append("qualification", formData.qualification);

    if (newImage) {
      const imageBlob = dataURItoBlob(newImage);
      formDataObj.append("profilepicture", imageBlob, "profilepicture.jpg");
    }

    try {
      const response = await fetch("http://localhost:5000/doctors/profile/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataObj,
      });

      const data = await response.json();
      if (response.ok) {
        setProfileData(data.data);
        setSuccessMessage("Profile updated successfully!");
        setError(null);
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

  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([uintArray], { type: "image/jpeg" });
  }

  return (
    <div className="home-page">
      <DoctorNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100" style={{ backgroundImage: "url(/Assests/background.jpg)" }}>
        <div className="home-content flex flex-row">
          <DoctorSidebar />
          <div className="profile-container">
            <div className="profile-header">
              <h2>My Profile</h2>
            </div>
            <div className="profile-card">
              <div className="profile-image-container">
                <div
                  className="profile-image"
                  style={{
                    backgroundImage: `url(${newImage || (profileData?.profilepicture ? 'data:image/jpeg;base64,' + profileData.profilepicture : '/images/default-profile.jpg')})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="profile-details">
                {/* Profile fields */}
                <div className="profile-detail-row">
                  <div className="input-group half-width">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group half-width">
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
                  <div className="input-group half-width">
                    <label>Phone Number:</label>
                    <input
                      type="text"
                      name="phonenumber"
                      value={formData.phonenumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group half-width">
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
                  <div className="input-group half-width">
                    <label>Address:</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group half-width">
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
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="profile-detail-row">
                  <div className="input-group half-width">
                    <label>Qualification:</label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group half-width">
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
                  <div className="input-group half-width">
                    <label>License Number:</label>
                    <input
                      type="text"
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <button onClick={handleUpdateProfile} className="update-button">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
