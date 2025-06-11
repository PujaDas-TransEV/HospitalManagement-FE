import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Correctly import jwt-decode
import "./MyProfile.css";
import PatientNavbar from "../Navbar/PatientNavbar";
import PatientSidebar from "../Sidebar/PatientSidebar";

const PatientProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [newImage, setNewImage] = useState(null); // For storing uploaded profile image
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
    gender: "", // New field for gender
  });

  const [isUpdated, setIsUpdated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login"); // Redirect if no token
        return;
      }

      try {
        // Decode the token to get patientId
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid;

        // Create FormData and append patientId
        const formData = new FormData();
        formData.append("patientid", patientId);

        // Fetch patient data from API
        const response = await fetch("http://192.168.0.106:5000/patients/profile/getbyid", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`, // Add the Authorization header
          },
          body: formData, // Send the formData in the body of the request
        });

        const data = await response.json();

        if (response.ok) {
          setProfileData(data.data); // Set the fetched profile data
          setFormData(data.data); // Pre-fill the form with fetched data
        } else {
          setError(data.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("An error occurred while fetching the profile.");
      }
    };

    fetchPatientProfile();
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result); // Set the selected image as base64
        setIsUpdated(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(accessToken); // Decode the token
    const patientId = decodedToken.userid; // Extract the patientId from the token

    const formDataObj = new FormData();
    formDataObj.append("patientid", patientId); // Add the patientId to the form data
    formDataObj.append("firstname", formData.firstname);
    formDataObj.append("lastname", formData.lastname);
    formDataObj.append("email", formData.email);
    formDataObj.append("phonenumber", formData.phonenumber);
    formDataObj.append("dob", formData.dob);
    formDataObj.append("address", formData.address);
    formDataObj.append("bloodgroup", formData.bloodgroup);
    formDataObj.append("age", formData.age);
    formDataObj.append("weight", formData.weight);
    formDataObj.append("height", formData.height);
    formDataObj.append("gender", formData.gender);

    if (newImage) {
      const imageBlob = dataURItoBlob(newImage); // Convert base64 to Blob
      formDataObj.append("profilepicture", imageBlob, "profilepicture.jpg");
    }

    try {
      const response = await fetch("http://192.168.0.106:5000/patients/profile/update", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formDataObj,
      });

      const data = await response.json();
      if (response.ok) {
        setProfileData(data.data); // Update the profile data with the new profile image
        setSuccessMessage("Profile updated successfully!");
        setError(""); // Clear any previous errors
      } else {
        setError(data.message || "Failed to update profile.");
        setSuccessMessage(""); // Clear any previous success messages
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("An error occurred while updating profile.");
      setSuccessMessage(""); // Clear success message
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setIsUpdated(true); // Mark as updated
  };

  return (
    <div className="home-page">
      <PatientNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100" style={{ backgroundImage: 'url(/Assests/background.jpg)' }}>
        <div className="home-content flex flex-row">
          <PatientSidebar />
          <div className="profile-container">
            <div className="profile-header">
              <h2>My Profile</h2>
        
</div>
            <div className="profile-card">
              <div className="profile-image-container">
                {/* Clickable Profile Image */}
                <div
                  className="profile-image"
                  style={{
                    backgroundImage: `url(${newImage || (profileData?.profilepicture ? 'data:image/jpeg;base64,' + profileData.profilepicture : '/images/default-profile.jpg')})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer", // Make it clickable
                  }}
                  onClick={() => document.getElementById("fileInput").click()} // Trigger file input when profile image is clicked
                >
                  <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }} // Hide the file input
                    onChange={handleImageChange}
                  />
                </div>
              </div>
           
              <div className="profile-details">
  {/* Row 1: First Name and Last Name */}
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

  {/* Row 2: Email and Phone Number */}
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

  {/* Row 3: Date of Birth and Address */}
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

  {/* Row 4: Blood Group and Age */}
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

  {/* Row 5: Weight and Height */}
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
    <div className="input-group">
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

  {/* Row 6: Gender */}
  <div className="profile-detail-row">
    <div className="input-group full-width">
      <label>Gender:</label>
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
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
  );
};

export default PatientProfile;
