import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode the token
import "./PatientSettings.css";
import PatientNavbar from "../Navbar/PatientNavbar";
import PatientSidebar from "../Sidebar/PatientSidebar";

const PatientSettings = () => {
  const navigate = useNavigate();
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Error state
  const [successMessage, setSuccessMessage] = useState(null); // Success state

  // State for managing the modal visibility
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Handle Change Password
  const handleChangePassword = () => {
    setIsPasswordModalOpen(true); // Open the confirmation modal
  };

  // Handle Delete Account
  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true); // Open the confirmation modal
  };

  // Function to confirm password change
  const confirmPasswordChange = () => {
    setIsPasswordModalOpen(false); // Close the modal
    navigate("/password"); // Redirect to the password change page
  };

  // Function to confirm account deletion
  const confirmAccountDeletion = async () => {
    setIsDeleteModalOpen(false); // Close the modal
    if (isDeleteConfirmed) {
      try {
        // Get the access token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          setErrorMessage("No access token found. Please log in again.");
          return;
        }

        // Decode the token to get the patientId (userid)
        const decodedToken = jwtDecode(accessToken);
        const patientId = decodedToken.userid; // Assuming patientId is stored as 'userid'

        // Create FormData to send the patientId in the request
        const formData = new FormData();
        formData.append("patientid", patientId);

        // Make the API call to delete the account
        const response = await fetch("http://192.168.0.106:5000/patientops/deleteprofile", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`, // Include token in the headers
          },
          body: formData, // Send the patientId as form data
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage("Your account has been deleted successfully.");
          setErrorMessage(null); // Clear any error messages
          // Optionally, redirect the user to login page after deletion
          // navigate("/login");
        } else {
          setErrorMessage(data.message || "Failed to delete account.");
          setSuccessMessage(null); // Clear success messages
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        setErrorMessage("An error occurred while deleting your account.");
        setSuccessMessage(null); // Clear success messages
      }
    }
  };

  // Function to close the modal without action
  const closeModal = () => {
    setIsPasswordModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      {/* Navbar at the top */}
      <PatientNavbar />

      <div className="dashboard-content">
        {/* Sidebar for navigation */}
        <PatientSidebar />
        <div className="settings-container-patient">
          <h1 className="settings-title">Patient Settings</h1>

          {/* Change Password Section */}
          <div className="settings-section">
            <h2 className="section-title">Change Password</h2>
            <p>
              To change your password, click the button below. You will be redirected to the
              "Forgot Password" page where you can reset your password.
            </p>
            <button className="action-button" onClick={handleChangePassword}>
              Change Password
            </button>
          </div>

          {/* Delete Account Section */}
          <div className="settings-section">
            <h2 className="section-title">Delete Account</h2>
            <p>
              If you wish to delete your account, please toggle the button below to confirm.
            </p>
            <div className="toggle-container">
              <label htmlFor="delete-toggle" className="toggle-label">Confirm Account Deletion:</label>
              <input
                type="checkbox"
                id="delete-toggle"
                checked={isDeleteConfirmed}
                onChange={() => setIsDeleteConfirmed(!isDeleteConfirmed)}
                className="toggle-checkbox"
              />
            </div>
            {isDeleteConfirmed && (
              <button className="delete-button" onClick={handleDeleteAccount}>
                Confirm Delete Account
              </button>
            )}
          </div>

          {/* Error and Success Messages */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          {/* Password Change Modal */}
          {isPasswordModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Are you sure you want to change your password?</h3>
                <div className="modal-buttons">
                  <button className="modal-button" onClick={confirmPasswordChange}>Yes</button>
                  <button className="modal-button" onClick={closeModal}>No</button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Account Modal */}
          {isDeleteModalOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Are you sure you want to delete your account?</h3>
                <div className="modal-buttons">
                  <button className="modal-button" onClick={confirmAccountDeletion}>Yes</button>
                  <button className="modal-button" onClick={closeModal}>No</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientSettings;

